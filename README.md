# ✈️ Money Pilot

**Navigate Your Finances with Precision.**

Money Pilot is a full-stack personal finance management application designed to help users track expenses, manage budgets, and visualize their financial health. Built with a robust Java Spring Boot backend and a modern React frontend, it provides a secure and seamless experience for modern wealth management.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — Functional components and Hooks for a dynamic UI
- **Tailwind CSS** — Utility-first styling for a professional, responsive design
- **React Router** — Client-side navigation for a single-page application experience
- **Axios** — Promise-based HTTP client for API communication
- **jsPDF + jsPDF-AutoTable** — Client-side PDF statement generation

### Backend
- **Java Spring Boot** — High-performance RESTful API architecture
- **Spring Security** — Advanced security configuration for endpoint protection
- **JWT (JSON Web Tokens)** — Stateless authentication for secure session management
- **MongoDB** — NoSQL database for flexible and scalable data storage
- **BCrypt** — Industry-standard password hashing

---

## ✨ Key Features

- **Secure Authentication** — Signup and login with encrypted (BCrypt) passwords and JWT-protected endpoints
- **OTP-Based Password Reset** — Two-step forgot-password flow: request an OTP for your email, then confirm it to set a new password (see [Note on OTP Delivery](#-note-on-otp-delivery) below)
- **Real-Time Wallet Dashboard** — Instantly view total income, remaining balance, and total savings
- **Income Management** — Add income with a configurable savings allocation percentage, automatically split between spending balance and an emergency savings fund
- **Emergency Withdrawals** — Move money back from savings to spending balance when needed
- **Expense Tracking (Full CRUD)** — Add, edit, delete, and list expenses by category, with automatic balance deduction/refund
- **Budget Limits** — Set a monthly spending limit per category and check real-time status (on track vs. exceeded)
- **Monthly Filtering** — View expenses scoped to a specific month
- **PDF Statement Export** — Download a formatted monthly financial statement (income, savings, balance, and transaction history)
- **Stateless Architecture** — Secure communication between frontend and backend using JWT, validated on every request via a custom filter

---

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/money-pilot.git
cd money-pilot
```

**2. Backend setup**
```bash
cd money-pilot-backend
```
Copy the example config and fill in your own values:
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```
Edit `application.properties` with your MongoDB URI and a JWT secret:
```properties
spring.data.mongodb.uri=your_mongodb_connection_string
jwt.secret=a_long_random_secret_string
server.port=8080
```
Run the application:
```bash
./mvnw spring-boot:run
```

**3. Frontend setup**
```bash
cd money-pilot-frontend
npm install
```
Confirm the API base URL in `src/services/api.js` matches your backend port (default `http://localhost:8080`), then:
```bash
npm run dev
```

---

## 🔒 Security Implementation

Money Pilot uses a **stateless JWT security model**:

- Users register and log in to receive a signed JWT.
- The frontend stores the token in `localStorage` and attaches it via the `Authorization: Bearer <token>` header on every API request.
- A custom `JwtFilter` intercepts each request server-side, validates the token, and populates the Spring Security context before the request reaches a controller.
- Passwords are never stored in plain text — all passwords are hashed with BCrypt before being persisted.
- A `GlobalExceptionHandler` converts internal errors into clean, consistent JSON responses instead of leaking stack traces.

### 📌 Note on OTP Delivery
The forgot-password flow generates a real, time-limited (5-minute) OTP server-side. For this project, the OTP is returned directly in the API response instead of being emailed, since no transactional email provider (e.g. SMTP, SendGrid) is configured. In a production deployment, `OtpService` would be wired to an email service instead of returning the OTP to the client.

---

## 📂 Project Structure

```
├── money-pilot-backend
│   └── src/main/java/com/example/Money_tracker
│       ├── controller/    # REST endpoints (Auth, Wallet, Expense, Budget)
│       ├── dto/           # Request/response payload objects
│       ├── exception/     # Global exception handling
│       ├── model/         # MongoDB entities (User, Expense, Budget)
│       ├── repository/    # Spring Data MongoDB repositories
│       ├── security/      # JWT filter, JWT util, Spring Security config
│       └── service/       # Business logic (Wallet, Expense, Budget, OTP)
└── money-pilot-frontend
    └── src
        ├── pages/         # Login, Register, ForgotPassword, Dashboard
        ├── components/    # Modals: Expense, Income, Withdraw, SetBudget
        └── services/      # Axios instance + interceptors (api.js)
```

---

