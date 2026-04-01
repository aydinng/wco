-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentEra" TEXT NOT NULL DEFAULT 'ilk_cag',
ADD COLUMN     "nationName" TEXT NOT NULL DEFAULT 'United States of America',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Player',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "tribeName" TEXT NOT NULL DEFAULT 'Americans';

-- CreateTable
CREATE TABLE "Fleet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromCityId" TEXT NOT NULL,
    "toCoordX" INTEGER NOT NULL,
    "toCoordY" INTEGER NOT NULL,
    "toCoordZ" INTEGER NOT NULL,
    "departAt" TIMESTAMP(3) NOT NULL,
    "arriveAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'traveling',
    "attackPower" INTEGER NOT NULL DEFAULT 0,
    "defensePower" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fleetId" TEXT NOT NULL,
    "attackerUserId" TEXT NOT NULL,
    "defenderCoord" TEXT NOT NULL,
    "attackerTotal" INTEGER NOT NULL,
    "defenderTotal" INTEGER NOT NULL,
    "outcome" TEXT NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "BattleReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Fleet_userId_idx" ON "Fleet"("userId");

-- CreateIndex
CREATE INDEX "Fleet_fromCityId_idx" ON "Fleet"("fromCityId");

-- CreateIndex
CREATE INDEX "Fleet_arriveAt_idx" ON "Fleet"("arriveAt");

-- CreateIndex
CREATE UNIQUE INDEX "BattleReport_fleetId_key" ON "BattleReport"("fleetId");

-- CreateIndex
CREATE INDEX "BattleReport_attackerUserId_idx" ON "BattleReport"("attackerUserId");

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_fromCityId_fkey" FOREIGN KEY ("fromCityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleReport" ADD CONSTRAINT "BattleReport_fleetId_fkey" FOREIGN KEY ("fleetId") REFERENCES "Fleet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleReport" ADD CONSTRAINT "BattleReport_attackerUserId_fkey" FOREIGN KEY ("attackerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
