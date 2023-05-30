FROM arm32v7/node:lts-slim

WORKDIR /usr/app

COPY ./package.json ./

COPY ./package-lock.json ./

COPY . .

RUN npm install -g npm

RUN npm ci

EXPOSE 3333

CMD ["npm", "run", "start"]
