# syntax=docker/dockerfile:1
FROM node:12-alpine
WORKDIR /api
COPY . .
RUN yarn install --production   
CMD ["yarn", "start:dev"]
