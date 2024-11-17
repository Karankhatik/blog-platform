# Blog Platform  

## 📖 Overview  
This is a full-stack blog platform built with **TypeScript**, **Next.js**, **Express**, and **MongoDB**. It allows users to create, manage, and share blogs efficiently. The project is structured into two parts:  
- **UI**: The Next.js frontend application.  
- **API**: The Express.js backend server.  

Designed to be **production-ready**, the platform focuses on scalability, performance, security, and accessibility.  

---

## ✨ Features  
- **Article Management**: Create, update, and delete blog posts.  
- **User Management**: Role-based access control for admins and users.  
- **WYSIWYG Editor**: Simplifies content creation.  
- **Infinite Scroll**: Provides smooth content loading.  
- **Secure Authentication**: JWT-based with email verification and password reset.  
- **API Rate Limiting**: Enhances security and prevents abuse.  
- **SEO Optimization**: Improves web app visibility with SEO-friendly architecture.  
- **Server-Side Rendering (SSR)**: Boosts performance and SEO rankings.  

---

## 🛠 Tech Stack  
- **Frontend (UI)**: Next.js, TypeScript  
- **Backend (API)**: Express.js, TypeScript  
- **Database**: MongoDB  
- **Authentication**: JWT  
- **Other Tools**: Nodemailer (email services), Bcrypt (password hashing)  

---

## 🚀 How to Run Locally  

### Prerequisites  
- Node.js  
- MongoDB  

### Steps  

### Step 1: Clone the Repository  
git clone <repository-link>  
cd blog-platform  

### Step 2: Setup the Frontend (UI)

### Navigate to the ui directory
cd ui

### Install the dependencies
npm install

### Create a .env file in the ui directory
NEXT_PUBLIC_API_URL=<your-api-server-url>

### Start the development server
npm run dev

### Step 3: Setup the Backend (API)

### Navigate to the api directory
cd ../api

### Install the dependencies
npm install

### Create a .env file in the api directory
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database-name>?retryWrites=true&w=majority  
ACCESS_TOKEN_SECRET=<your-access-token-secret>  
ACCESS_TOKEN_EXPIRY=7d  
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>  
REFRESH_TOKEN_EXPIRY=20d  
OTP_EXPIRE=2 # in minutes  
SMTP_USER=<your-email-address>  
SMTP_PASS=<your-email-password>



### Start the API server
npm start

### Step 4: Access the Application
### Frontend: Open the application in your browser
### Open http://localhost:3000

### Backend: The API server will run on http://localhost:5000
