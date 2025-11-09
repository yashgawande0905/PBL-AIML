from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({
        "message": "✅ Solar Backend API is live!",
        "usage": "Send a POST request to /predict with JSON data."
    })


# ================================
# Load Dataset & Train Model
# ================================
DATASET_PATH = "dataset.xlsx"

try:
    df = pd.read_excel(DATASET_PATH)
    print("✅ Dataset loaded successfully.")
    print("📋 Columns:", list(df.columns))
except FileNotFoundError:
    print("❌ ERROR: dataset.xlsx not found.")
    df = None

if df is not None:
    # Map shape to numeric
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

    # 🔹 Normalize features for better learning
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 🔹 Random Forest Regressor (robust & nonlinear)
    model = RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        max_depth=10,
        min_samples_split=3
    )
    model.fit(X_scaled, y)

    # Validation ranges for inputs
    validation_ranges = {col: (df[col].min(), df[col].max()) for col in feature_cols[1:]}

    print("✅ Model trained successfully on data:", X.shape)
    print("📊 Sample prediction:", model.predict(X_scaled[:1]))
else:
    model = None
    scaler = None
    validation_ranges = {}
    shape_map = {}


# ================================
# API Key Mapping (Frontend → Dataset)
# ================================
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


# ================================
# Prediction Endpoint
# ================================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if model is None:
            return jsonify({"error": "Model not loaded. Ensure dataset.xlsx is present."}), 500

        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided."}), 400

        # Convert shape to numeric
        shape = shape_map.get(data.get("shape"))
        if shape is None:
            return jsonify({"error": f"Invalid shape. Choose from {list(shape_map.keys())}"}), 400

        # Ensure correct feature order
        feature_order = [
            'solarRadiation',    # → Intensity of Radiation (I) W/m2
            'collectorArea',     # → Length of plate (L) m
            'massFlowRate',      # → Breadth/Base (B) m
            'velocity',          # → Velocity of air (V) m/s
            'inletTemp',         # → Temperature in (Ti) °C
            'outletTemp',        # → Temperature out (To) °C
            'ambientTemp',       # → Ambient Temperature (Tamb) °C
            'nusselt',           # → Nusselt Number (Nu)
            'distance'           # → Distance Between Plate and Glass (x) m
        ]

        # Build input in the same order as model training
        values = []
        for key in feature_order:
            val = data.get(key)
            if val is None:
                return jsonify({"error": f"Missing value for {key}"}), 400

            val = float(val)
            dataset_key = key_map[key]

            # Validate against dataset min-max
            min_val, max_val = validation_ranges.get(dataset_key, (None, None))
            if min_val is not None and not (min_val <= val <= max_val):
                return jsonify({
                    "error": f"{key} should be between {round(min_val, 2)} and {round(max_val, 2)}"
                }), 400

            values.append(val)

        # ================================
        # Prediction Logic
        # ================================
        X_input = np.array([[shape] + values])
        X_scaled_input = scaler.transform(X_input)
        pred = model.predict(X_scaled_input)[0]

        Qout, Qloss, Efficiency = map(lambda x: round(float(x), 2), pred.tolist())

        # Clamp efficiency to realistic range
        Efficiency = max(0, min(Efficiency, 80))

        # Debug prints to verify variability
        print("🔥 Input Vector:", [shape] + values)
        print("📈 Scaled Input:", scaler.transform([[shape] + values])[0])
        print("📊 Prediction Output:", Qout, Qloss, Efficiency)

        return jsonify({
            "predicted_values": {
                "Qout": Qout,
                "Qloss": Qloss,
                "Efficiency(%)": Efficiency
            }
        }), 200

    except Exception as e:
        print("❌ Prediction Error:", str(e))
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500


# ================================
# Run Flask App
# ================================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
