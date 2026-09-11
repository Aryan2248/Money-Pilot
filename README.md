✈️ Money Pilot
Navigate Your Finances with Precision.

Money Pilot is a full-stack personal finance management application designed to help users track expenses, manage budgets, and visualize their financial health. Built with a robust Java Spring Boot backend and a modern React frontend, it provides a secure and seamless experience for modern wealth management.

🛠️ Tech Stack
Frontend
React.js: Functional components and Hooks for a dynamic UI.

Tailwind CSS: Utility-first styling for a professional, responsive design.

React Router: Client-side navigation for a single-page application experience.

Axios: Promised-based HTTP client for API communication.

Backend
Java Spring Boot: High-performance RESTful API architecture.

Spring Security: Advanced security configuration for endpoint protection.

JWT (JSON Web Tokens): Stateless authentication for secure session management.

MongoDB: NoSQL database for flexible and scalable data storage.

BCrypt: Industry-standard password hashing.

✨ Key Features
Secure Authentication: Complete signup and login flow with encrypted passwords and JWT-protected endpoints.

Real-time Dashboard: Instantly view total income, remaining balance, and total savings.

Expense Management: (Coming Soon) Add, categorize, and track daily spending.

Stateless Architecture: Secure communication between frontend and backend using modern web standards.

🚀 Getting Started
Prerequisites
JDK 17 or higher

Node.js (v18+)

MongoDB (Local or Atlas)

Installation
Clone the Repository

Bash
git clone https://github.com/yourusername/money-pilot.git
cd money-pilot
Backend Setup

Navigate to the backend directory.

Update src/main/resources/application.properties with your MongoDB URI.

Run the application:

Bash
./mvnw spring-boot:run
Frontend Setup

Navigate to the money-pilot-frontend directory.

Install dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
🔒 Security Implementation
The application utilizes a Stateless Security Model:

Users register and login to receive a JWT.

The frontend stores the token securely and attaches it to the Authorization: Bearer <token> header for all API requests.

The Spring Boot JwtFilter intercepts requests to validate the token before granting access to sensitive data.

📂 Project Structure
Plaintext
├── money-pilot-backend
│   ├── src/main/java/com/example/Money_tracker
│   │   ├── controller/    # REST Endpoints
│   │   ├── model/         # MongoDB Entities
│   │   ├── security/      # JWT & Security Config
│   │   └── repository/    # Data Access Layer
└── money-pilot-frontend
    ├── src
    │   ├── pages/         # Dashboard, Login, Register
    │   ├── components/    # Reusable UI elements
    │   └── services/      # API connection logic
📄 License
Distributed under the MIT License. See LICENSE for more information.
