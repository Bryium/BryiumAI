from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Get the Gemini API key and endpoint from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Gemini API Key
GEMINI_API_URL = os.getenv("GEMINI_API_URL")  # Gemini API endpoint

@app.route('/')
def index():
    return render_template('nightingale_chatbot.html')

@app.route('/chat', methods=['POST'])
def get_response():
    user_message = request.json.get('message')
    
    # Call the Gemini API with the user's message
    response = get_gemini_response(user_message, GEMINI_API_KEY)
    
    return jsonify({'response': response})

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
    params = {
        "key": api_key
    }
    try:
        # Sending a POST request to the Gemini API
        response = requests.post(GEMINI_API_URL, json=payload, headers=headers, params=params)
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

if __name__ == '__main__':
    app.run(debug=True)
