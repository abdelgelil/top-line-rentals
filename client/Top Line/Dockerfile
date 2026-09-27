FROM node:20-alpine AS build

WORKDIR /app

# Railway Metal uses the repo root as the build context.
COPY ["client/Top Line/package.json", "client/Top Line/package-lock.json", "./"]
RUN npm ci

COPY ["client/Top Line/", "./"]

# Pass build-time Vite environment variables
ARG VITE_API_BASE_URL
RUN VITE_API_BASE_URL=$VITE_API_BASE_URL npm run build

# Production Stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY ["client/Top Line/nginx.conf", "/etc/nginx/conf.d/default.conf"]

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
