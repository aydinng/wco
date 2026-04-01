import { countryLabelById, REGISTRATION_COUNTRIES } from "@/config/countries";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const COUNTRY_IDS = new Set<string>(
  REGISTRATION_COUNTRIES.map((c) => c.id),
);

const RESERVED_USERNAMES = new Set(
  ["admin", "administrator", "root", "system", "moderator", "mod"].map((s) =>
    s.toLowerCase(),
  ),
);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      username?: string;
      password?: string;
      countryId?: string;
    };
    const username = body.username?.trim();
    const password = body.password;
    const countryId = body.countryId?.trim() ?? "";

    if (!username || !password) {
      return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
    }
    if (!countryId || !COUNTRY_IDS.has(countryId)) {
      return NextResponse.json({ error: "Geçersiz ülke" }, { status: 400 });
    }
    if (username.length < 2 || username.length > 32) {
      return NextResponse.json({ error: "Kullanıcı adı 2–32 karakter" }, { status: 400 });
    }
    if (RESERVED_USERNAMES.has(username.toLowerCase())) {
      return NextResponse.json(
        { error: "Bu kullanıcı adı ayrılmış" },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter" },
        { status: 400 },
      );
    }

    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) {
      return NextResponse.json({ error: "Bu kullanıcı adı alınmış" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const nationLabel = countryLabelById(countryId);

    await prisma.user.create({
      data: {
        username,
        passwordHash,
        isAdmin: false,
        registrationCountry: countryId,
        nationName: nationLabel,
        currentEra: "ilk_cag",
        cities: {
          create: {
            name: "Capital",
            coordX: 1,
            coordY: 1,
            coordZ: 1,
            wood: 5000,
            iron: 3000,
            oil: 2000,
            food: 4000,
            population: 100,
            popCap: 190,
            workersWood: 20,
            workersIron: 0,
            workersOil: 0,
            workersFood: 30,
            townHallLevel: 1,
            lumberMillLevel: 0,
            ironMineLevel: 0,
            oilWellLevel: 0,
            farmLevel: 0,
            barracksLevel: 0,
          },
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}
