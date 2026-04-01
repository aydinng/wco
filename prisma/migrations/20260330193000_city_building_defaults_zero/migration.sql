-- Bina seviyeleri: 0 = inşa yok; yeni şehirler için varsayılan 0 (oyun mantığı).
ALTER TABLE "City" ALTER COLUMN "townHallLevel" SET DEFAULT 0;
ALTER TABLE "City" ALTER COLUMN "lumberMillLevel" SET DEFAULT 0;
ALTER TABLE "City" ALTER COLUMN "ironMineLevel" SET DEFAULT 0;
ALTER TABLE "City" ALTER COLUMN "oilWellLevel" SET DEFAULT 0;
ALTER TABLE "City" ALTER COLUMN "farmLevel" SET DEFAULT 0;
ALTER TABLE "City" ALTER COLUMN "barracksLevel" SET DEFAULT 0;
