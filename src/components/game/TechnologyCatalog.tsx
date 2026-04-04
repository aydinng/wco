import { EraTechResearchRow } from "@/components/game/EraTechResearchRow";
import { TECH_CATALOG } from "@/config/technology-catalog";
import type { TechCatalogEntry } from "@/config/technology-catalog";
import {
  ERA_ORDER,
  eraBackgroundUrl,
  eraOrdinalNumber,
  getEraConfig,
  getEraDisplayName,
} from "@/config/eras";
import type { Dictionary } from "@/i18n/dictionaries";
import type { AppLocale } from "@/lib/locale";
import Image from "next/image";

const MAX_ERA_TECH_QUEUE = 2;

type Props = {
  locale: AppLocale;
  play: Dictionary["play"];
  currentEra: string;
  defaultCityId: string;
  eraTechLevels: Record<string, number>;
  activeEraTechJobs: { techKey: string; completesAt: string }[];
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
  currentEra,
  defaultCityId,
  eraTechLevels,
  activeEraTechJobs,
}: Props) {
  const sections = groupByEra(TECH_CATALOG, locale);

  return (
    <div
      id="tech-catalog"
      className="w-full overflow-hidden rounded-lg border border-zinc-700/70"
    >
      <div className="w-full">
        {sections.map((sec) => {
          const eraId = ERA_ORDER[sec.eraOrdinal - 1];
          const cfg = eraId ? getEraConfig(eraId) : null;
          const bg = eraId ? eraBackgroundUrl(eraId) : null;
          const ordinal = eraId ? eraOrdinalNumber(eraId) : sec.eraOrdinal;
          return (
          <div key={sec.eraOrdinal}>
            {cfg && bg ? (
              <div
                className="relative mb-0 w-full overflow-hidden rounded-none border-b-2 shadow-lg"
                style={{
                  borderColor: cfg.banner.borderColor,
                  boxShadow: `0 0 18px ${cfg.banner.glow}`,
                }}
              >
                <div className="relative h-20 w-full sm:h-24">
                  <Image
                    src={bg}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                  <div className="absolute bottom-1.5 left-2 right-2 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      {locale === "en" ? `Age ${ordinal}` : `Çağ ${ordinal}`}
                    </p>
                    <p className="text-[11px] font-bold leading-tight text-white drop-shadow-md">
                      {sec.eraName}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-0 w-full rounded-none bg-red-800 px-3 py-2 text-center shadow-inner">
                <span className="text-sm font-bold tracking-wide text-white">
                  {sec.eraName}
                </span>
              </div>
            )}
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
                  activeJobs={activeEraTechJobs}
                  maxQueue={MAX_ERA_TECH_QUEUE}
                />
              ))}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
