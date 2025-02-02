from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('nightingale_chatbot.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    user_message = request.json.get('message')
    # Basic response logic
    response = f"Nightingale says: You mentioned '{user_message}'" if user_message else "Could you repeat that, please?"
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
