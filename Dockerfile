FROM node:24-slim

WORKDIR /app

# Copy dependency manifests from the server directory
COPY server/package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy all backend source code from the server directory
COPY server/ .

EXPOSE 5000

ENV PORT=5000

CMD ["node", "server.js"]