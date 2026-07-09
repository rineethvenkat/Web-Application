FROM nginx:1.25-alpine
LABEL maintainer="name Rineeth"
LABEL description="This is a Foodie hub app."
EXPOSE 80
COPY . /usr/share/nginx/html/
