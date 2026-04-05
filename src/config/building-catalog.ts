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
      buildingId: "townHall",
      titleTr: "Köy Meydanı",
      titleEn: "Village square",
      descTr:
        "Yerleşimin yönetim ve nüfus merkezi. Nüfus tavanını büyütür; diğer yapılar için temel oluşturur.",
      descEn:
        "Your settlement’s civic and population hub. Raises population cap and anchors growth.",
    },
    {
      buildingId: "lumberMill",
      titleTr: "Taş Ocağı",
      titleEn: "Stone quarry",
      descTr:
        "Taş ve odun hammaddesini çıkarır; işçi başına üretim seviye ile artar.",
      descEn:
        "Extracts stone and timber; output per worker rises with level.",
    },
    {
      buildingId: "farm",
      titleTr: "Avcı Kulübesi",
      titleEn: "Hunter’s lodge",
      descTr:
        "Av ve toplayıcılıkla besin sağlar; nüfus ve ordunun gıda ihtiyacını karşılar.",
      descEn:
        "Provides food through hunting and gathering for your people and armies.",
    },
    {
      buildingId: "barracks",
      titleTr: "Kışla",
      titleEn: "Barracks",
      descTr:
        "Asker eğitir ve garnizon kapasitesini belirler. Seviye arttıkça üst asker limiti artar.",
      descEn:
        "Trains troops and sets garrison capacity. Higher levels raise soldier caps.",
    },
    {
      buildingId: "researchLodge",
      titleTr: "Araştırma kulübesi",
      titleEn: "Research lodge",
      descTr:
        "İmparatorluk teknoloji araştırmasını hızlandırır; teknoloji bulmaya ve araştırma sürelerini kısaltmaya yarar.",
      descEn:
        "Speeds empire technology research; helps discover tech and shorten research times.",
    },
    {
      buildingId: "shepherdLodge",
      titleTr: "Çoban kulübesi",
      titleEn: "Shepherd lodge",
      descTr:
        "Hayvancılık: besin üretimine ek olarak işçi başına dakikada +0,1 besin (saatlik üretimde işlenir).",
      descEn:
        "Extra +0.1 food per worker per minute (applied in hourly production).",
    },
    {
      buildingId: "civilLodge",
      titleTr: "Sivil kulübesi",
      titleEn: "Civil lodge",
      descTr:
        "Nüfus yönetimi: seviye başına +10 nüfus limiti.",
      descEn:
        "+10 population cap per level.",
    },
  ],
  orta_cag: [
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
