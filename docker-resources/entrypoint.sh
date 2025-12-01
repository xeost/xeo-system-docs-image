#!/bin/sh

# Default values if not set
: "${OPENAPI_FILE:=api-spec.yml}"
: "${SWAGGER_JSON_URL:=http://localhost:12101/${OPENAPI_FILE}}"
: "${SPEC_URL:=http://localhost:12101/${OPENAPI_FILE}}"

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
