 # Redis Search History Service - Node.js (Express + Redis)
 
 ## Description
 This microservice manages user search histories by saving recent queries in Redis for fast retrieval. It exposes REST endpoints to store and fetch search records, leveraging Redis lists for efficient insertion and retrieval. The service connects to a remote Redis instance with authentication and ensures reliability with error handling and health checks.
 
 ## Features
 - Save user search queries with associated metadata (`query`, `creator`, `firstModelName`, and timestamp)
 - Retrieve the last 10 saved search queries for a specific user
 - Basic validation of required fields (`query`, `username`) on requests
 - Health check endpoint to monitor service availability
- Robust Redis connection management with error logging
 
 ## Endpoints
 
 | Endpoint          | Method | Description                                             |
 |-------------------|--------|---------------------------------------------------------|
 | `/health`         | GET    | Returns "Healthy" to confirm service is running         |
 | `/save-search`    | POST   | Saves a search query for a user; expects JSON body with `query`, `creator`, `username`, and |`firstModelName` |
 | `/recent-searches`| GET    | Retrieves last 10 searches for a user specified by query param `username` |
 
 ## Architecture: Simple REST Service
 
 - **API Layer**: Express.js handles HTTP routing and JSON body parsing
 - **Persistence Layer**: Redis stores user search history in lists keyed by `search-history:{username}`
 - **Connection Management**: Redis client handles connection lifecycle with async/await and error event listeners
 - **Data Flow**:
   - On save: Validates input, pushes JSON stringified search data onto Redis list
   - On retrieval: Fetches list range, parses JSON strings into objects, and returns as JSON response
 
 ## External Connections Diagram
 
 ```plaintext
            ┌─────────────┐
            │  Frontend / │
            │   Client    │
            └─────┬───────┘
                  │ REST JSON
                  ▼
            ┌─────────────┐
            │  Express.js │
            │  API Server │
            └─────┬───────┘
                  │ Redis client
                  ▼
            ┌─────────────┐
            │   Redis     │
            │ Remote Host │
            └─────────────┘
 ```
 
 ## Environment Variables / Config
 
 - `REDIS_HOST`: Redis server IP or hostname (`54.161.44.165`)
 - `REDIS_PORT`: Redis server port (default `6379`)
 - `REDIS_PASSWORD`: Password for Redis authentication (`ADMIN123`)
 - `PORT`: HTTP server port (default `5006`)
 
 ## Running the Service
 
 ```bash
 npm install
 node index.js
 ``` 
 Or with nodemon for development:
 
 ```bash
 nodemon index.js
 ``` 
 
 ## Recommendations
 - Protect Redis credentials securely in environment variables or secret managers
 - Run behind a reverse proxy or API gateway for rate limiting and TLS termination
 - Add authentication and authorization to API endpoints if exposing externally
 - Implement logging and monitoring for operational visibility and troubleshooting
 - Consider Redis clustering for scalability and high availability
 - Write unit and integration tests for API and Redis interaction logic
 
 ---