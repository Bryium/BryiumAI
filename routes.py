from flask import Blueprint, redirect, render_template, request, jsonify, url_for
from datetime import datetime
import os
from bs4 import BeautifulSoup
from nltk.tokenize import word_tokenize
import requests
from models import db
from google.oauth2 import id_token
from google.auth.transport.requests import Request
from dotenv import load_dotenv
from conversation_history import get_conversation_history, update_conversation_history
from werkzeug.security import generate_password_hash, check_password_hash
from models import User
from flask_login import login_user


# Load environment variables from .env file
load_dotenv()

# Create a blueprint
main_bp = Blueprint('main', __name__)

# Google client ID 
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

# Get the Gemini API key and endpoint from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = os.getenv("GEMINI_API_URL")
GOOGLE_SEARCH_API_KEY = os.getenv("GOOGLE_SEARCH_API_KEY")
GOOGLE_SEARCH_CX = os.getenv("GOOGLE_SEARCH_CX")

# Routes
@main_bp.route('/')
def index():
    return render_template('bryium.html')

@main_bp.route('/home')
def home():
    return render_template('home.html')


# Login
@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            data = request.get_json()
            print("Received data:", data)

            # --- Traditional Email/Password Login ---
            if 'email' in data and 'password' in data:
                email = data['email']
                password = data['password']

                user = User.query.filter_by(email=email).first()
                if user and check_password_hash(user.password, password):
                    login_user(user)
                    print("Traditional login successful for:", email)
                    return jsonify({"success": True, "message": "Login successful"}), 200
                else:
                    print("Invalid credentials for:", email)
                    return jsonify({"success": False, "message": "Incorrect email or password"}), 400

            # --- Google Sign-In Login ---
            elif 'token' in data:
                try:
                    token = data['token']
                    print("Received Google token:", token)

                    id_info = id_token.verify_oauth2_token(token, Request(), GOOGLE_CLIENT_ID)
                    print("Verified ID token info:", id_info)

                    if id_info["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
                        print("Invalid token issuer:", id_info["iss"])
                        return jsonify({"success": False, "message": "Invalid token issuer"}), 400

                    email = id_info["email"]
                    username = id_info.get("name", "")
                    picture = id_info.get("picture", "")

                    user = User.query.filter_by(email=email).first()
                    if not user:
                        user = User(email=email, username=username, profile_picture=picture)
                        db.session.add(user)
                        try:
                            db.session.commit()
                            print("New Google user created:", email)
                        except Exception as db_error:
                            db.session.rollback()
                            print("DB error while creating user:", db_error)
                            return jsonify({"success": False, "message": "Database error"}), 400
                    else:
                        print("Existing Google user logged in:", email)

                    login_user(user)
                    return jsonify({"success": True, "message": "Google Sign-In successful"}), 200

                except Exception as e:
                    print("Google Sign-In error:", e)
                    return jsonify({"success": False, "message": str(e)}), 400

            else:
                print("Missing credentials in request.")
                return jsonify({"success": False, "message": "Missing login credentials"}), 400

        except Exception as outer_error:
            print("Unexpected POST error:", outer_error)
            return jsonify({"success": False, "message": "Something went wrong"}), 500

    # If GET method
    return render_template('login.html')




@main_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password != confirm_password:
            return jsonify({"success": False, "message": "Passwords do not match. Please try again."}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"success": False, "message": "Email already registered. Please login."}), 400

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        new_user = User(username=username, email=email, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"success": True, "message": "Registration successful!"})

    return render_template('register.html')

@main_bp.route('/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email')

    # Check if email exists in the database
    if User.query.filter_by(email=email).first():
        return jsonify({"exists": True}), 200
    return jsonify({"exists": False}), 200

@main_bp.route('/chat', methods=['POST'])
def get_response():
    user_message = request.json.get('message', '').strip()
    user_id = request.json.get('user_id', 'default_user')  

    if not user_message:
        return jsonify({'response': "I didn't get that. Can you rephrase?"})

    # Normalize and clean user input
    cleaned_message = clean_and_normalize_text(user_message)

    # Retrieve past conversation history
    history = get_conversation_history(user_id)

    # Check for date queries
    if "todays date" in cleaned_message or "what is the date" in cleaned_message:
        response = get_current_date()
    elif should_search_internet(cleaned_message):
        search_results = fetch_search_results(cleaned_message)
        response = search_results if search_results else "I couldn't find relevant information online."
    else:
        # Include conversation history for context
        full_query = " ".join(history[-5:]) + " " + cleaned_message  
        response = get_gemini_response(full_query, GEMINI_API_KEY)

    # Update conversation history
    update_conversation_history(user_id, user_message, response)

    return jsonify({'response': response})

def get_current_date():
    """Return the current date in a readable format."""
    return datetime.now().strftime('%B %d, %Y')

def clean_and_normalize_text(text):
    """Preprocess text to handle broken English and typos."""
    import re
    text = text.lower().strip()  
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)  
    tokens = word_tokenize(text)  
    return " ".join(tokens)  

def should_search_internet(query):
    """Determine if the query requires an internet search."""
    keywords = ["latest", "news", "update", "current", "today", "recent"]
    return any(keyword in query for keyword in keywords)

def fetch_search_results(query):
    """Fetch real-time information from the internet using Google Search API."""
    search_url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": GOOGLE_SEARCH_API_KEY,  
        "cx": GOOGLE_SEARCH_CX,         
        "q": query                       
    }
    try:
        # Make the request to the Google Custom Search API
        response = requests.get(search_url, params=params)
        response.raise_for_status()  

        # Process the response
        data = response.json()
        items = data.get("items", [])
        if items:
            # Get the first link
            first_link = items[0].get('link')
            # Scrape the content from the first link
            scraped_content = scrape_content(first_link)
            return scraped_content if scraped_content else "No relevant content found on the page."
        
        return "No relevant search results found."
    except requests.exceptions.RequestException as e:
        return f"Error fetching search results: {e}"

def scrape_content(url):
    """Scrape content from the given URL and summarize it."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title for the summary
        title = soup.title.string if soup.title else "Information"

        # Extract text content from paragraphs
        paragraphs = soup.find_all('p')
        content = ' '.join([para.get_text() for para in paragraphs])

        # Summarize the content
        summary = summarize_content(content)

        return f"{title}\n\n{summary}"
    except requests.exceptions.RequestException as e:
        return f"Error scraping the content: {e}"

def summarize_content(content):
    """Summarize the content to extract key points."""
    sentences = content.split('. ')
    if len(sentences) > 3:
        return '. '.join(sentences[:3]) + '...'
    return content

def get_gemini_response(query, api_key):
    """Fetch the response from Gemini API."""
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": query
                    }
                ]
            }
        ]
    }
    try:
        # Sending a POST request to the Gemini API
        response = requests.post(GEMINI_API_URL, json=payload, headers=headers, params={"key": api_key})
        response.raise_for_status()

        # Extracting the chatbot response from the API
        data = response.json()
        candidates = data.get("candidates", [{}])
        if candidates and "content" in candidates[0] and "parts" in candidates[0]["content"]:
            return candidates[0]["content"]["parts"][0].get("text", "I couldn't fetch a response from Gemini.")
        return "No valid response from Gemini."
    except requests.exceptions.RequestException as e:
        # Handle connection errors or invalid responses
        return f"Error connecting to Gemini API: {e}"