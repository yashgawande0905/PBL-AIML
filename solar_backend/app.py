from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
import os

app = Flask(__name__)
CORS(app)

# ✅ Root route for Render
@app.route('/')
def home():
    return jsonify({
        "message": "✅ Solar Backend API is live on Render!",
        "usage": "Send a POST request to /predict with JSON data."
    })


# ========================================
# ✅ Load Dataset
# ========================================
try:
    df = pd.read_excel("dataset.xlsx")
    print("✅ Dataset loaded successfully.")
except FileNotFoundError:
    print("❌ ERROR: 'dataset.xlsx' not found. Place it in same folder as app.py.")
    df = None


# ========================================
# ✅ Model Training
# ========================================
if df is not None:
    shape_map = {
        'Hexagonal': 0,
        'Circular': 1,
        'Triangular': 2,
        'Flat': 3,
        'Concentric': 4
    }

    df['Shape_num'] = df['Shape'].map(shape_map)

    feature_cols = [
        'Shape_num',
        'Intensity of Radiation (I) W/m2',
        'Length of plate (L) m',
        'Breadth/Base (B) m',
        'Velocity of air (V) m/s',
        'Temperature in (Ti) °C',
        'Temperature out (To) °C',
        'Ambient Temperature (Tamb) °C',
        'Nusselt Number (Nu)',
        'Distance Between Plate and Glass (x) m'
    ]

    target_cols = ['Qout', 'Qloss', 'Efficiency (%)']

    X = df[feature_cols]
    y = df[target_cols]

    model = KNeighborsRegressor(n_neighbors=3)
    model.fit(X, y)

    validation_ranges = {col: (df[col].min(), df[col].max()) for col in feature_cols[1:]}
else:
    model = None
    validation_ranges = {}
    shape_map = {}


# ========================================
# ✅ Key Map (Frontend → Dataset)
# ========================================
key_map = {
    'solarRadiation': 'Intensity of Radiation (I) W/m2',
    'collectorArea': 'Length of plate (L) m',
    'massFlowRate': 'Breadth/Base (B) m',
    'velocity': 'Velocity of air (V) m/s',
    'inletTemp': 'Temperature in (Ti) °C',
    'outletTemp': 'Temperature out (To) °C',
    'ambientTemp': 'Ambient Temperature (Tamb) °C',
    'nusselt': 'Nusselt Number (Nu)',
    'distance': 'Distance Between Plate and Glass (x) m'
}


# ========================================
# ✅ Predict Route
# ========================================
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': "Model not loaded."}), 500

    data = request.get_json()
    print("📩 Received:", data)

    if not data:
        return jsonify({'error': "No input data provided"}), 400

    try:
        shape = shape_map.get(data.get('shape'))
        if shape is None:
            return jsonify({'error': f"Invalid shape. Choose from {list(shape_map.keys())}"}), 400

        values = []
        for frontend_key, dataset_key in key_map.items():
            val = float(data.get(frontend_key))
            min_val, max_val = validation_ranges.get(dataset_key, (None, None))
            if min_val is not None and not (min_val <= val <= max_val):
                return jsonify({'error': f"{frontend_key} should be between {round(min_val,2)} and {round(max_val,2)}"}), 400
            values.append(val)

        X_input = np.array([[shape] + values])
        pred = model.predict(X_input)[0]
        Qout, Qloss, Efficiency = pred.tolist()

        return jsonify({
            'predicted_values': [round(Qout, 2), round(Qloss, 2), round(Efficiency, 2)]
        })

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({'error': str(e)}), 400
    
    from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder="dist", static_url_path="")
# your existing CORS, ML model, and /predict code stay the same

@app.route("/")
def serve_home():
    return send_from_directory(app.static_folder, "index.html")

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")



# ========================================
# ✅ Render-compatible run
# ========================================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
