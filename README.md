# 📦 CantaSoftware - Weight Stamp Generator System

A full-stack MERN application for generating computerized weight stamps, managing vehicle and party records, and exporting weight slips as PDF files using Puppeteer.

---

## 🚀 Features

- Generate computerized weight stamp slips
- Automatic serial number (Sr_No) generation
- Gross Weight, Tare Weight, and Net Weight calculations
- Kilograms (KG) to Maunds (Mnds) conversion
- PDF export and download using Puppeteer
- Party record management
- Vehicle record management
- MongoDB data storage
- Responsive user interface
- Dark mode support

---

## 🛠️ Tech Stack

### Frontend

- React (Vite)
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Puppeteer

---

## 📂 Project Structure

```text
cantasoftware/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── middleware/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5001
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/CantaSoftware

FRONTEND_URL=http://localhost:5173
```

Create a `.env` file inside the `frontend` directory:

```
VITE_API_URL=http://localhost:5001
```


---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cantasoftware.git
cd cantasoftware
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Start Backend Server

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5001
```

### 4. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 5. Start Frontend

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## 📄 PDF Generation

The application uses Puppeteer to generate printable PDF weight slips.

Features include:

- Professional stamp layout
- Auto-filled weight data
- Downloadable PDF output
- Print-ready format

---

## 📊 Weight Calculation

```text
Net Weight = Gross Weight - Tare Weight
```

```text
Maunds (Mnds) = Kilograms / 40
```

---

## 💾 Database

MongoDB is used to store:

- Weight stamp records
- Vehicle information
- Party information
- Serial number history

---

## 🌙 UI Features

- Responsive Design
- Dark Mode
- Fast Search
- Clean Dashboard Interface

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by CantaSoftware.
