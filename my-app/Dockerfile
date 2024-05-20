FROM node:20.13.1
WORKDIR /my-app
COPY package*.json ./
RUN npm install
COPY . /my-app
EXPOSE 3000
CMD ["npm", "start"]
