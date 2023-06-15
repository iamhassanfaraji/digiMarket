FROM nginx:1.18.0

COPY ./nginx/nginx.conf /etc/nginx/main.conf

COPY ./nginx/entrypoint.sh ./entrypoint.sh

RUN ["chmod", "+x", "./entrypoint.sh"]