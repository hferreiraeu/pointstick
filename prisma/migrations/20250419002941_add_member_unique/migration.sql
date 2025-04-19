/*
  Warnings:

  - A unique constraint covering the columns `[leaderboardId,discordId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Member_leaderboardId_discordId_key" ON "Member"("leaderboardId", "discordId");
