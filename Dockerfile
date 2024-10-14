# Stage 1: Build the Vue.js application
FROM node:22 AS build

# Set work directory 
WORKDIR /app

# Copy essential files first for better caching
COPY package*.json /app/

# Install dependencies 
RUN npm install

# Copy the rest of the application code
COPY . /app

# Build the Vue app
RUN npm run build

# Stage 2: Serve the built Vue.js application with nginx
FROM nginx:alpine

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy the built Vue app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
