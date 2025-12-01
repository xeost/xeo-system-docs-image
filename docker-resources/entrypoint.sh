#!/bin/sh

# Default values if not set
: "${OPENAPI_FILE:=api-spec.yml}"
: "${SPEC_SERVER_PORT:=8081}"
: "${SPEC_EXTERNAL_PORT:=12001}"
: "${SWAGGER_JSON_URL:=http://localhost:${SPEC_EXTERNAL_PORT}/${OPENAPI_FILE}}"
: "${SPEC_URL:=http://localhost:${SPEC_EXTERNAL_PORT}/${OPENAPI_FILE}}"

# Configure Nginx to listen on the correct port for the Spec Server
sed -i "s|listen 8081;|listen ${SPEC_SERVER_PORT};|g" /etc/nginx/nginx.conf

echo "Using OPENAPI_FILE: $OPENAPI_FILE"
echo "Using SWAGGER_JSON_URL: $SWAGGER_JSON_URL"
echo "Using SPEC_URL: $SPEC_URL"

# Update Swagger UI configuration
if [ -f /app/swagger-ui/swagger-initializer.js ]; then
    sed -i "s|url:.*|url: \"$SWAGGER_JSON_URL\",|g" /app/swagger-ui/swagger-initializer.js
fi

# Update Redoc configuration
if [ -f /app/redoc/index.html ]; then
    sed -i "s|URL_PLACEHOLDER|$SPEC_URL|g" /app/redoc/index.html
fi

# Start supervisord
exec supervisord -c /etc/supervisord.conf
