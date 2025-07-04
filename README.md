# 💬 WhatsApp Clone

A full-stack WhatsApp-like chat application built with:

- 🚀 **Frontend**: Angular  
- 🔧 **Backend**: Node.js + Express + GraphQL  
- 🗃️ **Database**: MySQL with Sequelize ORM  

---

## Screen Shots
![Chat Page](https://github.com/essakirajas/whatsapp-Clone/blob/main/screenshots/chatPage%201.png?raw=true)
![Enter Mobile Number](https://github.com/essakirajas/whatsapp-Clone/blob/main/screenshots/Mobile%20No%20Enter.png?raw=true)
![Enter otp](https://github.com/essakirajas/whatsapp-Clone/blob/main/screenshots/Enter%20Otp.png)



## 📁 Project Structure

/whatsapp-clone │ 

  ├── /frontend # Angular Frontend 
  
  └── /backend # Node.js Backend with Express, GraphQL, Sequelize

yaml
Copy
Edit

---

## 🛠️ Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v16+)
- Angular CLI
- MySQL
- Git

---

## ⚙️ Environment Setup

### Backend `.env` file (`/backend/.env`)

Create a `.env` file in the `backend/` directory with the following:
- DB_HOST=localhost
- DB_USER=root
- DB_PASSWORD=yourpassword
- DB_NAME=yourdbname
- PORT=5000

yaml
Copy
Edit

Replace `yourpassword` and `yourdbname` with your actual MySQL credentials.

---

## 📦 Installation & Running the App

### 🚀 Backend Setup

Navigate to the backend directory
- cd backend

Install backend dependencies
- npm install --legacy-peer-deps

Run database migrations (if applicable)
- npx sequelize-cli db:migrate

Start the backend server
- npm start

yaml
Copy
Edit

Backend will be running at: http://localhost:5000/graphqlserver

---

### 🎨 Frontend Setup

Open a new terminal and go to frontend directory
- cd client

Install frontend dependencies
- npm install --legacy-peer-deps

Start the Angular development server
- ng serve

yaml
Copy
Edit

Frontend will be available at: http://localhost:4200

---

## 🔗 API Integration

In your Angular app, configure the GraphQL endpoint to connect to:

http://localhost:5000/graphqlserver

yaml
Copy
Edit

If you're using Apollo Client, update your Apollo configuration accordingly.

---

## 🧪 Testing the App

- Visit http://localhost:4200 to view the frontend  
- Open http://localhost:4000/graphqlserver to test GraphQL queries in Playground

---

## 🏗️ Production Build

To build the Angular frontend for production:

cd frontend ng build --prod

(or)

To test the Angular frontend :

cd frontend ng serve 

yaml
Copy
Edit

The build files will be in the `frontend/dist/` directory. You can serve them using an HTTP server like `nginx` or integrate them into your Node backend.

---

## 📌 Notes

- Ensure your MySQL service is running and your credentials are correct.  
- Customize your Sequelize models to define the chat structure, user accounts, and messaging logic.  
- WebSocket integration is recommended for real-time chat updates (future enhancement).

---

## 📄 License

This project is licensed under the MIT License.
