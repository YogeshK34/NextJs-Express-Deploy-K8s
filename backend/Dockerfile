FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create directories for ConfigMap and Secret mounts
RUN mkdir -p /app/config /app/secrets

EXPOSE 3001

CMD ["node", "server.js"]
