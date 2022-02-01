# syntax=docker/dockerfile:1
FROM node:14-alpine
WORKDIR /
COPY . .
RUN yarn install --production   
CMD ["yarn", "dev"]
