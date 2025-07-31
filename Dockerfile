#Base image
FROM node:18-alpine

#Set working directory
WORKDIR /app

#Copy package.json and install dependencies
COPY package*.json ./

#Install dependencies
RUN npm install

#Copy the rest of the application code
COPY . .

#Build the application (Next.js sẽ tạo ra thư mục .next chứa các file build)
RUN npm run build

#Expose port 3000
EXPOSE 3000

#Start the application
CMD ["npm", "start"]