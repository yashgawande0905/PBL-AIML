🌞 Solar Thermal Performance Prediction Dashboard

An interactive AI-powered dashboard that predicts the thermal efficiency and energy output of solar collectors based on input parameters such as radiation, temperature, flow rate, and tilt angle.
Built using React, Tailwind CSS, FastAPI, and MongoDB, this project provides real-time predictions and dynamic visualizations for solar performance analysis.

🚀 Overview

This project combines machine learning with a modern React.js + Tailwind CSS dashboard UI to visualize and predict solar thermal system performance.

It enables researchers and engineers to:

Enter custom solar parameters (temperature, irradiation, flow rate, tilt, etc.)

View dynamic updates to thermal efficiency and performance charts

Save and compare past predictions using a connected FastAPI + MongoDB backend

🧠 Tech Stack
Layer	Technologies Used
Frontend	React.js, Tailwind CSS, Axios, Recharts
Backend	FastAPI (Python), Uvicorn
Database	MongoDB
ML Model	Scikit-learn, Pandas, NumPy
Version Control	Git, GitHub
⚡ Features

✅ Real-time solar performance predictions
✅ Interactive charts and thermal efficiency visualizations
✅ Clean, responsive Tailwind UI (based on TailAdmin template)
✅ Seamless backend integration via FastAPI
✅ Data persistence using MongoDB
✅ Dark Mode support

🧩 Installation
Prerequisites

Make sure you have:

Node.js ≥ 18.x

Python ≥ 3.9

MongoDB running locally or on cloud (Atlas)

🖥️ Frontend Setup
# 1️⃣ Navigate to the frontend folder
cd frontend

# 2️⃣ Install dependencies
npm install
# or
yarn install

# 3️⃣ Create a .env file (if not present) and add:
VITE_API_BASE_URL=http://localhost:8000

# 4️⃣ Start the development server
npm run dev
# or
yarn dev


The frontend will start on 👉 http://localhost:5173

⚙️ Backend Setup
# 1️⃣ Navigate to the backend folder
cd backend

# 2️⃣ Create a virtual environment
python -m venv .venv

# 3️⃣ Activate the environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# 4️⃣ Install dependencies
pip install -r requirements.txt

# 5️⃣ Start the backend server
uvicorn main:app --reload


The backend will run on 👉 http://localhost:8000

🔗 Connecting Frontend & Backend

Make sure the backend is running.

In the frontend .env file, set:

VITE_API_BASE_URL=http://localhost:8000


Restart the frontend dev server.

🧱 Build for Production
# Build frontend for deployment
cd frontend
npm run build

# Start FastAPI backend for production
cd ../backend
uvicorn main:app --host 0.0.0.0 --port 8000

🚀 Deployment Options
Component	Recommended Platform
Frontend	Vercel, Netlify, GitHub Pages
Backend	Render, Railway, Heroku, AWS
Database	MongoDB Atlas
📜 License

This project is released under the MIT License.