FROM node:20-alpine

# Install dependencies
# nginx: Web server for Spec, Swagger, Redoc
# supervisor: Process manager to run Nginx and Starlight
# curl: For downloading assets
RUN apk add --no-cache nginx supervisor curl

# Setup working directories
WORKDIR /app

# --- Starlight Setup ---
# Create the Astro project
# We do this in a temp directory first to avoid conflicts
RUN mkdir -p /temp && cd /temp && \
    npm install -g pnpm && \
    pnpm create astro starlight-app --template starlight --yes

# Move to final location
RUN mkdir -p /app/starlight && \
    cp -r /temp/starlight-app/* /app/starlight/ && \
    cp /temp/starlight-app/.* /app/starlight/ 2>/dev/null || true && \
    rm -rf /temp

# Copy Starlight configs from repo
# We assume the build context is the repository root
COPY example/astro.config.mjs /app/starlight/
COPY docker-resources/mermaid-zoom.js /app/starlight/public/
COPY example/docs /app/starlight/src/content/docs

# Install Starlight dependencies
WORKDIR /app/starlight
RUN pnpm install && pnpm add astro-mermaid mermaid

# --- Spec Server Setup ---
# Copy API design files
WORKDIR /app
COPY example/openapi /app/api-design

# --- Swagger UI Setup ---
# Download Swagger UI Dist
RUN mkdir -p /app/swagger-ui && \
    cd /app/swagger-ui && \
    npm install swagger-ui-dist && \
    cp node_modules/swagger-ui-dist/* . && \
    cp node_modules/swagger-ui-dist/index.html . && \
    rm -rf node_modules package.json package-lock.json

# --- Redoc Setup ---
RUN mkdir -p /app/redoc
# Download Redoc standalone
RUN curl -o /app/redoc/redoc.standalone.js https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js
# Create index.html for Redoc
RUN echo '<!DOCTYPE html><html><head><title>Redoc</title><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"><link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet"><style>body{margin:0;padding:0}</style></head><body><redoc spec-url="URL_PLACEHOLDER"></redoc><script src="redoc.standalone.js"></script></body></html>' > /app/redoc/index.html

# --- Configuration ---
# Copy Nginx and Supervisor configs
COPY docker-resources/nginx.conf /etc/nginx/nginx.conf
COPY docker-resources/supervisord.conf /etc/supervisord.conf
COPY docker-resources/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose ports
# 4321: Starlight
# 8081: Spec File Server
# 8082: Swagger UI
# 8083: Redoc
EXPOSE 4321 8081 8082 8083

# Environment variables defaults
ENV OPENAPI_FILE=api-spec.yml
ENV SPEC_SERVER_PORT=8081
ENV SPEC_EXTERNAL_PORT=12001

CMD ["/entrypoint.sh"]
