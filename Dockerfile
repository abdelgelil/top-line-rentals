FROM node:24-slim

WORKDIR /app

# Copy dependency manifests first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy all backend source code
COPY . .

EXPOSE 5000

ENV PORT=5000

CMD ["node", "server.js"]