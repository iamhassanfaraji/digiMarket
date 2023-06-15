#!/bin/sh
envsubst '${NGINX_PORT} ${PANEL_ADMIN_PORT}' < /etc/nginx/main.conf > /etc/nginx/nginx.conf

nginx -g 'daemon off;'