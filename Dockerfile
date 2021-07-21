FROM node:14

WORKDIR /app

COPY . .

RUN npm install

EXPOSE $PORT

CMD ["npm", "run","start"]