import { CatalogFieldLine, CatalogGameRow } from "@/components/game/CatalogGameRow";
import { TECH_CATALOG } from "@/config/technology-catalog";
import type { AppLocale } from "@/lib/locale";
import type { Dictionary } from "@/i18n/dictionaries";

type Props = {
  locale: AppLocale;
  play: Dictionary["play"];
  /** İmparatorluk araştırması devam ediyorsa ISO bitiş zamanı */
  researchJobEndsAtIso?: string | null;
};

export function TechnologyCatalog({
  locale,
  play,
  researchJobEndsAtIso,
}: Props) {
  const rows = [...TECH_CATALOG].sort((a, b) => {
    if (a.eraOrdinal !== b.eraOrdinal) return a.eraOrdinal - b.eraOrdinal;
    return a.tier - b.tier;
  });

  const researchBusy =
    researchJobEndsAtIso &&
    new Date(researchJobEndsAtIso).getTime() > Date.now();

  return (
    <div
      id="tech-catalog"
      className="w-full overflow-hidden rounded-lg border border-zinc-700/70"
    >
      <div
        className="border-b border-zinc-700/60 bg-black/30 px-3 py-2"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        <h3 className="text-base font-semibold text-amber-200/90">
          {play.techCatalogTitle}
        </h3>
        {researchBusy && (
          <p className="mt-1 text-xs font-medium text-amber-300/95">
            {locale === "en"
              ? "Empire research in progress — technologies unlock as your tier advances."
              : "İmparatorluk araştırması sürüyor — teknolojiler seviye geldikçe açılır."}
          </p>
        )}
      </div>
      <div className="w-full">
        {rows.map((t, i) => {
          const name = locale === "en" ? t.nameEn : t.nameTr;
          const dur = locale === "en" ? t.durationEn : t.durationTr;
          const goal = locale === "en" ? t.goalEn : t.goalTr;
          const ageStr = String(t.eraOrdinal);
          return (
            <CatalogGameRow
              key={i}
              imageSrc={t.imageSrc}
              title={name}
              fullWidth
              hideAction
              middleStack
              actionLabel=""
              actionHref="#"
              middle={
                <>
                  <CatalogFieldLine
                    label={play.catalogFieldTime}
                    value={dur}
                  />
                  <CatalogFieldLine
                    label={play.catalogFieldAge}
                    value={ageStr}
                  />
                  {t.tier > 0 ? (
                    <CatalogFieldLine
                      label={play.catalogFieldLevel}
                      value={String(t.tier)}
                    />
                  ) : null}
                  <CatalogFieldLine
                    label={play.catalogFieldPurpose}
                    value={goal}
                  />
                </>
              }
            />
          );
        })}
      </div>
    </div>
  );
}
