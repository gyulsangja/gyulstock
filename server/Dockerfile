FROM node:20.13.1
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . /server
EXPOSE 3500
CMD ["node", "server.js"]
