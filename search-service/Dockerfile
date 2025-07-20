# Usamos una imagen base de Go para compilar el código
FROM golang:1.24-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos go.mod y go.sum para aprovechar el cache de Docker en las dependencias
COPY go.mod go.sum ./

# Instalamos las dependencias
RUN go mod download

# Copiamos el resto de los archivos del proyecto al contenedor
COPY . .

# Exponemos el puerto 5005 para que el contenedor sea accesible desde fuera
EXPOSE 5005

# Copy the .env file
COPY .env /app/

# Ejecutamos el servidor
CMD ["go", "run", "main.go"]
