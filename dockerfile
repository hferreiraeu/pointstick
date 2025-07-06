
# Use Node 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

# Build the TypeScript code and generate Prisma client
RUN npm run build && npx prisma generate

# Start the bot
CMD ["node", "dist/index.js"]