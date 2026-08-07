# Full Stack Developer Portfolio CMS - Rajesh Rautela

A professional, dynamic Full Stack Developer Portfolio website integrated with a built-in inline Content Management System (CMS), static media asset library, and visitor interactions analytics.

---

## 🛠️ Tech Stack

- **Frontend**: React, React Router v6, Tailwind CSS, Framer Motion, Axios, React Hook Form, React Icons, Vite
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs, Multer
- **Security**: Helmet headers, express-rate-limit protection

---

## 📁 Repository Structure

```
C:\rajeshPortfolio
├── backend/                  # Node/Express API Server
│   ├── config/              # MongoDB connection configurations
│   ├── controllers/         # REST API Controllers (CRUD logic)
│   ├── middleware/          # Security limiters, Multer uploaders, JWT filters
│   ├── models/              # Mongoose database models (Settings, Skills, Projects, Messages, Analytics)
│   ├── routes/              # Express Router mapping definitions
│   ├── uploads/             # Server local static assets storage folder
│   ├── .env                 # Environment configuration variables
│   ├── package.json         # Node package descriptors
│   └── server.js            # Express server main boot entrypoint
│
└── frontend/                 # React client SPA (Vite)
    ├── public/              # Index static files (robots.txt, sitemap.xml)
    ├── src/
    │   ├── components/      # Navbar, Hero, About, Skills, Projects, Contact, Footer UI
    │   ├── context/         # AdminContext (authentication session states)
    │   ├── pages/           # AdminDashboard messages, analytics charts console
    │   ├── utils/           # API axios interceptor client wrappers
    │   ├── App.jsx          # App root routing and layouts assembly
    │   ├── index.css        # Cyberpunk styling themes and animations
    │   └── main.jsx         # React application starter
    ├── index.html           # Meta details and search engine parameters (SEO)
    ├── postcss.config.js    # PostCSS Tailwind setups
    ├── tailwind.config.js   # Tailwind configurations
    └── vite.config.js       # Vite build configurations with backend server API proxy rules
```

---

## ⚙️ Environment Configuration

Create a `.env` file inside `/backend` directory (a template is pre-created for you):
```properties
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rajesh_portfolio_cms
JWT_SECRET=your_jwt_secret_signing_key_here
ADMIN_SECRET_KEY=Rajesh@CMS2026!
NODE_ENV=development
```

---

## 🚀 Installation and Booting

### Step 1: Launch Backend Server
Navigate to `/backend`:
```bash
# Install dependencies
npm install

# Start Express server in development mode
npm run dev

# Or start in production mode
npm start
```
The server binds to port `5000` (http://localhost:5000).

### Step 2: Launch Frontend Client
Navigate to `/frontend`:
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start Vite server
npm run dev
```
The client compiles and starts at http://localhost:5173.

---

## 🔑 Administrative Guide

1. **Access Public View**: Navigate to `http://localhost:5173`. Default portfolio info is seeded automatically from the backend on load.
2. **Contact Recruiter Form**: Enter your details in the contact form. Successful submissions will persist in the MongoDB database.
3. **Trigger Inline CMS Editor**: Scroll down to the Footer copyright notice. **Double-click** the text `© 2026 Rajesh Rautela. All rights reserved.`.
4. **Login**: Enter the admin secret key configured in the backend `.env` file .
5. **Inline Editing Mode**:
   - Each section (Hero, About, Skills, Projects, Footer) displays quick edit options.
   - Edit titles, taglines, biographies, or contacts.
   - Upload new image assets (Profile photo, project thumbnails) or resumes (PDF documents) which automatically upload, name uniquely, and update in settings.
   - Reorder skills or projects using **Drag and Drop handles** (order updates are automatically synchronized in the database).
6. **Admin Dashboard Console**:
   - Navigate to `/admin/messages` using the "Console" navbar option (or type URL).
   - **Analytics Tab**: Check conversion metrics and total counts (Visits, CV downloads, Project clicks, submissions).
   - **Messages Tab**: Search emails, read/unread toggle, and delete inquiries.
   - **Media Manager Tab**: Upload files, scan disk storage assets, view sizes, copy direct links, and delete files.
