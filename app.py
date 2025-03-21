from flask import Flask
from dotenv import load_dotenv
import os
from routes import main_bp
from db import db  
from flask_migrate import Migrate
from flask_login import LoginManager

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')  

# Initialize the database with the app 
db.init_app(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

login_manager.login_view = "main_bp.login"

# User loader function
from models import User
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Initialize migration
migrate = Migrate(app, db)

# Register the blueprint
app.register_blueprint(main_bp)

# Vercel requires this to be named `handler`
def handler(event, context):
    return app(event, context)

if __name__ == "__main__":
    app.run(debug=True)
