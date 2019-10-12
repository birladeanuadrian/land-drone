FROM node:12.11.1-alpine

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
