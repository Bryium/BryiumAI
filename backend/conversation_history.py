from collections import defaultdict

# Global dictionary to track conversation history per user
conversation_history = defaultdict(list)

def get_conversation_history(user_id):
    """Return the conversation history for a specific user."""
    return conversation_history.get(user_id, [])

def update_conversation_history(user_id, user_message, response):
    """Update the conversation history with the new user message and bot response."""
    history = conversation_history[user_id]
    
    # Add the new user message and bot response
    history.append(user_message)
    history.append(response)
    
    # Keep only the last 10 messages for memory efficiency
    conversation_history[user_id] = history[-10:]
