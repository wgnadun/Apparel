#Dockerfile for the node server service
#define base image
FROM node:22

#Globally install nodemon
RUN npm install -g nodemon

#Create working directory
WORKDIR /app

#Copy all the files to the working directory
COPY . .

#install node package manager to working directory
RUN npm install

#Expose the port 
EXPOSE 5000

#run the server
CMD [ "npm","run","dev" ]