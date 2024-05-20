FROM node:20.13.1
WORKDIR /server
COPY . ./package*.json
RUN npm install
COPY . .
EXPOSE 3500
CMD ["npm", "run" "deploy"]
