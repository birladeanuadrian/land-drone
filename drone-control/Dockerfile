##############
#### build ###
##############
#
## base image
#FROM node:12.11.1-alpine as build
#
## set working directory
#RUN mkdir /service
#WORKDIR /service
#
#COPY . .
#
## add `/app/node_modules/.bin` to $PATH
##ENV PATH ./node_modules/.bin:$PATH
#
## install and cache app dependencies
#RUN rm -rf dist/ \
#    && rm -rf node_modules \
#    && npm install
#
## generate build
#RUN npm run build
#
#############
#### prod ###
#############
#
## base image
#FROM nginx:1.17.4-alpine
#
## copy artifact build from the 'build environment'
#COPY --from=build /service/dist /usr/share/nginx/html
#
## expose port 80
#EXPOSE 80
#
## run nginx
#CMD ["nginx", "-g", "daemon off;"]


# base image
FROM node:12.11.1-alpine as build

# set working directory
RUN mkdir /service
WORKDIR /service

COPY . .

RUN npm install

CMD ["npm", "run", "start-prod"]


# Face recognition
# HAAR features opnecv + dnn for template feature genertion
