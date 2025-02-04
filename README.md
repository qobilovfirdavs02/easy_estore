# FastAPI + Next.js

This project is built using **FastAPI (Backend)** and **Next.js (Frontend)**.

---

## 📌 Installation and Setup

Follow these steps to get the project up and running:

### 1. **Clone the Repository**
```bash
git clone https://github.com/qobilovfirdavs02/fastapi-nextjs.git
cd fastapi-nextjs
```

### 2. **Start the Backend (FastAPI)**

#### **Create a Python Virtual Environment**
```bash
cd backend
python -m venv venv  # Create a virtual environment
source venv/bin/activate  # For Linux/Mac
venv\Scripts\activate  # For Windows
```

#### **Install Required Dependencies**
```bash
pip install -r requirements.txt
```

#### **Run the Backend Server**
```bash
uvicorn main:app --reload
```

✅ **Backend server** runs at `http://127.0.0.1:8000`.

---

### 3. **Start the Frontend (Next.js)**

#### **Check if Node.js and NPM are Installed**
```bash
node -v  # Check Node.js version
npm -v  # Check NPM version
```

If Node.js is not installed, download and install it from [official site](https://nodejs.org/).

#### **Install Dependencies and Start Next.js**
```bash
cd ../frontend
npm install  # Install required packages
npm run dev  # Start the local development server
```

✅ **Frontend server** runs at `http://localhost:3000`.

---

## 📂 Project Structure
```
fastapi-nextjs/
│-- backend/        # FastAPI backend code
│   │-- main.py     # Main FastAPI application
│   │-- requirements.txt  # Python dependencies
│-- frontend/       # Next.js frontend code
│   │-- pages/      # Next.js pages
│   │-- components/ # UI components
│   │-- package.json  # Frontend dependencies
│-- README.md       # This file
```

---

## 🚀 API Documentation

FastAPI provides automatic API documentation through Swagger UI:

- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Redoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 💡 Usage
1. Start both the backend and frontend servers.
2. Open `http://localhost:3000` in your browser.
3. Test API endpoints via `http://127.0.0.1:8000/docs`.

---

## ⚡ Troubleshooting
If you encounter any issues, check the following:
- Ensure Python and Node.js versions are compatible.
- Make sure the virtual environment (`venv`) is activated.
- Verify that all dependencies are installed (`pip install -r requirements.txt` and `npm install`).

If the issue persists, feel free to open an **Issue** or reach out for support.

---

## 📜 License
This project is licensed under the **MIT** license.

---

✅ **Now you can successfully run the FastAPI + Next.js application! 🚀**

