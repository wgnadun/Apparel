#Dockerfile for the node server service
#define base image
FROM node:22

#Create working directory
WORKDIR /app

#copy the package.json file
COPY package.json .

#install node package manager to working directory
RUN npm install

#Copy all the files to the working directory
COPY . .

#Expose the port 
EXPOSE 5173

#run the server
CMD [ "npm","run","dev" ]