# Use the official Node.js 18 image as a parent image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that your application listens on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]


