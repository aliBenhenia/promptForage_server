# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY . .

# Expose the development port
EXPOSE 3000

# Start in development mode
CMD ["npm", "run", "dev"]
