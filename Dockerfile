FROM node:12-alpine
RUN apk add --no-cache python g++ make
WORKDIR /src
COPY . .
RUN yarn install --production   
CMD ["yarn", "nodemon"]