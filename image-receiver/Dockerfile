FROM node:12.7.0-stretch-slim

RUN mkdir /service
WORKDIR /service

COPY . .
RUN npm install \
    && npm run compile \
    && npm prune --production

RUN rm -rf src

EXPOSE 8080/tcp
EXPOSE 5000/udp

CMD ["npm", "start"]
