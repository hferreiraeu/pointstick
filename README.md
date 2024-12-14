# Discord Bot Setup

This guide explains how to set up the Discord bot locally on your machine.

## Prerequisites

Before starting, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/) (for cloning the repository)
- SQLite (for the database, installed automatically by Prisma)

---

## Steps to Set Up the Bot

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-folder>

2. **Install Dependencies Use npm to install all required dependencies:**
    ```bash
    npm install

3. **Set Up the Database Initialize the database using Prisma:**
    ```bash
    npx prisma migrate dev --name init

4. **Create a .env File Add a .env file in the root directory with the following content:**
   ```code
   DISCORD_BOT_TOKEN=your-bot-token-here
  Replace your-bot-token-here with your actual Discord bot token from the Discord Developer Portal.

6. **Compile the TypeScript Code Convert the TypeScript source files into JavaScript:**
   ```bash
   npx tsc
   node dist/index.js
