import { PlaceholderPage } from "@/components/game/PlaceholderPage";
import { UNITS, getUnitSpec } from "@/config/units";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.play;
  const user = await getCurrentUser();
  if (!user) {
    return (
      <PlaceholderPage title={dict.game.fleet}>
        <p className="mt-2 text-sm text-zinc-500">{p.errLogin}</p>
      </PlaceholderPage>
    );
  }

  const cities = await prisma.city.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    include: { cityUnitStocks: true },
  });

  return (
    <PlaceholderPage title={dict.game.fleet}>
      <p className="mt-2 text-sm text-amber-200/80">
        {locale === "en"
          ? "This screen lists troops in your cities only. To send a fleet, use the World map page."
          : "Bu ekran yalnızca şehirlerdeki askerleri listeler. Filo göndermek için Dünya haritası sayfasını kullanın."}
      </p>
      <p className="mt-2 text-sm">
        <Link
          href="/worldmap"
          className="text-amber-300 underline hover:text-amber-100"
        >
          → {locale === "en" ? "World map — send fleet" : "Dünya haritası — filo gönder"}
        </Link>
      </p>

      <div className="mt-8 space-y-8">
        {cities.map((c) => (
          <div
            key={c.id}
            className="rounded border border-[#2a3441]/80 bg-black/25 p-4"
          >
            <h3
              className="mb-3 text-base text-amber-200/90"
              style={{ fontFamily: "var(--font-warcity), serif" }}
            >
              {c.name}{" "}
              <span className="text-xs font-normal text-zinc-500">
                {c.coordX}:{c.coordY}:{c.coordZ}
              </span>
            </h3>
            <div className="space-y-3">
              {c.cityUnitStocks.filter((s) => s.quantity > 0).length === 0 ? (
                <p className="text-sm text-zinc-500">
                  {locale === "en"
                    ? "No unit stocks recorded (train troops in Production)."
                    : "Kayıtlı birim yok (Üretimden asker eğitin)."}
                </p>
              ) : (
                c.cityUnitStocks
                  .filter((s) => s.quantity > 0)
                  .map((s) => {
                    const spec = getUnitSpec(s.unitId);
                    return (
                      <div
                        key={s.unitId}
                        className="flex flex-wrap items-center gap-3 rounded border border-zinc-700/50 bg-black/30 px-3 py-2"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-zinc-600">
                          <Image
                            src={spec?.imageSrc ?? "/units/unit-strip.svg"}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-amber-100">
                            {spec?.name ?? s.unitId}
                          </div>
                          <div className="tabular-nums text-lg text-[#FFFF00]">
                            ×{s.quantity.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
              {c.soldiers > 0 &&
              c.cityUnitStocks.reduce((a, x) => a + x.quantity, 0) <
                c.soldiers ? (
                <p className="text-xs text-zinc-500">
                  {locale === "en"
                    ? "Some soldiers are not yet split by unit type; they will appear after training completes."
                    : "Bazı askerler henüz birime bölünmemiş olabilir; üretim tamamlandıkça görünür."}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-xs text-zinc-600">
        {locale === "en" ? "Unit catalog:" : "Birim kataloğu:"}{" "}
        {UNITS.length} {locale === "en" ? "types" : "tür"}
      </div>
    </PlaceholderPage>
  );
}
