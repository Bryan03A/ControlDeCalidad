# Authentication Microservice - Flask (JWT + PostgreSQL + RabbitMQ)

## Description
This microservice handles user authentication and profile retrieval using JWTs. Additionally, it emits domain events to a RabbitMQ queue, enabling event-driven architecture integration. It follows the **KISS (Keep It Simple, Stupid)** principle for clarity and scalability.

## Features
- JWT-based stateless authentication with 1-hour expiry
- PostgreSQL integration via SQLAlchemy (AWS RDS)
- Password hashing with PBKDF2-HMAC-SHA256
- RabbitMQ integration for publishing user-related events
- Health check and database diagnostics endpoints
- CORS support

## Endpoints

| Endpoint        | Method | Description                                           |
|-----------------|--------|-------------------------------------------------------|
| /auth/health    | GET    | Load balancer health check (DB ping)                  |
| /test-db        | GET    | Manual DB connection test (returns timestamp)         |
| /login          | POST   | Login with username/email + password, returns JWT     |
| /profile        | GET    | Returns current user's profile info via JWT           |
| /test-event     | GET    | Publishes a test event to RabbitMQ queue              |

## Architecture: KISS + Event-Driven

- **Flask**: Lightweight Python web framework.
- **SQLAlchemy**: ORM layer for PostgreSQL access.
- **JWT**: Stateless user session tokens.
- **RabbitMQ**: Event broker, publishing events to `auth-events` queue.
- **Environment Variables**: Managed via `dotenv`.
- **Password Hashing**: PBKDF2 with SHA256.

The event-driven messaging extends the architecture beyond REST, enabling scalable asynchronous processing.

## Dependencies
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- python-dotenv
- PyJWT
- pika (RabbitMQ client)
- PostgreSQL

## External Connections Diagram

```
                      ┌──────────────┐        JWT      ┌──────────────┐
                      │  Frontend /  │◄───────────────►│   Flask App  │
                      │   Client     │                 └──────┬───────┘
                      └──────────────┘                        │
                                                              │ DB URI
                                                        ┌─────▼──────┐
                                                        │ PostgreSQL │
                                                        └─────┬──────┘
                                                              │
                                                              │ Events published
                                                       ┌──────▼───────┐
                                                       │ RabbitMQ     │
                                                       │ Queue:       │
                                                       │ auth-events  │
                                                       └──────────────┘
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Used to sign JWT tokens
- `RABBITMQ_HOST`: RabbitMQ broker hostname
- `RABBITMQ_PORT`: RabbitMQ port
- `RABBITMQ_QUEUE`: RabbitMQ queue name (`auth-events`)
- `SQLALCHEMY_TRACK_MODIFICATIONS`: Optional, default `False`

## Running the Service
```bash
pip install -r requirements.txt
python app.py
```

## Recommendations
- In production, run behind a WSGI server like Gunicorn
- Use HTTPS and random per-user salts for secure password hashing
- Secure environment variables using a secrets manager (AWS Secrets Manager, Vault, etc.)

---
