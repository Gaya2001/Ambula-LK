# Base image
FROM node:18-alpine

# Set working directory 
WORKDIR /app

# Copy package files 
COPY package*.json ./

# Install dependencies 
RUN npm install
RUN npm install axios


# Copy source code
COPY . .

# Expose port
EXPOSE 5002

# Start service
CMD ["npm", "start"]