FROM nginx
MAINTAINER name Rineeth
LABEL This is a Foobie hub app.
EXPOSE 80
COPY index.html /usr/share/nginx/html/
