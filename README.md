# LearnHub – Online Learning Platform

LearnHub is a full-stack online learning platform developed using Spring Boot, React, and MongoDB. It provides a platform where learners can explore and enroll in courses, instructors can create and manage courses, and administrators can manage platform activities.

The application implements JWT-based authentication and role-based authorization to provide secure access to different functionalities.

## 🚀 Features

### Authentication & Authorization
- User registration and login.
- JWT-based authentication.
- Secure password encryption using BCrypt.
- Role-based access control:
    -   LEARNER   – Browse courses, enroll, and access lessons.
    -   INSTRUCTOR   – Create and manage courses and lessons.
    -   ADMIN   – Manage platform activities and instructor applications.
- Protected frontend routes and backend APIs.

### Learner
- Browse published courses.
- Search and filter courses.
- View course details.
- Preview available lessons.
- Enroll in courses.
- Access enrolled course content.

### Instructor
- Apply to become an instructor.
- Track application status.
- Create and manage courses.
- Add and manage course lessons.

### Admin
- View instructor applications.
- Approve or reject applications.
- Manage platform activities.
- Role-based administrative access.

### UI Features
- Responsive user interface.
- Modern course catalogue.
- Interactive hero carousel.
- Reusable React components.
- Role-based dashboards and navigation.

## 🛠️ Technology Stack

| Category | Technologies |

| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS |
| Backend | Java 17, Spring Boot |
| Security | Spring Security, JWT |
| Database | MongoDB |
| API Communication | Axios, REST APIs |
| Routing | React Router |
| Server State | TanStack React Query |
| Icons | Lucide React |

## 📁 Project Structure

   
learning-Platform/
│
├── learning-platform/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── .env
│
├── learning-platform-frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
   

## ⚙️ Prerequisites

Make sure the following software is installed:

- Java JDK 17
- Apache Maven
- Node.js and npm
- MongoDB Community Server
- Git
- Visual Studio Code or IntelliJ IDEA

## 🔧 Installation and Setup

### 1. Clone the Repository

      
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd learning-Platform
   

### 2. Backend Setup – Spring Boot

Navigate to the backend directory:
 
cd learning-platform

#### Configure MongoDB

Make sure the MongoDB service is running.

The application uses the following local MongoDB database:

mongodb://localhost:27017/learning_platform

MongoDB will create the database and collections when data is first stored.

#### Generate a Secure JWT Secret

The application uses JWT tokens for user authentication and authorization.

Generate a secure 256-bit secret using Windows PowerShell.

Run:

$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$JWT_SECRET = [Convert]::ToBase64String($bytes)
$JWT_SECRET
   

Copy the generated secret. It will be used in the backend environment configuration.

#### Create the Backend `.env` File

Inside the `learning-platform` folder, create a file named:

.env
   

Add the following:

JWT_SECRET=PASTE_YOUR_GENERATED_SECRET_HERE
   

Replace the placeholder with your actual generated JWT secret.

Important:   Spring Boot does not automatically read `.env` files. You must make the variable available to the application process.

For Windows PowerShell, run this command from the `learning-platform` directory:

$env:JWT_SECRET = "PASTE_YOUR_GENERATED_SECRET_HERE"
   

Then start the backend:

mvn spring-boot:run
   

Alternatively, configure `JWT_SECRET` in your IDE's Run Configuration environment variables.

#### Backend Configuration

The `src/main/resources/application.properties` file contains:

spring.application.name=learning-platform

spring.data.mongodb.uri=mongodb://localhost:27017/learning_platform

server.port=8080

app.jwt.secret=${JWT_SECRET}
app.jwt.expiration-ms=3600000
   

JWT token expiration is configured for one hour.

Backend runs at:

   
http://localhost:8080
   

### 3. Frontend Setup – React

Open a new terminal and navigate to the project root:

cd Learning-Platform

Navigate to the frontend directory:

cd learning-platform-frontend
   

#### Install Dependencies

npm install

#### Create the Frontend `.env` File

Inside `learning-platform-frontend`, create:

.env

Add:

VITE_API_BASE_URL=http://localhost:8080/api
   

Make sure your Axios configuration uses this environment variable:

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;
   

If your Axios instance already has an interceptor for attaching the JWT token, retain that interceptor.

#### Start the Frontend


npm run dev
   

Frontend runs at:

   
http://localhost:5173
   

## ▶️ Running the Complete Application

Make sure MongoDB is running before starting the application.

  Terminal 1 – Backend  

  
cd learning-platform

$env:JWT_SECRET = "YOUR_GENERATED_JWT_SECRET"

mvn spring-boot:run
   

  Terminal 2 – Frontend  

 
cd learning-platform-frontend

npm install

npm run dev
   

Open the application in your browser:

   
http://localhost:5173
   

## 🔐 Authentication Flow

1. A user registers using their name, email, and password.
2. The backend validates the registration details.
3. The password is encrypted using BCrypt.
4. During login, Spring Security authenticates the user.
5. A JWT token is generated and returned by the backend.
6. The frontend stores the token in session storage.
7. Axios attaches the token to protected API requests.

Example authorization header:

Authorization: Bearer <JWT_TOKEN>
   

The backend validates the JWT and checks the user's role before granting access to protected resources.

## 🔒 Environment Variables and Security

Never expose sensitive information in a public repository.

Add the following to the root `.gitignore` file:

   gitignore
# Environment variables
.env
.env.*
!.env.example

# Frontend dependencies and build files
node_modules/
dist/

# Backend build files
target/

# IDE files
.idea/
.vscode/

# Logs
*.log

# Operating system files
.DS_Store
Thumbs.db
   

You can create example environment files for other developers.

  Backend – `learning-platform/.env.example`  

  
JWT_SECRET=REPLACE_WITH_YOUR_GENERATED_SECRET
   

  Frontend – `learning-platform-frontend/.env.example`  

   
VITE_API_BASE_URL=http://localhost:8080/api
   

Do not commit actual `.env` files or JWT secrets to GitHub.

  Security recommendations:  
- Generate a strong random JWT secret.
- Never place the JWT secret in frontend environment variables.
- Keep passwords encrypted using BCrypt.
- Use HTTPS in production.
- Keep backend authorization checks enabled for protected endpoints.

## 🔮 Future Enhancements

- Course completion tracking.
- Course ratings and reviews.
- Certificate generation.
- Payment gateway integration.
- Email notifications.
- Advanced learning analytics.
- Cloud deployment.

## 👩‍💻 Project

  LearnHub – Online Learning Platform  

A full-stack web application built using Java, Spring Boot, React, and MongoDB.