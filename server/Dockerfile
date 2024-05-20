FROM node:20.13.1
WORKDIR /server
COPY . .
RUN npm install
ENV PORT="3500"
ENV DB_HOST="db-mtj3c.pub-cdb.ntruss.com" 
ENV DB_USER="gyulgyul" 
ENV DB_PORT="3306" 
ENV DB_NAME="gyuldb" 
ENV DB_PWD="gyul3475\!@" 
ENV DB_ACKEY="vGlQYU5Is12Oaj3V9Gva" 
ENV DB_SEKEY="Zx4YoJAQjRzDZffVtyEq9MsW3jRwtJrXyWscUizE" 
ENV DB_BUCKET="gyulstorage" 
EXPOSE 3500
CMD ["npm", "start"]
