from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from collections import defaultdict
import re
import nltk


nltk.download('punkt')
from nltk.tokenize import word_tokenize

# Global dictionary to track conversation history per user
conversation_history = defaultdict(list)

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Memory storage for conversation history
conversation_history = {}

# Get the Gemini API key and endpoint from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = os.getenv("GEMINI_API_URL")
GOOGLE_SEARCH_API_KEY = os.getenv("GOOGLE_SEARCH_API_KEY")
GOOGLE_SEARCH_CX = os.getenv("GOOGLE_SEARCH_CX")

@app.route('/')
def index():
    return render_template('bryium.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/chat', methods=['POST'])
def get_response():
    user_message = request.json.get('message')
    
    # Check if the message requires an internet search
    if "today's date" in user_message.lower() or "what is the date" in user_message.lower():
        response = get_current_date()
    elif should_search_internet(user_message):
        search_results = fetch_search_results(user_message)
        response = search_results if search_results else "I couldn't find relevant information online."
    else:
        response = get_gemini_response(user_message, GEMINI_API_KEY)
    
    return jsonify({'response': response})

def get_current_date():
    """Return the current date in a readable format."""
    return datetime.now().strftime('%B %d, %Y')

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

def should_search_internet(query):
    """Determine if the query requires an internet search."""
    keywords = ["latest", "news", "update", "current", "today", "recent"]
    return any(keyword in query.lower() for keyword in keywords)

def fetch_search_results(query):
    """Fetch real-time information from the internet using Google Search API."""
    search_url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": GOOGLE_SEARCH_API_KEY,  # Your Google Search API key
        "cx": GOOGLE_SEARCH_CX,         # Your Search Engine ID (CX)
        "q": query                       # Use the raw query directly
    }
    try:
        # Make the request to the Google Custom Search API
        response = requests.get(search_url, params=params)
        response.raise_for_status()  # Raise an error for bad responses

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
    except requests.exceptions.HTTPError as e:
        # Handle specific HTTP errors
        return f"HTTP error: {e.response.status_code} - {e.response.text}"
    except requests.exceptions.RequestException as e:
        # Handle connection errors or invalid responses
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
    # You can adjust the logic to select more meaningful sentences
    if len(sentences) > 3:
        return '. '.join(sentences[:3]) + '...'
    return content

def get_response():
    user_message = request.json.get('message')
    user_id = request.json.get('user_id', 'default_user')  # Unique ID for tracking conversation
    
    # Retrieve past conversation history
    history = conversation_history.get(user_id, [])
    
    # Check if the message requires an internet search
    if "today's date" in user_message.lower() or "what is the date" in user_message.lower():
        response = get_current_date()
    elif should_search_internet(user_message):
        search_results = fetch_search_results(user_message)
        response = search_results if search_results else "I couldn't find relevant information online."
    else:
        # Include history for context
        full_query = " ".join(history[-5:]) + " " + user_message  # Use last 5 messages as context
        response = get_gemini_response(full_query, GEMINI_API_KEY)
    
    # Update conversation history
    history.append(user_message)
    history.append(response)
    conversation_history[user_id] = history[-10:]  # Keep only the last 10 messages for memory efficiency
    
    return jsonify({'response': response})


def clean_and_normalize_text(text):
    """Preprocess text to handle broken English and typos."""
    text = text.lower().strip()  # Convert to lowercase and remove extra spaces
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)  # Remove special characters
    tokens = word_tokenize(text)  # Tokenize text for better understanding
    return " ".join(tokens)  # Convert tokens back to a string

def get_response():
    user_message = request.json.get('message', '').strip()
    user_id = request.json.get('user_id', 'default_user')  # Unique ID to track conversations

    if not user_message:
        return jsonify({'response': "I didn't get that. Can you rephrase?"})

    # Normalize and clean user input
    cleaned_message = clean_and_normalize_text(user_message)

    # Retrieve past conversation history
    history = conversation_history[user_id]

    # Check for date queries
    if "todays date" in cleaned_message or "what is the date" in cleaned_message:
        response = get_current_date()
    elif should_search_internet(cleaned_message):
        search_results = fetch_search_results(cleaned_message)
        response = search_results if search_results else "I couldn't find relevant information online."
    else:
        # Include conversation history for context
        full_query = " ".join(history[-5:]) + " " + cleaned_message  # Use last 5 messages for context
        response = get_gemini_response(full_query, GEMINI_API_KEY)

    # Update conversation history
    history.append(user_message)
    history.append(response)
    conversation_history[user_id] = history[-10:]  # Keep the last 10 messages per user

    return jsonify({'response': response})

def get_current_date():
    """Return the current date in a readable format."""
    return datetime.now().strftime('%B %d, %Y')

def should_search_internet(query):
    """Determine if the query requires an internet search."""
    keywords = ["latest", "news", "update", "current", "today", "recent"]
    return any(keyword in query for keyword in keywords)



if __name__ == '__main__':
    app.run(debug=True)
