# Session Service - Node.js / Express + PostgreSQL + MongoDB

## Description
This microservice manages the full lifecycle of user sessions including creation, retrieval, update, and deletion. It connects to both PostgreSQL (for user data) and MongoDB (for session persistence), and uses Express for routing. It includes JWT token middleware for security and a health check endpoint for operational monitoring.

## Features
- Connects to PostgreSQL and MongoDB for relational user data and session data respectively
- JWT-based token middleware for securing session-related routes
- Modular architecture with separated controllers, routes, and middlewares
- Publishes and consumes events using RabbitMQ with configurable queues and topics
- Provides comprehensive REST endpoints to manage sessions
- Health check endpoint for load balancers and orchestration tools
- CORS support (optional)

## Endpoints
| Endpoint               | Method | Description                                 |
|------------------------|--------|---------------------------------------------|
| /last-connection       | GET    | Retrieves the user's last session info      |
| /api/sessions          | POST   | Create a new session                         |
| /api/sessions/:userId  | GET    | Retrieve sessions for a specific user       |
| /api/sessions/:userId  | PUT    | Update a specific user session               |
| /api/sessions/:userId  | DELETE | Delete a specific user session               |
| /api/sessions/verify   | GET    | Verify session token                         |
| /health                | GET    | Health check endpoint                        |

## Architecture Style
The service follows **DRY (Don't Repeat Yourself)** and **Modular** design principles:

- Separation of concerns into controllers, routes, and middleware for maintainability
- Reuses code where appropriate to avoid duplication
- Supports integration of both SQL and NoSQL databases transparently
- Event-driven design via RabbitMQ enhances decoupling and scalability

### 📌 Why DRY + Modular is the Most Applicable Design Principle
- Controllers and routes are clearly separated, minimizing repeated logic
- Middleware handles security aspects, centralizing authentication logic
- Supports extension with minimal effort due to modular codebase

## Communication Type
- RESTful API using JSON for all session management operations

## External Communication Diagram
```
                    ┌────────────┐     REST/API     ┌────────────────────┐
                    │  Frontend  │◄────────────────►│  Session Service   │
                    └────────────┘                  └────────┬───────────┘
                                                             │
                                                     ┌───────▼────────┐
                                                     │   MongoDB      │
                                                     └────────────────┘
```

## Environment Variables
- `PORT`: Port the server listens on
- `MONGO_URI`: Connection string for MongoDB

## Running the Service
```bash
npm install
node app.js
```

## Best Practices Followed
- Early validation of required environment variables
- Modular route design for scalability
- Minimal setup with clear responsibilities
- Health-check endpoint for container orchestration

---
