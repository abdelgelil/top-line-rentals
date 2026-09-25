# Use Node 24 slim image
FROM node:24-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --include=optional

# Copy application source code
COPY . .

# Build Vite static bundle
RUN npm run build

# Expose dynamic PORT
ENV PORT=3000
EXPOSE 3000

# Start Express production server
CMD ["node", "server.js"]
