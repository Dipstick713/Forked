FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server with host flag to allow external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
