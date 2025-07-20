# Image Delivery Service - Python / Flask + MinIO (S3-compatible)

## Description
This microservice enables uploading and listing images using Flask and MinIO (or any S3-compatible object storage). It supports a health check endpoint suitable for load balancers and is configurable via environment variables.

## Features
- Upload images securely with `secure_filename`
- List all images stored in the configured bucket with public URLs
- Automatically creates the bucket if it does not exist
- REST API endpoints for image upload, listing, and health checks
- CORS support ready for frontend integration (commented out by default)
- Uses environment variables for flexible configuration

## Endpoints
| Endpoint             | Method | Description                          |
|----------------------|--------|------------------------------------|
| /upload_image        | POST   | Upload an image to MinIO/S3 bucket |
| /list_images         | GET    | List public URLs of all images      |
| /profile-image/health| GET    | Health check for object storage     |

## Architecture Style
This service follows the **POLA (Principle of Least Astonishment)** design principle, focusing on clear, predictable behavior and straightforward implementation.

### 📌 Why POLA is the Most Applicable Design Principle
- Clear and minimal API surface for expected behavior
- Stateless service relying on external object storage
- No hidden complexity or side effects

## Communication Type
- RESTful API over HTTP using JSON responses
- Multipart form-data for image upload

## External Communication Diagram
```
                            ┌────────────┐     REST/API     ┌────────────────────┐
                            │  Frontend  │◄────────────────►│  Image Service     │
                            └────────────┘                  └────────┬───────────┘
                                                                     │
                                                               ┌─────▼──────┐
                                                               │  MinIO/S3  │
                                                               └────────────┘
```

## Environment Variables
- `AWS_ENDPOINT_URL`: MinIO/S3 endpoint (e.g., http://54.152.105.240:9000)
- `AWS_ACCESS_KEY_ID`: Your object storage access key
- `AWS_SECRET_ACCESS_KEY`: Your secret key
- `AWS_REGION`: Region (can be any string for MinIO)
- `AWS_BUCKET_NAME`: Bucket to upload files to

## Running the Service
```bash
pip install -r requirements.txt
python app.py
```

## Best Practices Followed
- Load balancer health check endpoint
- Defensive programming with error handling
- Secure file upload handling (`secure_filename`)
- Modular setup for switching between AWS S3 or MinIO
  
---
