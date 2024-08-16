# Use the official Node.js image.
FROM node:18

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and package-lock.json.
COPY package.json package-lock.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Build the frontend application.
RUN npm run build

# Serve the frontend application.
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose the port the app runs on.
EXPOSE 3000
