import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

# Load Excel file
df = pd.read_excel("dataset.xlsx", sheet_name="Sheet1")

# One-hot encode Shape column
df = pd.get_dummies(df, columns=["Shape"], drop_first=True)

# Features and targets
features = [
    "Length of plate (L) m",
    "Breadth/Base (B) m",
    "Density of air (ρ) kg/m3",
    "Velocity of air (V) m/s",
    "Absorptivity (α)",
    "Transmissivity(τ)",
    "Intensity of Radiation (I) W/m2",
    "Specific heat (cp) J/kg°C",
    "Temperature in (Ti) °C",
    "Temperature out (To) °C",
    "Ambient Temperature (Tamb) °C",
    "Distance Between Plate and Glass (x) m"
]

X = df[features + list(df.columns[df.columns.str.startswith('Shape_')])]
y = df[["Qout", "Qloss", "Efficiency (%)"]]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# Save trained model
joblib.dump(model, "solar_model.pkl")

print("Model trained and saved successfully!")
