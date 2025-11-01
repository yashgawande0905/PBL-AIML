from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsRegressor

app = Flask(__name__)
CORS(app)

# ========================================
# ✅ Load Dataset
# ========================================
try:
    df = pd.read_excel("dataset.xlsx")  # Make sure it's in the same folder as this file
    print("✅ Dataset loaded successfully.")
except FileNotFoundError:
    print("❌ ERROR: 'dataset.xlsx' not found. Place it in the same folder as app.py.")
    df = None

# ========================================
# ✅ Model Preparation
# ========================================
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

    # Define input and output columns
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

    # Prepare training data
    X = df[feature_cols]
    y = df[target_cols]

    # Train KNN model
    model = KNeighborsRegressor(n_neighbors=3)
    model.fit(X, y)

    # Validation ranges for each column
    validation_ranges = {col: (df[col].min(), df[col].max()) for col in feature_cols[1:]}

else:
    model = None
    validation_ranges = {}
    shape_map = {}

# ========================================
# ✅ Key Mapping (Frontend → Dataset)
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
# ✅ Prediction Route
# ========================================
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': "Dataset not found or model not trained."}), 500

    data = request.get_json()
    print("📩 Received data:", data)

    if not data:
        return jsonify({'error': "No input data received."}), 400

    try:
        # Shape conversion
        shape = shape_map.get(data.get('shape'))
        if shape is None:
            return jsonify({'error': f"Invalid shape value. Must be one of: {list(shape_map.keys())}"}), 400

        # Validate and extract numeric inputs
        input_values = []
        for frontend_key, dataset_key in key_map.items():
            if frontend_key not in data:
                return jsonify({'error': f"Missing parameter: {frontend_key}"}), 400

            val = float(data[frontend_key])
            if dataset_key in validation_ranges:
                min_val, max_val = validation_ranges[dataset_key]
                if not (min_val <= val <= max_val):
                    return jsonify({
                        'error': f"{frontend_key} should be between {round(min_val, 2)} and {round(max_val, 2)}"
                    }), 400
            input_values.append(val)

        # Prepare input array
        X_input = np.array([[shape] + input_values])
        prediction = model.predict(X_input)[0]
        Qout, Qloss, Efficiency = prediction.tolist()

        # Return prediction
        return jsonify({
            'predicted_values': [round(Qout, 2), round(Qloss, 2), round(Efficiency, 2)]
        })

    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({'error': str(e)}), 400


# ========================================
# ✅ Run Flask Server (Render compatible)
# ========================================
if __name__ == '__main__':
    # Run on all interfaces and use Render's PORT env var if available
    import os
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)

