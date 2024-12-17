from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 

model = joblib.load('car_price_model.pkl')
scaler = joblib.load('car_price_scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict_car_price():
    features = request.json['features']
    
    scaled_features = scaler.transform([features])
    
    predicted_price = model.predict(scaled_features)[0]
    
    return jsonify({
        'predicted_price': float(predicted_price)
    })

if __name__ == '__main__':
    app.run(debug=True)