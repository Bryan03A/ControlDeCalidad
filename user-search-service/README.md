# 🚀 Service Overview: User SOAP Microservice

This microservice provides user information through a **SOAP-style HTTP GET endpoint**. It connects to a PostgreSQL database to retrieve user data by username and exposes a health check endpoint to monitor service status. The service uses [Gorilla Mux](https://github.com/gorilla/mux) for routing and supports CORS for a specific frontend origin.

---

## 🏗 Architectural Style

This service follows a **Microservices** architecture focusing on a single responsibility: user information retrieval.  
Communication is done via **SOAP over HTTP**, suitable for legacy or strict contract-based systems.

It operates as a stateless HTTP server with SOAP messaging, enabling interoperability with XML SOAP envelope clients.

---

## 🔗 Communication Type

- **Request/Response (Synchronous):**  
  Client sends a request with a `username` parameter and waits for an XML SOAP response containing user details.

- **Protocol:** HTTP/1.1 transports SOAP messages.

---

## 🌐 Endpoints

| Endpoint              | Method | Description                                      | Response Content-Type |
|-----------------------|--------|------------------------------------------------|-----------------------|
| `/user/soap`          | GET    | Retrieve user data by username (SOAP response) | `text/xml`            |
| `/user-search/health` | GET    | Health check endpoint (service status)          | `text/plain`          |

---

## ⚙️ Key Components

- **`initDB`:**  
  Loads PostgreSQL configuration from environment variables, establishes DB connection, and verifies connectivity.

- **`User` struct:**  
  Defines user data model (ID and Username).

- **`getUserByUsernameSOAP` handler:**  
  Processes `username` query parameter, queries DB, constructs SOAP XML response.

- **`healthCheck` handler:**  
  Performs DB ping to verify service and DB availability.

- **CORS Configuration:**  
  Allows requests only from the specified frontend origin, permitting GET and POST methods.

---

## 📊 Communication Flow Diagram

```text
+-------------+          HTTP GET /user/soap?username={username}          +---------------+
|  Client     | --------------------------------------------------------->|  User SOAP    |
| (Frontend)  |                                                           |  Microservice |
+-------------+                                                           +------+--------+
                                                                                 |
                                                                                 | Query DB for user by username
                                                                                 |
                                                                          +------+------+
                                                                          | PostgreSQL  |
                                                                          +-------------+
                                                                                 |
                                                                                 | Returns user info (id, username)
                                                                                 |
+-------------+ <---------------------------------------------------------+------+--------+
|  Client     |             SOAP XML response with user info              |  User SOAP    |
| (Frontend)  |                                                           |  Microservice |
+-------------+                                                           +---------------+

+-------------+          HTTP GET /user-search/health            +---------------+
|  Health     | ------------------------------------------------>|  User SOAP    |
|  Monitor    |                                                  |  Microservice |
+-------------+                                                  +-------+-------+
                                                                         |
                                                                         | DB ping check
                                                                         |
                                                                  +------+------+
                                                                  | PostgreSQL  |
                                                                  +------+------+
                                                                         |
                                                                         | Returns OK / Error
                                                                         |
+-------------+ <-------------------------------------------------+------+--------+
|  Health     |          "✅ Healthy" or "❌ Unhealthy"          |  User SOAP    |
|  Monitor    |                                                   |  Microservice |
+-------------+                                                   +---------------+
``` 

## 📝 Summary

This Go-based microservice delivers user info through SOAP over HTTP, securely interfacing with PostgreSQL. It uses synchronous communication and enforces CORS for a specific frontend origin. The design is clean and modular, following microservice principles with built-in health monitoring.

---

