/*
  Warnings:

  - You are about to drop the column `workers` on the `City` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "City" DROP COLUMN "workers",
ADD COLUMN     "coordX" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "coordY" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "coordZ" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workersFood" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workersIron" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workersOil" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workersWood" INTEGER NOT NULL DEFAULT 0;
