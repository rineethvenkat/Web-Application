FROM nginx
MAINTAINER name Rineeth
LABEL This is a Foobie hub app.
EXPOSE 80
COPY . /usr/share/nginx/html/
