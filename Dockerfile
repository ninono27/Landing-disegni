# Build stage
# Use Alpine-based Node.js image for a smaller footprint
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /app

COPY package*.json ./
# Install only production dependencies
RUN npm install --only=production

# Production stage
# Start a new stage from a minimal Alpine-based Node.js image
FROM node:18-alpine

# Add Tini for proper init process
# - Tini reaps zombie processes.
# - Signals are properly forwarded to the main process.
RUN apk add --no-cache tini
# Set Tini as the entry point
ENTRYPOINT ["/sbin/tini", "--"]

# Set the working directory for the production image
WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy node_modules from build stage
COPY --from=build /app/node_modules ./node_modules
# Copy application files
COPY . .

# Switch to non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
