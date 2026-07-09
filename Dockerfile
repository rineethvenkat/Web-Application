FROM nginx
MAINTAINER name Rineeth
LABEL This is a Foobie hub app.
EXPOSE 80
WORKDIR /project/foodie-app/
COPY index.html .
