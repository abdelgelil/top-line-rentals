FROM node:24-slim

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build arguments for Vite
ARG VITE_API_BASE_URL
ARG VITE_CLERK_PUBLISHABLE_KEY

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# Run build process
RUN npm run build

EXPOSE 8080

# Use npx to run vite preview directly for the static bundle
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "8080"]
