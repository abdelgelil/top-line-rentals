# Root Dockerfile for Railway
FROM node:24-alpine

WORKDIR /app

# Copy package files from the Top Line directory
COPY "client/Top Line/package*.json" ./

# Install dependencies inside container
RUN npm install --include=optional

# Copy all source files from Top Line
COPY "client/Top Line/" ./

# Build the Vite static assets
RUN npm run build

# Expose dynamic port
ENV PORT=3000
EXPOSE 3000

# Start production Express server
CMD ["node", "server.js"]
