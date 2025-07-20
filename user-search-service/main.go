package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

// PostgreSQL database configuration 🚀
const (
	POSTGRESQL_HOST     = "23.23.135.253"
	POSTGRESQL_PORT     = 5432
	POSTGRESQL_DATABASE = "mydb"
	POSTGRESQL_USER     = "admin"
	POSTGRESQL_PASSWORD = "admin123"
)

var db *sql.DB

// User structure
type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

// Initialize the database using environment variables
func initDB() {
	// Load variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("❌ Failed to load .env file")
	}

	// Read environment variables
	host := os.Getenv("POSTGRESQL_HOST")
	portStr := os.Getenv("POSTGRESQL_PORT")
	user := os.Getenv("POSTGRESQL_USER")
	password := os.Getenv("POSTGRESQL_PASSWORD")
	dbname := os.Getenv("POSTGRESQL_DATABASE")

	// Convert port to integer
	port, err := strconv.Atoi(portStr)
	if err != nil {
		log.Fatal("Invalid port:", err)
	}

	// Create connection string
	connStr := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	// Connect to the database
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Database connection error:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Failed to ping the database:", err)
	}

	fmt.Println("✅ Successfully connected to PostgreSQL")
}

// SOAP function to get a user by username
func getUserByUsernameSOAP(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	var user User
	err := db.QueryRow("SELECT id, username FROM \"user\" WHERE username = $1", username).Scan(&user.ID, &user.Username)
	if err != nil {
		http.Error(w, fmt.Sprintf("Database query error: %s", err), http.StatusInternalServerError)
		return
	}

	// SOAP response message
	soapResponse := fmt.Sprintf(`
		<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
			xmlns:web="http://www.example.org/webservice">
			<soapenv:Header/>
			<soapenv:Body>
				<web:getUserByUsernameResponse>
					<web:id>%s</web:id>
					<web:username>%s</web:username>
				</web:getUserByUsernameResponse>
			</soapenv:Body>
		</soapenv:Envelope>
	`, user.ID, user.Username)

	w.Header().Set("Content-Type", "text/xml")
	w.Write([]byte(soapResponse))
}

// Health check endpoint for load balancer
func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func main() {
	// Initialize database connection
	initDB()

	// Router
	r := mux.NewRouter()

	// Routes
	r.HandleFunc("/user/soap", getUserByUsernameSOAP).Methods("GET")
	r.HandleFunc("/user-search/health", healthCheck).Methods("GET") // 🔥 Health check route

	// CORS settings
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://3.227.120.143:8080"},
		AllowedMethods:   []string{"GET", "POST"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	// Start server
	fmt.Println("Starting SOAP server on port 5016...")
	log.Fatal(http.ListenAndServe("0.0.0.0:5016", handler))
}
