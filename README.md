# SkillHub

SkillHub is a modern, responsive full-stack platform for users to share, discover, and interact with professional online learning resources. Built with scaling architectures and sleek UI/UX principles, SkillHub empowers communities to bookmark relevant curricula from platforms like Udemy, Coursera, YouTube, and more.

## ✨ Features
- **Secure Authentication:** JWT-based login and registration flows.
- **Resource Management:** Create, Read, Update, and Delete (CRUD) shared resources seamlessly.
- **Interactions:** Like and Save features utilizing Optimistic UI state updates for immediate feedback.
- **Responsive Navigation:** Fluid, glassmorphic UI matching both Light and Dark user preference themes.
- **File Uploads:** Integrated express-multer middleware handling profile pictures and custom resource asset uploads.
- **Interactive Modals:** Dynamic animations covering context prompts (Delete, Share, Logout).

## 🛠 Tech Stack
- **Frontend:** React (Vite), React Router DOM, TailwindCSS, React-Icons, Axios, React Hot Toast.
- **Backend:** Node.js, Express, Sequelize (ORM), PostgreSQL Database, Bearer JWT Auth.

---

## 💻 Local Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database installed and running on your local machine.

### 1. Database Setup
Create an empty PostgreSQL schema on your machine.
```sql
CREATE DATABASE skillhub_db;
```

### 2. Backend Setup
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file referencing your local PostgreSQL configurations:
```env
PORT=8080
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=skillhub_db
JWT_SECRET=yoursupersecretjwtkey
FRONTEND_URL=http://localhost:5173
```
Run the development server (Sequelize will auto-migrate your tables over the initial connection):
```bash
npm run dev
```

### 3. Frontend Setup
In a new terminal, navigate to the `web_app` folder:
```bash
cd web_app
npm install
```
Create a `.env` file declaring your backend local routes:
```env
VITE_API_URL=http://localhost:8080/api
VITE_BACKEND_URL=http://localhost:8080
```
Start the frontend server:
```bash
npm run dev
```

---

## 🚀 Deployment

The project is natively structured to deploy to Platform-as-a-Service (PaaS) clouds.

### Frontend (Vercel)
The `web_app` directory utilizes Vite. Simply point your Vercel project to the `web_app` root directory.
Ensure you input your production `VITE_API_URL` and `VITE_BACKEND_URL` pointing toward your live backend instance in the Vercel Environment UI.
```bash
cd web_app
npx vercel --prod
```

### Backend (Render / Railway)
The backend container spins up using `npm start` natively via `server.js`. Link your GitHub repository within your Render/Railway dashboard and expose your managed `DATABASE_URL` via the Environment tab.
```env
PORT=8080
FRONTEND_URL=https://your-vercel-domain.vercel.app
DATABASE_URL=postgres://user:pass@remotehost:5432/skillhub_db
JWT_SECRET=your_production_secure_token
```
