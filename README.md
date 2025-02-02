# Nightingale-
Nightingale is an intelligent, RAG-powered chatbot built with Flask for a robust backend framework. It integrates LangChain.js to handle conversational logic, while leveraging GrokAPI for dynamic, AI-driven responses. The frontend is styled with pure CSS, ensuring seamless integration between the user interface and backend functionality. 
# Key Features
> RAG-powered Chatbot: The chatbot uses Retrieval-Augmented Generation (RAG) to enhance its responses by querying external knowledge sources, making the conversations more informative and context-aware.
> AI-driven Responses: With GrokAPI, the chatbot can generate intelligent, context-aware replies that improve over time, making interactions feel more natural and personalized.
> Conversational Logic with LangChain.js: The chatbot employs LangChain.js, a library that provides a robust and flexible way to manage conversational flow and context, enabling it to handle complex dialogue patterns.
> Frontend Integration: The user interface is built with pure CSS, ensuring a minimalist, responsive, and intuitive design. The frontend and backend are seamlessly integrated for smooth interaction between the user and the chatbot.
# Technologies Used
> Flask: The lightweight web framework that powers the backend of the chatbot, handling requests and routing between the AI components and user-facing frontend.
>GrokAPI: A powerful AI platform that provides machine learning models to generate context-based responses and improve the chatbot's interactions.
> LangChain.js: A conversational framework that allows the chatbot to intelligently manage conversation states and context, ensuring meaningful and relevant dialogues.
> Pure CSS: The frontend design utilizes pure CSS for styling, creating a clean, simple, and responsive user interface that adapts across devices.
# Project Structure
Nightingale/
│
├── backend/               # Flask API and server logic
│   ├── app.py             # Main entry point for Flask app
│   ├── chatbot/           # Chatbot logic and integration
│   ├── responses/         # AI responses powered by GrokAPI
│   └── ...
│
├── frontend/              # User Interface with pure CSS
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS file for UI styling
│   └── ...
│
├── .gitignore             # Git ignore file
├── requirements.txt       # Python dependencies
└── README.md              # Project documentation

# Installation
# Clone the repository:
git clone https://github.com/yourusername/nightingale.git
cd nightingale
# Set up the Python environment: Create and activate a virtual environment (optional but recommended):
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Run the application:
python app.py
