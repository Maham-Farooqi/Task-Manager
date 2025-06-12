# Task-Manager

A secure and user-friendly RESTful API built with Node.js, Express, and MongoDB, enabling users to register, authenticate, and manage their personal tasks with full CRUD (Create, Read, Update, Delete) functionality. Authentication is handled using JWT (JSON Web Tokens), ensuring secure access to protected routes.

This project serves as the backend for a simple yet effective task management application. It provides a structured way for users to manage daily tasks and keep track of their progress. Each user can:

Create an account and log in securely.

Access their user profile.

Add, update, view, and delete tasks.

Toggle task completion status.

Retrieve a summary of total, completed, and pending tasks.

All sensitive endpoints are protected using JWT authentication middleware.

Following are Set Up instructions:
Clone the Project Repository

Navigate to the Project Directory : cd task-manager then cd client 

Install Server Dependencies using npm install

Create .env file and add: 

PORT=3000,
MONGO_URI=mongodb://localhost:27017/taskmanager,
JWT_SECRET=key

Start MongoDB Server 

For backend navigate to cd server

Install Server Dependencies using npm install and then run node server.js


Technologies Used
Node.js – Server runtime environment

Express – Web framework for Node.js

MongoDB & Mongoose – Database  for managing data

JWT – For secure user authentication

bcryptjs – To hash user passwords

dotenv – To manage environment variables



