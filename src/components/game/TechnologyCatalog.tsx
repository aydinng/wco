import { EraTechResearchRow } from "@/components/game/EraTechResearchRow";
import { TECH_CATALOG } from "@/config/technology-catalog";
import type { TechCatalogEntry } from "@/config/technology-catalog";
import { ERA_ORDER, getEraConfig, getEraDisplayName } from "@/config/eras";
import type { Dictionary } from "@/i18n/dictionaries";
import type { AppLocale } from "@/lib/locale";

type Props = {
  locale: AppLocale;
  play: Dictionary["play"];
  researchJobEndsAtIso?: string | null;
  currentEra: string;
  defaultCityId: string;
  eraTechLevels: Record<string, number>;
  activeEraTechJob: { techKey: string; completesAt: string } | null;
};

function groupByEra(
  rows: TechCatalogEntry[],
  locale: AppLocale,
): { eraOrdinal: number; eraName: string; items: TechCatalogEntry[] }[] {
  const sections: {
    eraOrdinal: number;
    eraName: string;
    items: TechCatalogEntry[];
  }[] = [];

  for (const t of rows) {
    const eraId = ERA_ORDER[t.eraOrdinal - 1];
    const eraName = eraId
      ? getEraDisplayName(getEraConfig(eraId), locale)
      : locale === "en"
        ? `Age ${t.eraOrdinal}`
        : `${t.eraOrdinal}. Çağ`;
    const last = sections[sections.length - 1];
    if (!last || last.eraOrdinal !== t.eraOrdinal) {
      sections.push({ eraOrdinal: t.eraOrdinal, eraName, items: [t] });
    } else {
      last.items.push(t);
    }
  }
  return sections;
}

export function TechnologyCatalog({
  locale,
  play,
  researchJobEndsAtIso,
  currentEra,
  defaultCityId,
  eraTechLevels,
  activeEraTechJob,
}: Props) {
  const researchBusy =
    researchJobEndsAtIso &&
    new Date(researchJobEndsAtIso).getTime() > Date.now();

  const sections = groupByEra(TECH_CATALOG, locale);

  return (
    <div
      id="tech-catalog"
      className="w-full overflow-hidden rounded-lg border border-zinc-700/70"
    >
      <div
        className="border-b border-zinc-700/60 bg-black/30 px-3 py-2"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        <h3 className="text-center text-base font-semibold text-amber-200/90">
          {play.techCatalogTitle}
        </h3>
        {researchBusy && (
          <p className="mt-1 text-center text-xs font-medium text-amber-300/95">
            {locale === "en"
              ? "Empire research in progress — tier advances on schedule."
              : "İmparatorluk araştırması sürüyor — seviye süreyle ilerler."}
          </p>
        )}
      </div>

      <div className="w-full">
        {sections.map((sec) => (
          <div key={sec.eraOrdinal}>
            <div className="mb-0 w-full rounded-none bg-red-800 px-3 py-2 text-center shadow-inner">
              <span className="text-sm font-bold tracking-wide text-white">
                {sec.eraName}
              </span>
            </div>
            <div>
              {sec.items.map((entry) => (
                <EraTechResearchRow
                  key={entry.id}
                  entry={entry}
                  locale={locale}
                  play={play}
                  playerEra={currentEra}
                  cityId={defaultCityId}
                  level={eraTechLevels[entry.id] ?? 0}
                  activeJob={activeEraTechJob}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
