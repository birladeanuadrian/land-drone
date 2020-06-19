FROM ubuntu:20.10

COPY . .

RUN cp ./self-signed.conf /etc/nginx/snippets/self-signed.conf
RUN cp ./ssl-params.conf /etc/nginx/snippets/ssl-params.conf

RUN cp ./default-ssl.conf /etc/nginx/conf.d/
