# Usamos una imagen base de Go
FROM golang:1.24-alpine

# Seteamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos del proyecto al contenedor
COPY go.mod go.sum ./
RUN go mod download

# Copiamos el código fuente al contenedor
COPY . .

# Copy the .env file
COPY .env /app/

# Exponemos el puerto donde corre el servicio
EXPOSE 5016

# Comando para iniciar la aplicación
CMD ["go", "run", "main.go"]