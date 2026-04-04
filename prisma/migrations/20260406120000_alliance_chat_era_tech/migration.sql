-- CreateTable
CREATE TABLE "AllianceMessage" (
    "id" TEXT NOT NULL,
    "allianceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "body" VARCHAR(2000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllianceMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceInvite" (
    "id" TEXT NOT NULL,
    "allianceId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllianceInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEraTech" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "techKey" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserEraTech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EraTechResearchJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "techKey" TEXT NOT NULL,
    "durationSec" INTEGER NOT NULL,
    "completesAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',

    CONSTRAINT "EraTechResearchJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AllianceMessage_allianceId_createdAt_idx" ON "AllianceMessage"("allianceId", "createdAt");

-- CreateIndex
CREATE INDEX "AllianceInvite_toUserId_status_idx" ON "AllianceInvite"("toUserId", "status");

-- CreateIndex
CREATE INDEX "AllianceInvite_allianceId_idx" ON "AllianceInvite"("allianceId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEraTech_userId_techKey_key" ON "UserEraTech"("userId", "techKey");

-- CreateIndex
CREATE INDEX "UserEraTech_userId_idx" ON "UserEraTech"("userId");

-- CreateIndex
CREATE INDEX "EraTechResearchJob_userId_status_idx" ON "EraTechResearchJob"("userId", "status");

-- CreateIndex
CREATE INDEX "EraTechResearchJob_completesAt_idx" ON "EraTechResearchJob"("completesAt");

-- AddForeignKey
ALTER TABLE "AllianceMessage" ADD CONSTRAINT "AllianceMessage_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceMessage" ADD CONSTRAINT "AllianceMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceInvite" ADD CONSTRAINT "AllianceInvite_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceInvite" ADD CONSTRAINT "AllianceInvite_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceInvite" ADD CONSTRAINT "AllianceInvite_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEraTech" ADD CONSTRAINT "UserEraTech_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EraTechResearchJob" ADD CONSTRAINT "EraTechResearchJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EraTechResearchJob" ADD CONSTRAINT "EraTechResearchJob_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
