from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Get the Gemini API key and endpoint from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = os.getenv("GEMINI_API_URL")
GOOGLE_SEARCH_API_KEY = os.getenv("GOOGLE_SEARCH_API_KEY")
GOOGLE_SEARCH_CX = os.getenv("GOOGLE_SEARCH_CX")

@app.route('/')
def index():
    return render_template('bryium.html')

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

if __name__ == '__main__':
    app.run(debug=True)
