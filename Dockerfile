FROM openjdk:8
MAINTAINER Florian Zouhar <florian.zouhar@igd.fraunhofer.de>

COPY . /usr/local/nginx-crafter
RUN chmod +x /usr/local/nginx-crafter/scripts/*.sh
RUN /usr/local/nginx-crafter/scripts/build.sh

COPY ./sm-server/conf/config.json /conf/config.json

WORKDIR /

ENTRYPOINT /usr/local/nginx-crafter/scripts/start.sh -conf /conf/config.json