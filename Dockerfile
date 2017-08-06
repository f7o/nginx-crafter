FROM openjdk:8
MAINTAINER Florian Zouhar <florian.zouhar@igd.fraunhofer.de>

COPY . /usr/local/service-manager
RUN chmod +x /usr/local/service-manager/scripts/*.sh
RUN /usr/local/service-manager/scripts/build.sh

COPY ./sm-server/conf/config.json /conf/config.json

WORKDIR /

ENTRYPOINT /usr/local/service-manager/scripts/start.sh -conf /conf/config.json