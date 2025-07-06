# Use a Debian-based Node image (NOT Alpine)
FROM node:20-slim

# Install OpenSSL 1.1 for Prisma
RUN apt-get update && apt-get install -y openssl && apt-get clean

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript and Prisma client
RUN npm run build && npx prisma generate

# Start the bot
CMD ["node", "dist/index.js"]