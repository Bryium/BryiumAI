from flask import Flask
from conversation_history import conversation_history
from dotenv import load_dotenv
import os
from routes import main_bp
from models import db 
from flask_migrate import Migrate 

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')  # Your database URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the app 
db.init_app(app)
migrate = Migrate(app, db)

# Register the blueprint
app.register_blueprint(main_bp)

if __name__ == '__main__':
    app.run(debug=True)
