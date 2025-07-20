 # Chat Microservice - FastAPI + WebSocket + MongoDB
 
 ## Description
 This microservice enables real-time chat communication between two users using WebSocket. Messages are persisted in MongoDB, and user identity is verified via an external SOAP-based user search service. It is designed for simplicity, real-time performance, and integration into a broader microservice ecosystem.
 
 ## Features
 - Real-time bidirectional messaging via WebSocket
 - Unique chat session identification between any two users
 - Persistent message storage in MongoDB with history loading
 - External validation of users through a REST call to a SOAP-based service
 - Connection cleanup and memory safety on disconnect
 - Environment-driven configuration for flexibility and deployment
 
 ## Endpoints
 
 | Endpoint                       | Method   | Description                                                    |
 |-------------------------------|----------|----------------------------------------------------------------|
 | `/ws/{user1}/{user2}`         | WebSocket| Establishes a chat session between `user1` and `user2`         |
 
 ## Architecture: WebSocket Real-Time Service
 
 - **Connection Manager**: Tracks all live WebSocket connections by `chat_id`.
 - **Persistence Layer**: MongoDB stores all chat histories using `chat_id` as the document key.
 - **User Verification Layer**: Uses `requests.get()` to query an external SOAP gateway to validate users before session starts.
 - **Chat Session Lifecycle**:
   - On connect: verifies users, loads history, registers connection
   - On message: saves to MongoDB and broadcasts to other user
   - On disconnect: cleans up connection and chat tracking
 
 ## External Communication Diagram
 
 ```plaintext
              ┌──────────────┐
              │  Frontend /  │
              │   Client     │
              └──────┬───────┘
                     │ WebSocket (JSON)
                     ▼
              ┌──────────────┐
              │   FastAPI    │
              │  Chat API    │
              └──────┬───────┘
                     │
          ┌──────────┴───────────┐
          │                      │
     ┌────▼────┐           ┌─────▼────┐
     │ MongoDB │           │ user-search│
     │ Storage │           │  SOAP API  │
     └─────────┘           └────────────┘
 ```
 
 ## Environment Variables / Config
 
 - `MONGO_URI`: MongoDB connection URI (e.g. `mongodb://user:pass@host:port/dbname`)
 - `SECRET_KEY`: Optional secret for additional security logic
 - `USER_SEARCH_URL`: Endpoint of external user validation service (e.g., `http://54.243.94.215:5016/user/soap`)
 
 ## Running the Service
 
 ```bash
 pip install -r requirements.txt
 uvicorn main:app --host 0.0.0.0 --port 5010 --reload
 ```
 
 ## Recommendations
 - Use a production-grade WebSocket-capable ASGI server like Uvicorn with Gunicorn
 - Secure `.env` files using a secrets manager (e.g., AWS Secrets Manager)
 - Implement authentication for WebSocket upgrades (e.g., JWT validation)
 - Add rate limiting and abuse protection for public endpoints
 - Monitor chat metrics (active connections, messages per second)
 - Extend with user presence notifications and typing indicators