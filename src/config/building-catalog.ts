import type { BuildingId } from "@/app/actions/game-city";
import type { EraId } from "@/config/eras";

/** Katalog satırı: aynı buildingId farklı çağlarda farklı WarCity tarzı isimle tekrar edebilir. */
export type EraBuildingRow = {
  buildingId: BuildingId;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
};

export const ERA_BUILDING_CATALOG: Record<EraId, EraBuildingRow[]> = {
  ilk_cag: [
    {
      buildingId: "lumberMill",
      titleTr: "Oduncu kulübesi",
      titleEn: "Lumberjack lodge",
      descTr:
        "Odun üretimi: işçi başına taban üretim + seviye başına dakikada +0,1 odun (saatlik hesapta).",
      descEn:
        "Wood: base worker output plus +0.1 wood per minute per building level (applied hourly).",
    },
    {
      buildingId: "barracks",
      titleTr: "Kışla",
      titleEn: "Barracks",
      descTr:
        "Asker eğitmek için gereklidir. Kışla olmadan asker üretilemez. Garnizon kapasitesini yükseltir.",
      descEn:
        "Required to train soldiers. No training without barracks. Raises garrison capacity.",
    },
    {
      buildingId: "researchLodge",
      titleTr: "Araştırma kulübesi",
      titleEn: "Research lodge",
      descTr:
        "İmparatorluk teknolojisi ve çağ araştırması için gereklidir; kulübe olmadan araştırma yapılamaz.",
      descEn:
        "Required for empire and era technology research; no research without this building.",
    },
    {
      buildingId: "shepherdLodge",
      titleTr: "Çoban kulübesi",
      titleEn: "Shepherd lodge",
      descTr:
        "Seviye başına dakikada +0,1 besin üretim katkısı (saatlik hesapta).",
      descEn:
        "+0.1 food per minute per level (applied to hourly production).",
    },
    {
      buildingId: "civilLodge",
      titleTr: "Sivil kulübesi",
      titleEn: "Civil lodge",
      descTr:
        "Her yükseltmede şehir nüfusuna +10; üst sınır da seviye başına artar.",
      descEn:
        "+10 city population per upgrade; cap also rises per level.",
    },
  ],
  orta_cag: [
    {
      buildingId: "townHall",
      titleTr: "Belediye",
      titleEn: "Town hall",
      descTr:
        "Yönetim merkezi ve nüfus tavanı; seviye başına nüfus limitini güçlendirir.",
      descEn:
        "Civic hub and population cap; strengthens per-level pop limits.",
    },
    {
      buildingId: "farm",
      titleTr: "Tarla",
      titleEn: "Farm",
      descTr:
        "Besin üretimi; işçi ve seviye ile çarpanlı tarım çıktısı.",
      descEn:
        "Food production; scales with workers and building level.",
    },
    {
      buildingId: "lumberMill",
      titleTr: "Orman işletmesi",
      titleEn: "Timber yard",
      descTr:
        "Odun üretimini genişletir; oduncu bonusları devam eder.",
      descEn:
        "Expands timber output; lumber lodge bonuses continue.",
    },
    {
      buildingId: "ironMine",
      titleTr: "Demir madeni",
      titleEn: "Iron mine",
      descTr:
        "Demir cevheri çıkarır. Orta Çağ ve sonrasında kullanılabilir; ordular ve ileri binalar için gereklidir.",
      descEn:
        "Mines iron ore. Available from the Medieval age onward; needed for armies and advanced structures.",
    },
    {
      buildingId: "bank",
      titleTr: "Banka",
      titleEn: "Bank",
      descTr:
        "Yatırım ve pazar: markette asker ilanı verebilmek için gereklidir.",
      descEn:
        "Investment hub; required to list soldiers on the market.",
    },
    {
      buildingId: "policeDept",
      titleTr: "Polis departmanı",
      titleEn: "Police department",
      descTr:
        "Düzen ve koruma: bankayı destekler; şehirdeki hammaddenin çok küçük bir kısmını saldırılara karşı korur (savunma bonusu, MVP).",
      descEn:
        "Supports the bank; slightly improves defense against raids (MVP).",
    },
  ],
  yeniden_dogus: [],
  sanayi: [
    {
      buildingId: "lumberMill",
      titleTr: "Yeraltı ormanı",
      titleEn: "Underground forest",
      descTr:
        "Yeraltı ağaçlık üretimi; odunu korunaklı ortamda büyütür (odun üretimi).",
      descEn:
        "Subterranean timber production; grows wood in a protected environment.",
    },
    {
      buildingId: "farm",
      titleTr: "Yeraltı tarlası",
      titleEn: "Underground field",
      descTr:
        "Kapalı sistem tarlaları; besin arzını şehir altında sürdürür.",
      descEn:
        "Closed-field agriculture beneath the city for steady food supply.",
    },
    {
      buildingId: "townHall",
      titleTr: "Kapalı yaşam birimi",
      titleEn: "Closed living unit",
      descTr:
        "Hava baskılı yaşam kuleleri; nüfus ve yönetim merkezi olarak merkez binası rolünde.",
      descEn:
        "Pressurized living towers; acts as your civic core and population anchor.",
    },
    {
      buildingId: "barracks",
      titleTr: "Askeri kule",
      titleEn: "Military tower",
      descTr:
        "Yüksek garnizon kulesi; savunma ve asker eğitim kapasitesini artırır.",
      descEn:
        "High garrison tower; boosts defense and training capacity.",
    },
    {
      buildingId: "oilWell",
      titleTr: "Rafineri",
      titleEn: "Refinery",
      descTr:
        "Ham petrolü işleyen tesis; petrol çıktısı ve yakıt verimliliği.",
      descEn:
        "Refines crude oil for higher petroleum output and fuel efficiency.",
    },
    {
      buildingId: "ironMine",
      titleTr: "Büyük fırın",
      titleEn: "Large furnace",
      descTr:
        "Endüstriyel fırın ve metalurji; demir üretimini ve işlemeyi güçlendirir.",
      descEn:
        "Industrial furnace and metallurgy; strengthens iron output.",
    },
  ],
  dijital: [],
  kuresel_isinma: [],
  modern: [
    {
      buildingId: "lumberMill",
      titleTr: "Biyo-senkron orman",
      titleEn: "Bio-sync forest",
      descTr:
        "Genetik optimize odun üretimi; sürdürülebilir yüksek verim.",
      descEn:
        "Genetically tuned timber for sustainable peak wood output.",
    },
    {
      buildingId: "farm",
      titleTr: "Nano-sera",
      titleEn: "Nano greenhouse",
      descTr:
        "Nanobot destekli besin üretimi; minimum alan, maksimum gıda.",
      descEn:
        "Nanobot-assisted food production; minimum footprint, maximum yield.",
    },
    {
      buildingId: "oilWell",
      titleTr: "Plazma sentez",
      titleEn: "Plasma synthesis",
      descTr:
        "Sentetik yakıt ve petrol ikamesi; gezegen ölçeği enerji.",
      descEn:
        "Synthetic fuel stack; planetary-scale energy substitute for oil.",
    },
    {
      buildingId: "barracks",
      titleTr: "Drone garnizon",
      titleEn: "Drone garrison",
      descTr:
        "Otonom savunma ve eğitim; modern ordu üst sınırı.",
      descEn:
        "Autonomous defense and training; modern army capacity.",
    },
  ],
};
