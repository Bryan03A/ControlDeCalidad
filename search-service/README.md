 # Model Search Microservice - Go (Gorilla Mux + MongoDB)
 
 ## Description
 This microservice provides a RESTful API to search for models stored in a MongoDB collection. It supports flexible searching by model name and creator with case-insensitive partial matching using regular expressions. The service is designed to be lightweight, reliable, and easy to extend.
 
 ## Features
 - Search models by `name` and/or `created_by` fields using regex for partial and case-insensitive matches
 - Returns an array of matching models or an empty array if no matches or no query parameters are provided
 - Loads environment variables from `.env` file for configuration
 - Validates MongoDB connection on startup to ensure reliability
 - Gracefully handles errors and returns appropriate HTTP status codes and messages
 
 ## Endpoints
 
 | Endpoint      | Method | Description                                                    |
 |---------------|--------|----------------------------------------------------------------|
 | `/search`     | GET    | Searches models by optional query parameters `name` and `created_by` |
 
 ## Architecture: Minimal Layered Design
 
 - **Initialization Layer**: Loads environment variables and sets up MongoDB connection with proper error handling
 - **Routing Layer**: Uses Gorilla Mux to define HTTP route and handler
 - **Handler Layer**: Parses query parameters, constructs MongoDB filters, executes query, and returns JSON response
 - **Data Access**: Encapsulated in MongoDB official driver usage within handler
 
 ## External Connections Diagram
 
 ```plaintext
                ┌──────────────┐
                │   Client     │
                │ (Frontend or │
                │ API Consumer)│
                └──────┬───────┘
                       │ HTTP GET /search?name=&created_by=
                       ▼
                ┌──────────────┐
                │   Go Server  │
                │ (Gorilla Mux)│
                └──────┬───────┘
                       │ MongoDB Query
                       ▼
                ┌──────────────┐
                │   MongoDB    │
                │ Catalog DB   │
                └──────────────┘
 ```
 
 ## Environment Variables / Config
 
 - `MONGO_URI`: MongoDB connection URI (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)
 
 ## Running the Service
 
 ```bash
 go mod tidy
 go run main.go
 ``` 
 
 ## Recommendations
 - Use a process manager or container orchestration for production deployments
 - Secure `.env` files and avoid hardcoding sensitive credentials
 - Add request logging and structured error handling for observability
 - Implement unit and integration tests covering handlers and database interaction
 - Consider adding pagination or limit/offset for large result sets
 
 ---