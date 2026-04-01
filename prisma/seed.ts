import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.gameSettings.upsert({
    where: { id: "singleton" },
    create: { currentEra: "orta_cag" },
    update: { currentEra: "orta_cag" },
  });

  const legacy = await prisma.user.findUnique({ where: { username: "Kirk" } });
  if (legacy) {
    await prisma.city.deleteMany({ where: { userId: legacy.id } });
    await prisma.user.delete({ where: { id: legacy.id } });
  }

  const user = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      passwordHash,
      isAdmin: true,
      registrationCountry: "tr",
      title: "Yönetici",
      role: "Admin",
      nationName: "Türkiye",
      tribeName: "War of City",
      researchTier: 0,
      currentEra: "ilk_cag",
    },
    create: {
      username: "admin",
      passwordHash,
      isAdmin: true,
      registrationCountry: "tr",
      title: "Yönetici",
      role: "Admin",
      nationName: "Türkiye",
      tribeName: "War of City",
      researchTier: 0,
      currentEra: "ilk_cag",
    },
  });

  const baseBuildings = {
    townHallLevel: 8,
    lumberMillLevel: 7,
    ironMineLevel: 6,
    oilWellLevel: 6,
    farmLevel: 7,
    barracksLevel: 6,
  };

  const cities = [
    {
      name: "NewYork",
      coordX: 22,
      coordY: 3,
      coordZ: 3,
      wood: 165_593,
      iron: 120_000,
      oil: 80_000,
      food: 50_000,
      population: 250,
      popCap: 600,
      workersWood: 70,
      workersIron: 109,
      workersOil: 0,
      workersFood: 71,
      ...baseBuildings,
    },
    {
      name: "Washington",
      coordX: 22,
      coordY: 5,
      coordZ: 2,
      wood: 90_000,
      iron: 200_000,
      oil: 150_000,
      food: 60_000,
      population: 180,
      popCap: 550,
      workersWood: 50,
      workersIron: 60,
      workersOil: 20,
      workersFood: 50,
      ...baseBuildings,
    },
    {
      name: "dallas",
      coordX: 22,
      coordY: 3,
      coordZ: 2,
      wood: 70_000,
      iron: 95_000,
      oil: 110_000,
      food: 45_000,
      population: 200,
      popCap: 580,
      workersWood: 40,
      workersIron: 40,
      workersOil: 10,
      workersFood: 90,
      ...baseBuildings,
    },
    {
      name: "LosAngeles",
      coordX: 22,
      coordY: 4,
      coordZ: 3,
      wood: 100_000,
      iron: 88_000,
      oil: 200_000,
      food: 70_000,
      population: 300,
      popCap: 700,
      workersWood: 80,
      workersIron: 50,
      workersOil: 30,
      workersFood: 100,
      ...baseBuildings,
    },
  ];

  await prisma.city.deleteMany({ where: { userId: user.id } });

  for (const c of cities) {
    await prisma.city.create({
      data: { ...c, userId: user.id },
    });
  }

  const botPw = await bcrypt.hash("bot123", 10);

  const bots: {
    username: string;
    tribeName: string;
    currentEra: string;
    researchTier: number;
    city: {
      name: string;
      coordX: number;
      coordY: number;
      coordZ: number;
      soldiers: number;
    };
  }[] = [
    {
      username: "rakip_kuzey",
      tribeName: "Kuzey İttifakı",
      currentEra: "orta_cag",
      researchTier: 4,
      city: {
        name: "Frostheim",
        coordX: 8,
        coordY: 18,
        coordZ: 2,
        soldiers: 400,
      },
    },
    {
      username: "rakip_guney",
      tribeName: "Güney Kolonileri",
      currentEra: "yeniden_dogus",
      researchTier: 5,
      city: {
        name: "Sandspire",
        coordX: 35,
        coordY: 6,
        coordZ: 4,
        soldiers: 600,
      },
    },
  ];

  for (const b of bots) {
    const u = await prisma.user.upsert({
      where: { username: b.username },
      update: {
        tribeName: b.tribeName,
        currentEra: b.currentEra,
        researchTier: b.researchTier,
      },
      create: {
        username: b.username,
        passwordHash: botPw,
        registrationCountry: "tr",
        tribeName: b.tribeName,
        nationName: "Bot Nation",
        title: "General",
        role: "Player",
        currentEra: b.currentEra,
        researchTier: b.researchTier,
      },
    });
    await prisma.city.deleteMany({ where: { userId: u.id } });
    await prisma.city.create({
      data: {
        name: b.city.name,
        userId: u.id,
        coordX: b.city.coordX,
        coordY: b.city.coordY,
        coordZ: b.city.coordZ,
        wood: 40_000,
        iron: 30_000,
        oil: 15_000,
        food: 25_000,
        population: 200,
        popCap: 500,
        workersWood: 40,
        workersIron: 40,
        workersOil: 10,
        workersFood: 50,
        townHallLevel: 6,
        lumberMillLevel: 5,
        ironMineLevel: 5,
        oilWellLevel: 4,
        farmLevel: 5,
        barracksLevel: 5,
        soldiers: b.city.soldiers,
        lastResourceTick: new Date(),
      },
    });
  }

  console.log(
    "Seed OK: admin (yönetici) şifre =",
    adminPassword,
    "+",
    cities.length,
    "şehir +",
    bots.length,
    "bot oyuncu (şifre bot123)",
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
