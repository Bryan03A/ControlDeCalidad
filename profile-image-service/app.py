from flask import Flask, request, jsonify
import boto3
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
# CORS(app, origins=["http://3.227.120.143:8080"])  # Uncomment if needed

# Initialize MinIO/S3 client
s3 = boto3.client('s3',
    endpoint_url=os.getenv("AWS_ENDPOINT_URL"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION"),
)

BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

# Ensure the bucket exists, create it if not
def create_bucket_if_not_exists(bucket_name):
    try:
        s3.head_bucket(Bucket=bucket_name)
        print(f"✅ Bucket '{bucket_name}' already exists.")
    except Exception:
        s3.create_bucket(Bucket=bucket_name)
        print(f"🪣 Bucket '{bucket_name}' created.")

create_bucket_if_not_exists(BUCKET_NAME)

# Upload an image to MinIO
@app.route('/upload_image', methods=['POST'])
def upload_image():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file provided"}), 400

    filename = secure_filename(file.filename)

    try:
        s3.upload_fileobj(file, BUCKET_NAME, filename, ExtraArgs={'ACL': 'public-read'})
        url = f"{os.getenv('AWS_ENDPOINT_URL')}/{BUCKET_NAME}/{filename}"
        return jsonify({"message": "Image uploaded successfully", "url": url})
    except Exception as e:
        print(f"❌ Upload error: {e}")
        return jsonify({"error": str(e)}), 500

# List all images in the bucket
@app.route('/list_images', methods=['GET'])
def list_images():
    try:
        objects = s3.list_objects_v2(Bucket=BUCKET_NAME).get("Contents", [])
        urls = [f"{os.getenv('AWS_ENDPOINT_URL')}/{BUCKET_NAME}/{obj['Key']}" for obj in objects]
        return jsonify({"urls": urls})
    except Exception as e:
        print(f"❌ List error: {e}")
        return jsonify({"error": str(e)}), 500

# Health check endpoint for load balancer
@app.route('/profile-image/health', methods=['GET'])
def health_check():
    try:
        s3.list_buckets()
        return jsonify({"status": "healthy"}), 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5015)