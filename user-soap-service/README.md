# User Registration Service - Sinatra + PostgreSQL (SOAP API)

## Description
This microservice is built with **Sinatra** (Ruby) and uses **PostgreSQL** to register users through a **SOAP-based API**. It supports cross-origin requests (CORS) and exposes a load-balancer-friendly health check endpoint.

## Features
- SOAP-based user registration endpoint
- Secure password hashing using PBKDF2-HMAC-SHA256
- Automatically creates the `user` table if it doesn’t exist
- CORS enabled for browser-based SOAP clients
- Health check endpoint for monitoring
- Lightweight and efficient Sinatra server
- Publishes `UserRegistered` events to the RabbitMQ `user-events` queue

## Endpoints
| Endpoint                | Method | Description                       |
|-------------------------|--------|-----------------------------------|
| /register               | POST   | SOAP-based user registration      |
| /user-soap/health       | GET    | Health check for DB connectivity  |

## Architecture Style
This service follows the **KISS (Keep It Simple, Stupid)** principle, using Sinatra’s minimalistic style for clarity and quick implementation.

### 📌 Why KISS is the Most Applicable Design Principle
The code exemplifies the KISS principle with its direct implementation of SOAP logic without layers of unnecessary abstraction.

#### ✅ Justification:
1. **Straightforward SOAP parsing logic**:
   - Uses Nokogiri to parse specific XML fields with clear XPath usage
2. **Direct database interaction**:
   - Executes SQL using `pg` directly, no ORM overhead
3. **No unnecessary frameworks or dependencies**:
   - Only essential gems are used
4. **Immediate startup and configuration**:
   - Table is created at boot, health check is always ready

## Communication Type
- **SOAP**: User registration is done through SOAP XML messages
- **REST-style**: Health check uses HTTP GET with plain text response

## External Communication Diagram
```
                        ┌────────────┐     SOAP/XML     ┌──────────────────────┐
                        │  Frontend  │◄────────────────►│  User SOAP Service   │
                        └────────────┘                  └────────┬─────────────┘
                                                                 │
                                                           ┌─────▼─────┐
                                                           │PostgreSQL │
                                                           └─────┬─────┘
                                                                 │
                                                                 │ Events published
                                                          ┌──────▼───────┐
                                                          │ RabbitMQ     │
                                                          │ Queue:       │
                                                          │ user-events  │
                                                          └──────────────┘
```

## Environment Variables
- `POSTGRESQL_DATABASE`: Database name
- `POSTGRESQL_HOST`: Database host
- `POSTGRESQL_PORT`: Port number
- `POSTGRESQL_USER`: DB user
- `POSTGRESQL_PASSWORD`: DB password
- `RABBITMQ_HOST`: RabbitMQ broker hostname
- `RABBITMQ_PORT`: RabbitMQ port
- `RABBITMQ_QUEUE`: RabbitMQ queue name (`user-events`)

## Running the Service
```bash
gem install bundler
bundle install
ruby app.rb
```

## Best Practices Followed
- Cross-Origin setup for SOAP via browser clients
- Health-check endpoint for container monitoring
- Passwords stored using PBKDF2-HMAC with salt
- Validations for SOAP input and graceful error handling

---

