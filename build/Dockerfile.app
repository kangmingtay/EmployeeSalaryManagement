FROM node:14.4.0

EXPOSE 3000

WORKDIR /app

COPY ./server/ /app

RUN ["npm", "install"]

ENTRYPOINT ["npm", "start"]
