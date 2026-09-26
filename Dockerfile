# Use Debian-based Node slim image for glibc support
FROM node:24-slim

WORKDIR /app

# Copy package files using JSON array format for paths with spaces
COPY ["client/Top Line/package*.json", "./"]

# Install dependencies inside container
RUN npm install --include=optional

# Copy all source files
COPY ["client/Top Line/", "./"]

# Accept build arguments for Vite (baked at build time)
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_UPLOAD_PRESET
ARG VITE_API_BASE_URL

# Expose build arguments to the Vite build process environment
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME
ENV VITE_CLOUDINARY_UPLOAD_PRESET=$VITE_CLOUDINARY_UPLOAD_PRESET
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build static bundle with embedded env vars
RUN npm run build

# Expose dynamic port matching Express (8080)
ENV PORT=8080
EXPOSE 8080

# Start production server using Vite preview for static assets
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]