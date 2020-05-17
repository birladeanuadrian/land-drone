@echo off

call docker build -t cloud-server .

docker run -it -p 8080:8080 -p 5000:5000/udp cloud-server
