# Multi-stage build for Docusaurus documentation site
# Build arguments allow injecting API/WS endpoints at build time
ARG NODE_VERSION=22-alpine
FROM node:${NODE_VERSION} AS build

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --no-audit --no-fund

# Copy source files
COPY . .

# Build Docusaurus site
RUN npm run docusaurus:build

# Runtime image (serve static assets via nginx)
FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built Docusaurus assets
COPY --from=build /app/build .

# Copy custom nginx config
COPY .github/config/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8000/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
