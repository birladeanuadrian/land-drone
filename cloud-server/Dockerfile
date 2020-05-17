FROM node:14.2.0-buster-slim
#FROM node:12.16-buster-slim

RUN mkdir /service
WORKDIR /service

RUN apt update \
    && apt install -y python3 build-essential \
    && apt autoremove \
    && apt clean

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

RUN npm run compile \
    && npm prune --production \
    && rm -rf src/

EXPOSE 8080/tcp
EXPOSE 5000/udp

CMD node dist/main.js
