# Session Service - Node.js (PostgreSQL + MongoDB)

## Description
This microservice is designed to retrieve the last session (connection) timestamp of a user. It integrates two databases: PostgreSQL (for user data) and MongoDB (for session data). It exposes RESTful API endpoints and includes a load-balancer-friendly health check.

## Features
- Connects to both PostgreSQL and MongoDB
- Provides endpoint to fetch a user’s latest session
- Includes health check endpoint for container orchestration (e.g., ALB/NLB)
- Uses Express.js for simple and efficient routing
- Structured error handling with standardized responses
- CORS-ready setup for cross-origin requests

## Endpoints
| Endpoint             | Method | Description                                  |
|----------------------|--------|----------------------------------------------|
| /last-connection     | GET    | Retrieves last user session from MongoDB     |
| /connected/health    | GET    | Checks health of PostgreSQL and MongoDB      |

## Architecture Style
The service follows a **modular monolithic** architecture using RESTful communication. It leverages:

- **Express.js**: Lightweight framework for building APIs
- **PostgreSQL**: SQL-based structured user data storage
- **MongoDB**: NoSQL database ideal for dynamic session documents
- **REST API**: Enables simple and stateless interactions between clients and the service

This separation of concerns between user data (PostgreSQL) and session data (MongoDB) enhances scalability and flexibility, especially in microservices-oriented platforms.

## Communication Type
- **RESTful API** using HTTP verbs (`GET`) and query parameters
- JSON is used as the standard format for request/response bodies

## External Communication Diagram
```
                            ┌────────────┐    REST/API     ┌────────────────────┐
                            │   Client   │◄───────────────►│  Session Service   │
                            └────────────┘                 └────────┬───────────┘
                                                                    │
                                      ┌─────────────────────────────┼────────────────────┐
                                      │                             │                    │
                                ┌─────▼─────┐                 ┌─────▼──────┐      ┌──────▼──────┐
                                │ PostgreSQL│◄───────SQL─────►│  Service   │─────►│  MongoDB    │
                                └───────────┘                 └────────────┘      └─────────────┘
```

## Environment Variables
- `PORT`: The port the service listens on
- `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`: PostgreSQL connection info
- `MONGO_URI`: MongoDB connection URI

## Running the Service
```bash
npm install
node app.js
```

## Best Practices Followed
- Stateless REST communication
- Clear separation of data concerns across databases
- Defensive programming with error logging and process exit on failures
- Load balancer readiness through `/connected/health`
- Modular code using schema and utility functions

---
