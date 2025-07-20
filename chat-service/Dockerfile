# Base image for Python
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file and install the dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the source code of the microservice
COPY . /app/

# Expose the port on which the service will run
EXPOSE 5010

# Copy the .env file
COPY .env /app/

# Command to run the service
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5010"]