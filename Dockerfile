FROM node:24-slim

WORKDIR /app

# Copy root dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy backend files and directories
COPY server.js ./
COPY server/ ./server/
COPY config/ ./config/
COPY controllers/ ./controllers/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY routes/ ./routes/
COPY utils/ ./utils/

EXPOSE 5000

ENV PORT=5000

CMD ["node", "server.js"]