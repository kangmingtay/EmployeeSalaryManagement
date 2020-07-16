FROM node:14.4.0

EXPOSE 8888

WORKDIR /app

COPY ./server/package.json /app

RUN ["npm", "install"]