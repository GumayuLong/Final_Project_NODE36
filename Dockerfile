FROM node:16

WORKDIR /Users/thanhlong/Documents/NodeJS-36/be_final_project

COPY package*.json yarn.lock ./

RUN yarn install

RUN yarn add prisma @prisma/client

# RUN yarn cache clean --force

COPY prisma ./prisma/

RUN yarn prisma generate

COPY . .

EXPOSE 8080

CMD [ "yarn", "start:dev" ]
# docker build --tag airbnb-docker . 