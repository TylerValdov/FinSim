Financial Suite: A Full-Stack "What If" Simulator

This is a full-stack web application designed to help users visualize the long-term impact of their financial decisions. It features an investment projection simulator that compares a baseline scenario with a "what-if" scenario, providing clear, graphical feedback.

The project is built with a modern tech stack, separating the frontend and backend for scalability and maintainability.

Features

    Investment Projection: Calculate and compare long-term investment growth between two different scenarios.

    Interactive Charting: Visualizes the growth of your investments over time using an interactive line chart.

    AI Financial Advisor (Optional): A conversational interface that allows users to modify the simulation using natural language queries, powered by the Google Gemini API.

Tech Stack

Frontend

    Framework: React

    Build Tool: Vite

    Styling: Tailwind CSS

    HTTP Client: Axios

    Charting: Recharts

Backend

    Framework: Python (Flask)

    API: RESTful API to handle calculations

    AI Integration: Google Generative AI (Gemini) for the conversational advisor

Getting Started

Prerequisites

    Node.js & npm

    Python 3 & pip

    A Gemini API Key (if using the AI feature), stored in a .env file in the backend directory.

Installation & Running Locally

    Clone the repository:
    Bash

git clone https://github.com/your-username/financial-suite.git
cd financial-suite

Setup the Backend:
Bash

cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt # Make sure to create this file: pip freeze > requirements.txt
python app.py

The backend server will be running on http://127.0.0.1:5000.

Setup the Frontend (in a new terminal window):
Bash

cd frontend
npm install
npm run dev

The frontend development server will be running on http://localhost:5173 (or a similar port).
