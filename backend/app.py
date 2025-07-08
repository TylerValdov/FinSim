# backend/app.py
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

@app.route('/api/test')
def test_route():
    return {"message": "Test backend"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)