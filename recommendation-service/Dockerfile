# Usar imagen oficial de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json (si tienes)
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar todo el código fuente al contenedor
COPY . .

# Copy the .env file
COPY .env /app/

# Exponer el puerto donde corre la app
EXPOSE 5006

# Comando para arrancar la app
CMD ["node", "redis-service.js"]