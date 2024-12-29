# Stage 1: Build the application
FROM node:22-slim AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Run the application
FROM ghcr.io/puppeteer/puppeteer:23 AS runtime

# Set working directory
WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]