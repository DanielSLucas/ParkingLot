FROM balenalib/raspberry-pi-alpine-node 

WORKDIR /usr/app

COPY ./package.json ./

COPY ./package-lock.json ./

# RUN npm install -g npm

# RUN npm ci

COPY . .

EXPOSE 3333

CMD ["npm", "run", "start"]
