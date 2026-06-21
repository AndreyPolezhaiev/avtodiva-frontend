#!/bin/sh

envsubst '${NGINX_PORT} ${BACKEND_HOST} ${BACKEND_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

find /usr/share/nginx/html -name "*.js" -exec sed -i "s|API_URL_PLACEHOLDER|${API_LINK}|g" {} +

exec "$@"