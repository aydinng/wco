import type { AppLocale } from "@/lib/locale";

export type Dictionary = {
  public: {
    account: string;
    guide: string;
    community: string;
    login: string;
    register: string;
    howToPlay: string;
    features: string;
    rules: string;
    forumSoon: string;
    faqSoon: string;
    recentTitle: string;
    recentHint: string;
    noRegistrations: string;
    countryLabel: string;
    /** Üst banner görseli (erişilebilirlik) */
    bannerAlt: string;
    /** Giriş sayfası alt kuşatma görseli */
    loginHeroAlt: string;
    loginHeroCaption: string;
    /** Klasik giriş sayfası (warofcity) */
    loginWelcome: string;
    loginIntroLine: string;
    loginNoticeTitle: string;
    loginNoticeItems: string[];
    loginStatRegistered: string;
    loginStatOnline: string;
    /** Son kayıt satırı: sarı metin + kullanıcı / süre / ülke beyaz */
    loginStatLastIntro: string;
    loginStatLastBetweenUserAndAgo: string;
    loginStatLastBetweenAgoAndCountry: string;
    loginStatLastEmpty: string;
    /** Üst sıralama tabloları başlıkları */
    loginTableTopCountriesTitle: string;
    loginTableTopPlayersTitle: string;
    /** {name} {country} — EN'de "from" için ayrı şablon */
    loginTablePlayerRow: string;
    /** Sol menü: dil kutusunun altındaki sunucu saati etiketi */
    loginServerClockLabel: string;
    loginColRank: string;
    loginColCountry: string;
    loginColPlayer: string;
    /** Klasik sol menü */
    navHome: string;
    /** Giriş ekranı (referans görsel) — üst başlık */
    loginWelcomeTitle: string;
    /** Sadece ana metin: 5 madde */
    loginBulletsFive: [string, string, string, string, string];
    loginNavLogin: string;
    loginNavRegister: string;
    loginNavAbout: string;
    loginNavTutorial: string;
    loginNavForum: string;
    loginNavManual: string;
    /** Üst yatay çubuk etiketleri */
    loginBarUser: string;
    loginBarPass: string;
    loginBarSubmit: string;
    /** Giriş: 1. paragraf; 2. satır kayıt CTA (beyaz buton) */
    loginIntroParagraph1: string;
    loginIntroParagraph2Before: string;
    loginIntroParagraph2After: string;
    loginIntroRegisterWord: string;
    /** Alt bilgi © yıl + web / mobil notu */
    loginFooterNotice: string;
    /** 4. madde: forum linki ortada */
    loginBullet4Before: string;
    loginBullet4LinkWord: string;
    loginBullet4After: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    username: string;
    password: string;
    signIn: string;
    signingIn: string;
    noAccount: string;
    registerCta: string;
    badCredentials: string;
    registerTitle: string;
    registerSubtitle: string;
    country: string;
    registerBtn: string;
    registering: string;
    hasAccount: string;
    signInCta: string;
    afterRegisterNote: string;
    errorGeneric: string;
    errorConnection: string;
  };
  howToPlay: {
    title: string;
    items: string[];
  };
  features: {
    title: string;
    items: string[];
  };
  rulesPage: {
    title: string;
    back: string;
    bullets: string[];
    note: string;
  };
  game: {
    bannerLeader: string;
    bannerTribe: string;
    bannerTitle: string;
    bannerRole: string;
    bannerServerTime: string;
    menuLeaderMenu: string;
    menuLeadership: string;
    menuGameMenu: string;
    labelRank: string;
    labelManager: string;
    labelTribe: string;
    rankLeaderValue: string;
    serverDate: string;
    menuUser: string;
    menuAdmin: string;
    adminPanel: string;
    eraWorld: string;
    logout: string;
    overview: string;
    resources: string;
    buildings: string;
    research: string;
    production: string;
    fleet: string;
    missions: string;
    diplomacy: string;
    worldmap: string;
    market: string;
    stats: string;
    messages: string;
    options: string;
    help: string;
    forum: string;
  };
  footer: {
    line1: string;
    rights: string;
  };
  lang: {
    label: string;
    tr: string;
    en: string;
  };
  /** Oyun içi ekran metinleri */
  play: {
    overviewTitle: string;
    dialogClose: string;
    cityDetailBack: string;
    cityDetailIntro: string;
    tableWorkingPop: string;
    overviewResearch: string;
    overviewBuildings: string;
    overviewProdHour: string;
    overviewNoSeed: string;
    resourcesTitle: string;
    resourcesStock: string;
    resourcesHourly: string;
    resourcesCity: string;
    buildingsTitle: string;
    buildingsCatalogHint: string;
    buildingsEraEmpty: string;
    buildingsEraTechOnly: string;
    adminBonusHint: string;
    techCatalogTitle: string;
    techCatalogHint: string;
    techCatalogColEra: string;
    techCatalogColTier: string;
    techCatalogColName: string;
    techCatalogColTime: string;
    techCatalogColGoal: string;
    catalogFieldTime: string;
    catalogFieldAge: string;
    catalogFieldLevel: string;
    catalogFieldPurpose: string;
    catalogBtnResearch: string;
    catalogBtnProduce: string;
    catalogBtnUpgrade: string;
    catalogNoDuration: string;
    catalogStatAttack: string;
    catalogStatDefense: string;
    catalogStatAgility: string;
    catalogStatSpeed: string;
    catalogStatCarry: string;
    catalogStatHp: string;
    catalogStatFood: string;
    bonusNone: string;
    bonusTownHall: string;
    bonusResource: string;
    bonusBarracks: string;
    buildingDescTownHall: string;
    buildingDescLumber: string;
    buildingDescIron: string;
    buildingDescOil: string;
    buildingDescFarm: string;
    buildingDescBarracks: string;
    buildFirst: string;
    levelNone: string;
    trainNeedBarracks: string;
    buildingTownHall: string;
    buildingLumber: string;
    buildingIron: string;
    buildingOil: string;
    buildingFarm: string;
    buildingBarracks: string;
    levelShort: string;
    upgrade: string;
    cost: string;
    workersTitle: string;
    saveWorkers: string;
    researchTitle: string;
    researchTier: string;
    researchPayFrom: string;
    researchBtn: string;
    researchExpl: string;
    productionTitle: string;
    soldiers: string;
    soldierCap: string;
    trainAmount: string;
    trainBtn: string;
    trainCost: string;
    fleetHint: string;
    resWood: string;
    resIron: string;
    resOil: string;
    resFood: string;
    overviewIdle: string;
    overviewFootnote: string;
    overviewSelectCity: string;
    overviewWorkersIn: string;
    overviewBuildingInProgress: string;
    overviewProductionInProgress: string;
    overviewResearchHeading: string;
    overviewResearchIdle: string;
    overviewNone: string;
    overviewTime: string;
    overviewIdleShownRed: string;
    tablePop: string;
    tableWorkers: string;
    fleetIntro: string;
    fleetReportsTitle: string;
    fleetNoReports: string;
    fleetSendBtn: string;
    fleetSending: string;
    fleetSentOk: string;
    fleetOutcomeWin: string;
    fleetOutcomeLoss: string;
    errMissingFields: string;
    errServer: string;
    fleetNoCity: string;
    fleetTargetX: string;
    fleetTargetY: string;
    fleetTargetZ: string;
    fleetAttack: string;
    fleetDefenseFleet: string;
    fleetDefenseTarget: string;
    fleetDepartCity: string;
    researchMax: string;
    errLogin: string;
    errCity: string;
    errUser: string;
    errWorkersOver: string;
    errBuildingMax: string;
    errInsufficient: string;
    errBarracksFull: string;
    errInvalidAmount: string;
    errBuildingLocked: string;
    errBuildBusy: string;
    errResearchMax: string;
    errResearchBusy: string;
    trainCostNoIron: string;
    worldmapTitle: string;
    worldmapIntro: string;
    worldmapNoTileMap: string;
    worldmapYourCities: string;
    worldmapCoord: string;
    worldmapFleetCta: string;
    worldmapNoCities: string;
    worldmapComingSoon: string;
    worldmapAllPlayers: string;
    worldmapLegendYou: string;
    worldmapLegendOther: string;
    worldmapPlaneHint: string;
    marketTitle: string;
    marketIntro: string;
    marketListSoldiers: string;
    marketFromCity: string;
    marketQty: string;
    marketPriceWood: string;
    marketPriceIron: string;
    marketPriceFood: string;
    marketSubmitList: string;
    marketBuy: string;
    marketReceiveCity: string;
    marketEmpty: string;
    marketSeller: string;
    marketTribe: string;
    marketOpensAt: string;
    marketTimerWait: string;
    marketTimerReady: string;
    foundCityTitle: string;
    foundCityExpl: string;
    foundCityLocked: string;
    foundCityName: string;
    foundCityPayFrom: string;
    foundCityCoordX: string;
    foundCityCoordY: string;
    foundCityCoordZ: string;
    foundCitySubmit: string;
    errFoundCityLocked: string;
    errMarketNotOpen: string;
    errMarketGone: string;
    errMarketSelf: string;
    marketDelayNote: string;
    marketSoldiersUnit: string;
    marketYourListing: string;
  };
};

const tr: Dictionary = {
  public: {
    account: "Hesap",
    guide: "Rehber",
    community: "Topluluk",
    login: "Oyuna Gir",
    register: "Kayıt ol",
    howToPlay: "Nasıl oynanır",
    features: "Oyun özellikleri",
    rules: "Kurallar",
    forumSoon: "Forum (yakında)",
    faqSoon: "Sık sorulanlar (yakında)",
    recentTitle: "Son kayıtlar",
    recentHint:
      "En yeni üstte. Seçilen ülke kayıt sırasında verilen bilgidir.",
    noRegistrations: "Henüz kayıt yok.",
    countryLabel: "Ülke",
    bannerAlt: "War of City — kuşatma ve strateji",
    loginHeroAlt: "Kuşatma ve kale — War of City",
    loginHeroCaption:
      "War of City: kaleler, ordular ve ittifaklar; tarayıcıda gerçek zamanlı strateji.",
    loginWelcome: "warofcity Oyununa Hoşgeldiniz",
    loginIntroLine:
      "Savaş ve strateji dünyasına hoş geldiniz. Kayıt olmak için tıklayın:",
    loginNoticeTitle: "Tüm oyuncuların dikkatine",
    loginNoticeItems: [
      "warofcity reklam içermez.",
      "Oyun ücretsizdir.",
      "Yeni özellikler oyuncu geri bildirimlerine göre eklenir.",
      "Forumumuza katılın.",
      "Oyunun adını yayın.",
      "Türkçe çevirisi geliştirilmeye devam etmektedir.",
    ],
    loginStatRegistered: "Toplamda {count} oyuncu kayıtlıdır.",
    loginStatOnline: "Şu anda {count} oyuncu çevrimiçi.",
    loginStatLastIntro: "Son kayıt: ",
    loginStatLastBetweenUserAndAgo: " — ",
    loginStatLastBetweenAgoAndCountry: " önce — kayıtta seçilen ülke: ",
    loginStatLastEmpty: "Henüz kayıtlı oyuncu yok.",
    loginTableTopCountriesTitle:
      "Şu an toplam skor bakımından ilk beş ülke:",
    loginTableTopPlayersTitle:
      "Şu an toplam skor bakımından ilk beş oyuncu:",
    loginTablePlayerRow: "{name} ({country})",
    loginServerClockLabel: "Sunucu zamanı",
    loginColRank: "Sıra",
    loginColCountry: "Ülke",
    loginColPlayer: "Oyuncu",
    navHome: "Ana Sayfa",
    loginWelcomeTitle: "War of City'ye Hoş Geldiniz",
    loginIntroParagraph1:
      "warofcity, tarayıcı üzerinden oynanan çok oyunculu bir strateji oyunudur.",
    loginIntroParagraph2Before:
      "Kullanıcı adı ve şifreniz yoksa, katılmak için ",
    loginIntroParagraph2After: ".",
    loginIntroRegisterWord: "kayıt olun",
    loginFooterNotice:
      "© {year} War of City. Web tarayıcılarında oynanmak üzere geliştirilmektedir. İleride iOS ve Android uygulamaları yayınlanacaktır.",
    loginBulletsFive: [
      "warofcity hiçbir reklam içermez ve içermeyecektir.",
      "warofcity oynamak ücretsizdir.",
      "Yeni özellikler oyuncu geri bildirimiyle durmaksızın eklenecektir.",
      "",
      "Haberi yayın, başkalarının da katılıp eğlenmesini sağlayın.",
    ],
    loginBullet4Before: "",
    loginBullet4LinkWord: "Forum",
    loginBullet4After: "umuza katılmayı unutmayın.",
    loginNavLogin: "Giriş",
    loginNavRegister: "Kayıt",
    loginNavAbout: "Hakkında",
    loginNavTutorial: "Eğitim",
    loginNavForum: "Forum",
    loginNavManual: "Kılavuz",
    loginBarUser: "Kullanıcı adı",
    loginBarPass: "Şifre",
    loginBarSubmit: "Giriş",
  },
  auth: {
    loginTitle: "Oyuncu girişi",
    loginSubtitle: "Hesabınla oyuna bağlan",
    username: "Kullanıcı adı",
    password: "Şifre",
    signIn: "Giriş yap",
    signingIn: "…",
    noAccount: "Hesabın yok mu?",
    registerCta: "Kayıt ol",
    badCredentials: "Kullanıcı adı veya şifre hatalı.",
    registerTitle: "Yeni hesap",
    registerSubtitle: "Ülke seçimi kayıt listesinde görünür",
    country: "Ülke",
    registerBtn: "Kayıt ol",
    registering: "…",
    hasAccount: "Zaten hesabın var mı?",
    signInCta: "Giriş",
    afterRegisterNote:
      "Kayıt olduktan sonra giriş sayfasından oyuna girebilirsin.",
    errorGeneric: "Kayıt olmadı",
    errorConnection: "Bağlantı hatası",
  },
  howToPlay: {
    title: "Nasıl oynanır?",
    items: [
      "Kayıt ol: kullanıcı adı, şifre ve ülke seç. Başlangıç şehrin oluşur.",
      "Giriş yap ve şehirlerini, kaynaklarını yönet.",
      "Binalar / araştırma / üretim ile ekonomini ve ordunu güçlendir (sayfalar genişletilecek).",
      "Fleet ile hedef koordinata ordu gönder; saldırı ve savunma toplamlarına göre rapor alırsın.",
      "İttifak / diplomasi / harita üzerinden diğer oyuncularla etkileş (geliştirme devam ediyor).",
    ],
  },
  features: {
    title: "Oyun özellikleri",
    items: [
      "Çoklu şehir ve kaynak ekonomisi (odun, demir, petrol, yiyecek)",
      "İşçi dağılımı, nüfus ve üretim kuyrukları",
      "Araştırma, bina ve birlik üretimi (genişletme devam ediyor)",
      "Filo ile hedefe süreli gönderim; saldırı / savunma raporları",
      "Çağlara göre değişen dünya görünümü",
    ],
  },
  rulesPage: {
    title: "Kurallar",
    back: "← Giriş sayfasına dön",
    bullets: [
      "Hesabın sana ait; başkasıyla paylaşma, bot veya hile kullanma.",
      "Diğer oyunculara saygılı ol; hakaret, spam ve dolandırıcılık yasaktır.",
      "Oyun dengesini bozan hataları yöneticiye bildir; kötüye kullanma.",
      "Birden fazla hesap kurallara aykırı olabilir (sunucu politikasına göre güncellenir).",
    ],
    note: "Bu metin şimdilik özetdir; ileride detaylı kullanım şartları eklenebilir.",
  },
  game: {
    bannerLeader: "Lider",
    bannerTribe: "Kabile",
    bannerTitle: "Unvan",
    bannerRole: "Rol",
    bannerServerTime: "Sunucu zamanı",
    menuLeaderMenu: "Lider Menüsü",
    menuLeadership: "Liderlik",
    menuGameMenu: "Oyun Menüsü",
    labelRank: "Rütbe",
    labelManager: "Yönetici",
    labelTribe: "Kabile",
    rankLeaderValue: "Leader",
    serverDate: "Sunucu tarihi",
    menuUser: "Kullanıcı menüsü",
    menuAdmin: "Yönetici",
    adminPanel: "Yönetim paneli",
    eraWorld: "Çağ (dünya)",
    logout: "Çıkış",
    overview: "Genel durum",
    resources: "Hammadde",
    buildings: "Binalar",
    research: "Teknoloji",
    production: "Asker üretimi",
    fleet: "Filo",
    missions: "Görevler",
    diplomacy: "Diplomasi",
    worldmap: "Dünya haritası",
    market: "Market",
    stats: "İstatistikler",
    messages: "Mesajlar",
    options: "Ayarlar",
    help: "Yardım",
    forum: "Forum",
  },
  footer: {
    line1:
      "War of City — tarayıcıda strateji ve kuşatma. Kendi görsellerin için public/banner ve public/landing klasörlerini kullanabilirsin.",
    rights: "Tüm hakları saklıdır.",
  },
  lang: {
    label: "Dil",
    tr: "Türkçe",
    en: "English",
  },
  play: {
    overviewTitle: "Genel durum",
    dialogClose: "Kapat",
    cityDetailBack: "Genel bakışa dön",
    cityDetailIntro: "Bu şehre ait bina seviyeleri; diğer şehirlerden bağımsız yükseltilebilir.",
    tableWorkingPop: "Çalışan / nüfus",
    overviewResearch: "Araştırma",
    overviewBuildings: "Binalar",
    overviewProdHour: "Üretim / saat",
    overviewNoSeed: "Veri yok. Terminalde:",
    resourcesTitle: "Hammadde ve saatlik üretim",
    resourcesStock: "Toplam stok",
    resourcesHourly: "Saatlik (tahmini)",
    resourcesCity: "Şehir",
    buildingsTitle: "Binalar",
    buildingsCatalogHint:
      "Çağlara göre bina kataloğu. Seviye yoksa bina henüz inşa edilmemiştir; ilk seviye “İnşa et” ile açılır. Çarpan ve formül detayları yalnızca yöneticilere gösterilir.",
    buildingsEraEmpty:
      "Bu çağda yeni bina türü yok. Önceki çağlardaki binaları yükselt veya imparatorluk çağını ilerlet.",
    buildingsEraTechOnly:
      "Bu çağda yeni bina türü yok; örnek teknolojiler için Araştırma sayfasındaki kataloğa bakın.",
    adminBonusHint:
      "Yönetici: aşağıda bonus çarpanları ve formül satırları görünür.",
    techCatalogTitle: "Teknolojiler",
    techCatalogHint:
      "Süre sütunu, verilen üst seviye sürelerden hesaplanan seviye 1 araştırma süresidir (en fazla 48 saat). Tablo bilgi amaçlıdır.",
    techCatalogColEra: "Çağ",
    techCatalogColTier: "Seviye",
    techCatalogColName: "Teknoloji",
    techCatalogColTime: "Süre (seviye 1)",
    techCatalogColGoal: "Amaç",
    catalogFieldTime: "Süre:",
    catalogFieldAge: "Çağ:",
    catalogFieldLevel: "Seviye:",
    catalogFieldPurpose: "Amaç:",
    catalogBtnResearch: "Araştır",
    catalogBtnProduce: "Üret",
    catalogBtnUpgrade: "Yükselt",
    catalogNoDuration: "—",
    catalogStatAttack: "Saldırı:",
    catalogStatDefense: "Defans:",
    catalogStatAgility: "Çeviklik:",
    catalogStatSpeed: "Hız:",
    catalogStatCarry: "Taşıma:",
    catalogStatHp: "Hayat:",
    catalogStatFood: "Besin:",
    bonusNone: "İnşa yok — bonus yok.",
    bonusTownHall: "Nüfus üst sınırı (merkez + kışla formülü): {cap}",
    bonusResource: "Bu kaynak için üretim çarpanı: ×{mult}",
    bonusBarracks: "Asker üst sınırı (kışla): {cap}",
    buildingDescTownHall:
      "Şehrin yönetim merkezi. Nüfus üst sınırını büyütür; diğer binaların gelişmesi için temel oluşturur.",
    buildingDescLumber:
      "Odun üretimini artırır. İşçiler kereste ile odun keser; seviye arttıkça aynı işçi başına üretim yükselir.",
    buildingDescIron:
      "Demir cevheri çıkarır. Orta Çağ ve sonrasında kullanılabilir; ordular ve ileri binalar için gereklidir.",
    buildingDescOil:
      "Petrol çıkarır. Keşif çağı ve sonrasında açılır; modern ordular ve sanayi için kritiktir.",
    buildingDescFarm:
      "Besin üretir. Nüfusun beslenmesi ve ordunun ihtiyacı için gereklidir.",
    buildingDescBarracks:
      "Asker eğitir ve garnizon kapasitesini belirler. Seviye arttıkça üst asker limiti ve filo gücü katkısı artar.",
    buildFirst: "İnşa et",
    levelNone: "—",
    trainNeedBarracks: "Önce kışla inşa et veya yükselt.",
    buildingTownHall: "Merkez",
    buildingLumber: "Kereste",
    buildingIron: "Demir",
    buildingOil: "Petrol",
    buildingFarm: "Çiftlik",
    buildingBarracks: "Kışla",
    levelShort: "Sv",
    upgrade: "Yükselt",
    cost: "Maliyet",
    workersTitle: "İşçi dağılımı",
    saveWorkers: "Kaydet",
    researchTitle: "Teknoloji",
    researchTier: "Seviye",
    researchPayFrom: "Kaynağı düşülecek şehir",
    researchBtn: "Araştır",
    researchExpl:
      "Araştırma tüm şehirlerde üretimi artırır (yaklaşık %4 / seviye). Maliyet seçtiğin şehirden düşülür.",
    productionTitle: "Asker eğitimi",
    soldiers: "Asker",
    soldierCap: "Kışla üst limiti",
    trainAmount: "Adet",
    trainBtn: "Eğit",
    trainCost: "Birim: 5 odun, 20 demir, 25 besin",
    fleetHint:
      "Saldırı gücü önerisi şehirdeki asker ve kışlaya göre doldurulur; istersen değiştir.",
    resWood: "Odun",
    resIron: "Demir",
    resOil: "Petrol",
    resFood: "Besin",
    overviewIdle: "boşta",
    overviewFootnote:
      "* Besin sütunu: saatlik net (üretim − tüketim). Tüketim nüfus, asker ve kışla seviyesine bağlıdır; çağla birlikte artar. Hammaddeye işçi verilmezse o kaynak üretilmez. Stok sayıları son sunucu kaydından bu yana saatlik oranla anlık güncellenir.",
    overviewSelectCity: "Seçili şehir",
    overviewWorkersIn: "{city} işçileri",
    overviewBuildingInProgress: "Bina yükseltme",
    overviewProductionInProgress: "Asker üretimi",
    overviewResearchHeading: "Teknoloji Araştırması:",
    overviewResearchIdle: "Boşta",
    overviewNone: "Yok",
    overviewTime: "Süre",
    overviewIdleShownRed: "Boştaki işçiler kırmızı gösterilir.",
    tablePop: "Nüfus",
    tableWorkers: "İşçiler",
    fleetIntro:
      "Hedef koordinata filo gönder. Saldırı gücü asker ve kışlaya göre önerilir.",
    fleetReportsTitle: "Son savaş raporları",
    fleetNoReports: "Henüz rapor yok.",
    fleetSendBtn: "Filo gönder",
    fleetSending: "Gönderiliyor…",
    fleetSentOk: "Gönderildi",
    fleetOutcomeWin: "Galibiyet",
    fleetOutcomeLoss: "Yenilgi",
    errMissingFields: "Eksik alan",
    errServer: "Sunucu hatası",
    fleetNoCity: "Önce şehir oluştur veya seed çalıştır.",
    fleetDepartCity: "Çıkış şehri",
    fleetTargetX: "Hedef X",
    fleetTargetY: "Hedef Y",
    fleetTargetZ: "Hedef Z",
    fleetAttack: "Toplam saldırı gücü",
    fleetDefenseFleet: "Filo savunma (giden)",
    fleetDefenseTarget: "Hedef savunma (rakip)",
    researchMax: "(üst sınır)",
    trainCostNoIron: "Birim: 5 odun, 25 yiyecek (demir bu çağda yok)",
    errLogin: "Giriş gerekli",
    errCity: "Şehir bulunamadı",
    errUser: "Kullanıcı yok",
    errWorkersOver: "İşçi toplamı nüfusu aşamaz",
    errBuildingMax: "Bina maksimum seviyede",
    errInsufficient: "Yetersiz kaynak",
    errBarracksFull: "Kışla kapasitesi dolu",
    errInvalidAmount: "Geçersiz miktar",
    errBuildingLocked: "Bu çağda bu bina yok",
    errBuildBusy: "Bu şehirde yükseltme zaten devam ediyor.",
    errResearchMax: "Araştırma maksimum",
    errResearchBusy: "Zaten bir araştırma sürüyor; bitene kadar bekleyin.",
    worldmapTitle: "Dünya",
    worldmapIntro:
      "Bu ekranda çizgisel harita yok: dünya (X:Y:Z) koordinatları üzerinden konum takibi yapılır. Filo ve diplomasi aynı koordinat modelini kullanır.",
    worldmapNoTileMap:
      "Harita karosu / zoom görünümü planlanmıyor; liste ve koordinat girişi ile ilerlenir.",
    worldmapYourCities: "Şehirlerin",
    worldmapCoord: "Koordinat",
    worldmapFleetCta: "Hedefe ordu göndermek için Filo sayfasını kullan.",
    worldmapNoCities: "Henüz şehir yok. Genel bakış veya seed ile başla.",
    worldmapComingSoon:
      "İleride: komşu tarama, mesafe tahmini, savaş/keşif raporu bağlantıları.",
    worldmapAllPlayers: "Tüm oyuncular (X–Y düzlemi)",
    worldmapLegendYou: "Sen",
    worldmapLegendOther: "Diğer oyuncular",
    worldmapPlaneHint: "X → sağ, Y → yukarı; Z bu düzlemde yok.",
    marketTitle: "Market",
    marketIntro:
      "Asker sat: ilan verdiğinde geri sayım başlar; süre dolmadan kimse alamaz. Süre bitince alım açılır.",
    marketListSoldiers: "Asker sat (kışladan düşer, alıcı şehrine gider)",
    marketFromCity: "Şehir",
    marketQty: "Adet",
    marketPriceWood: "Fiyat (odun)",
    marketPriceIron: "Fiyat (demir)",
    marketPriceFood: "Fiyat (besin)",
    marketSubmitList: "Satışa çıkar",
    marketBuy: "Satın al",
    marketReceiveCity: "Askerin gideceği şehir",
    marketEmpty: "Henüz ilan yok.",
    marketSeller: "Satıcı",
    marketTribe: "Kabile",
    marketOpensAt: "Alım açılışı",
    marketTimerWait: "Kilitli — geri sayım",
    marketTimerReady: "Satın alınabilir",
    foundCityTitle: "Yeni şehir kur",
    foundCityExpl:
      "En az 3. çağ (Yeniden Doğuş) ve imparatorluk araştırması 3+ olmalı. Maliyet seçtiğin şehirden düşer.",
    foundCityLocked:
      "Şehir kurma kilitli: 3. çağa yüksel ve araştırmayı 3+ yap.",
    foundCityName: "Şehir adı",
    foundCityPayFrom: "Ödeme şehri",
    foundCityCoordX: "X",
    foundCityCoordY: "Y",
    foundCityCoordZ: "Z",
    foundCitySubmit: "Şehri kur",
    errFoundCityLocked: "Şehir kurma koşulları sağlanmıyor.",
    errMarketNotOpen: "Geri sayım bitmeden bu ilan satın alınamaz.",
    errMarketGone: "İlan artık yok veya satıldı.",
    errMarketSelf: "Kendi ilanını satın alamazsın.",
    marketDelayNote: "İlan sonrası bekleme (saniye): {sec}",
    marketSoldiersUnit: "asker",
    marketYourListing: "Senin ilanın",
  },
};

const en: Dictionary = {
  public: {
    account: "Account",
    guide: "Guide",
    community: "Community",
    login: "Sign in",
    register: "Register",
    howToPlay: "How to play",
    features: "Game features",
    rules: "Rules",
    forumSoon: "Forum (soon)",
    faqSoon: "FAQ (soon)",
    recentTitle: "Latest registrations",
    recentHint: "Newest first. Country is chosen at signup.",
    noRegistrations: "No registrations yet.",
    countryLabel: "Country",
    bannerAlt: "War of City — siege and strategy",
    loginHeroAlt: "Siege and castle — War of City",
    loginHeroCaption:
      "War of City: castles, armies, and alliances — real-time strategy in your browser.",
    loginWelcome: "Welcome to warofcity",
    loginIntroLine: "Welcome to the world of war and strategy. To register, click:",
    loginNoticeTitle: "Attention all players",
    loginNoticeItems: [
      "warofcity contains no advertisements.",
      "The game is free.",
      "New features are added based on player feedback.",
      "Join our forum.",
      "Spread the word.",
      "Turkish localization is being improved alongside English.",
    ],
    loginStatRegistered: "In total {count} players are registered.",
    loginStatOnline: "Right now {count} players are online.",
    loginStatLastIntro: "Last registered: ",
    loginStatLastBetweenUserAndAgo: " — ",
    loginStatLastBetweenAgoAndCountry: " ago — nation chosen at signup: ",
    loginStatLastEmpty: "No registered players yet.",
    loginTableTopCountriesTitle:
      "Right now, top five countries with best total scores are:",
    loginTableTopPlayersTitle:
      "Right now, top five players with best total scores are:",
    loginTablePlayerRow: "{name} (from {country})",
    loginServerClockLabel: "Server time",
    loginColRank: "Rank",
    loginColCountry: "Country",
    loginColPlayer: "Player",
    navHome: "Home",
    loginWelcomeTitle: "Welcome to War of City",
    loginIntroParagraph1:
      "warofcity is a massive multiplayer, browser-based strategy game.",
    loginIntroParagraph2Before:
      "If you do not have a user name and password, please ",
    loginIntroParagraph2After: " to join.",
    loginIntroRegisterWord: "register",
    loginFooterNotice:
      "© {year} War of City. Developed for web browsers; iOS and Android apps are planned for a later release.",
    loginBulletsFive: [
      "warofcity does not (and will not) contain any advertisements.",
      "It is free to play warofcity.",
      "New features are going to be added non-stop with players’ guidance.",
      "",
      "Spread the word and let others join the fun.",
    ],
    loginBullet4Before: "Do not forget to join our ",
    loginBullet4LinkWord: "forum",
    loginBullet4After: ".",
    loginNavLogin: "Login",
    loginNavRegister: "Register",
    loginNavAbout: "About",
    loginNavTutorial: "Tutorial",
    loginNavForum: "Forum",
    loginNavManual: "Manual",
    loginBarUser: "User Name",
    loginBarPass: "Password",
    loginBarSubmit: "Login",
  },
  auth: {
    loginTitle: "Player sign-in",
    loginSubtitle: "Connect to the game with your account",
    username: "Username",
    password: "Password",
    signIn: "Sign in",
    signingIn: "…",
    noAccount: "No account yet?",
    registerCta: "Register",
    badCredentials: "Invalid username or password.",
    registerTitle: "New account",
    registerSubtitle: "Your country appears on the registration list",
    country: "Country",
    registerBtn: "Register",
    registering: "…",
    hasAccount: "Already have an account?",
    signInCta: "Sign in",
    afterRegisterNote: "After registering, sign in from the login page.",
    errorGeneric: "Registration failed",
    errorConnection: "Connection error",
  },
  howToPlay: {
    title: "How to play?",
    items: [
      "Register: username, password, and country. Your starter city is created.",
      "Sign in and manage cities and resources.",
      "Buildings / research / production to grow economy and armies (more pages coming).",
      "Fleet: send armies to coordinates; battle reports use attack vs defense totals.",
      "Alliances / diplomacy / map interactions with other players (in development).",
    ],
  },
  features: {
    title: "Game features",
    items: [
      "Multi-city economy (wood, iron, oil, food)",
      "Worker allocation, population, production queues",
      "Research, buildings, and unit training (expanding)",
      "Timed fleet moves; attack / defense battle reports",
      "World visuals that change with the era",
    ],
  },
  rulesPage: {
    title: "Rules",
    back: "← Back to sign in",
    bullets: [
      "Your account is yours—no sharing, bots, or cheats.",
      "Be respectful to players—no harassment, spam, or scams.",
      "Report exploits to admins; don’t abuse them.",
      "Multiple accounts may be against server policy (details later).",
    ],
    note: "This is a short summary; full terms of use may be added later.",
  },
  game: {
    bannerLeader: "Leader",
    bannerTribe: "Tribe",
    bannerTitle: "Title",
    bannerRole: "Role",
    bannerServerTime: "Server time",
    menuLeaderMenu: "Leader menu",
    menuLeadership: "Leadership",
    menuGameMenu: "Game menu",
    labelRank: "Rank",
    labelManager: "Manager",
    labelTribe: "Tribe",
    rankLeaderValue: "Leader",
    serverDate: "Server date",
    menuUser: "User menu",
    menuAdmin: "Admin",
    adminPanel: "Admin panel",
    eraWorld: "Era (world)",
    logout: "Log out",
    overview: "General status",
    resources: "Raw materials",
    buildings: "Buildings",
    research: "Technology",
    production: "Troop production",
    fleet: "Fleet",
    missions: "Missions",
    diplomacy: "Diplomacy",
    worldmap: "World map",
    market: "Market",
    stats: "Stats",
    messages: "Messages",
    options: "Settings",
    help: "Help",
    forum: "Forum",
  },
  footer: {
    line1:
      "War of City — strategy and siege in your browser. Replace assets under public/banner and public/landing as you like.",
    rights: "All rights reserved.",
  },
  lang: {
    label: "Language",
    tr: "Türkçe",
    en: "English",
  },
  play: {
    overviewTitle: "General status",
    dialogClose: "Close",
    cityDetailBack: "Back to overview",
    cityDetailIntro: "Building levels for this city only; upgrades are independent per city.",
    tableWorkingPop: "Working / population",
    overviewResearch: "Research",
    overviewBuildings: "Buildings",
    overviewProdHour: "Production / h",
    overviewNoSeed: "No data. Run in terminal:",
    resourcesTitle: "Raw materials and hourly output",
    resourcesStock: "Total stock",
    resourcesHourly: "Hourly (estimate)",
    resourcesCity: "City",
    buildingsTitle: "Buildings",
    buildingsCatalogHint:
      "Building catalog by age. No level means not built yet; use “Build” for the first level. Multiplier and formula details are visible to admins only.",
    buildingsEraEmpty:
      "No new building type in this age. Upgrade buildings from earlier ages or advance your empire age.",
    buildingsEraTechOnly:
      "No new building type in this age; see the technology catalog on the Research page for examples.",
    adminBonusHint:
      "Admin: bonus multipliers and formula lines are shown below.",
    techCatalogTitle: "Technologies",
    techCatalogHint:
      "Duration is the tier-1 research time scaled from the stated high-tier reference (capped at 48 hours). Table is informational.",
    techCatalogColEra: "Age",
    techCatalogColTier: "Tier",
    techCatalogColName: "Technology",
    techCatalogColTime: "Time (tier 1)",
    techCatalogColGoal: "Goal",
    catalogFieldTime: "Time:",
    catalogFieldAge: "Age:",
    catalogFieldLevel: "Level:",
    catalogFieldPurpose: "Goal:",
    catalogBtnResearch: "Research",
    catalogBtnProduce: "Train",
    catalogBtnUpgrade: "Upgrade",
    catalogNoDuration: "—",
    catalogStatAttack: "Attack:",
    catalogStatDefense: "Defense:",
    catalogStatAgility: "Agility:",
    catalogStatSpeed: "Speed:",
    catalogStatCarry: "Carry:",
    catalogStatHp: "HP:",
    catalogStatFood: "Food:",
    bonusNone: "Not built — no bonus.",
    bonusTownHall: "Population cap (town hall + barracks formula): {cap}",
    bonusResource: "Production multiplier for this resource: ×{mult}",
    bonusBarracks: "Soldier cap (barracks): {cap}",
    buildingDescTownHall:
      "Your city’s administration hub. Raises population cap and anchors city growth.",
    buildingDescLumber:
      "Boosts wood output. Workers at the mill cut timber; higher levels raise output per worker.",
    buildingDescIron:
      "Mines iron ore. Available from the Medieval age onward; needed for armies and advanced structures.",
    buildingDescOil:
      "Extracts oil. Unlocks in the Discovery age and later; critical for modern armies and industry.",
    buildingDescFarm:
      "Produces food. Feeds your population and supplies your armies.",
    buildingDescBarracks:
      "Trains troops and sets garrison capacity. Higher levels raise soldier caps and fleet power bonuses.",
    buildFirst: "Build",
    levelNone: "—",
    trainNeedBarracks: "Build or upgrade barracks first.",
    buildingTownHall: "Town hall",
    buildingLumber: "Lumber mill",
    buildingIron: "Iron mine",
    buildingOil: "Oil well",
    buildingFarm: "Farm",
    buildingBarracks: "Barracks",
    levelShort: "Lv",
    upgrade: "Upgrade",
    cost: "Cost",
    workersTitle: "Worker allocation",
    saveWorkers: "Save",
    researchTitle: "Technology",
    researchTier: "Tier",
    researchPayFrom: "Deduct resources from city",
    researchBtn: "Research",
    researchExpl:
      "Research boosts production in all cities (~4% per tier). Cost is paid from the city you select.",
    productionTitle: "Troop training",
    soldiers: "Soldiers",
    soldierCap: "Barracks cap",
    trainAmount: "Amount",
    trainBtn: "Train",
    trainCost: "Per unit: 5 wood, 20 iron, 25 food",
    fleetHint:
      "Suggested attack power is filled from soldiers and barracks; you can override.",
    resWood: "Wood",
    resIron: "Iron",
    resOil: "Oil",
    resFood: "Food",
    overviewIdle: "idle",
    overviewFootnote:
      "* Food column: hourly net (production − consumption). Consumption scales with population, soldiers, barracks, and age. Assign workers or that resource won’t produce. Stock numbers tick live from hourly rates since the last server snapshot.",
    overviewSelectCity: "Selected city",
    overviewWorkersIn: "Workers in {city}",
    overviewBuildingInProgress: "Building upgrade",
    overviewProductionInProgress: "Troop training",
    overviewResearchHeading: "Technology research:",
    overviewResearchIdle: "Idle",
    overviewNone: "None",
    overviewTime: "Time",
    overviewIdleShownRed: "Idle workers are shown in red.",
    tablePop: "Population",
    tableWorkers: "Workers",
    fleetIntro:
      "Send a fleet to target coordinates. Attack power is suggested from troops and barracks.",
    fleetReportsTitle: "Recent battle reports",
    fleetNoReports: "No reports yet.",
    fleetSendBtn: "Send fleet",
    fleetSending: "Sending…",
    fleetSentOk: "Sent",
    fleetOutcomeWin: "Victory",
    fleetOutcomeLoss: "Defeat",
    errMissingFields: "Missing fields",
    errServer: "Server error",
    fleetNoCity: "Create a city or run seed first.",
    fleetDepartCity: "Depart city",
    fleetTargetX: "Target X",
    fleetTargetY: "Target Y",
    fleetTargetZ: "Target Z",
    fleetAttack: "Total attack power",
    fleetDefenseFleet: "Fleet defense (outbound)",
    fleetDefenseTarget: "Target defense (enemy)",
    researchMax: "(max)",
    trainCostNoIron: "Per unit: 5 wood, 25 food (no iron in this age)",
    errLogin: "Sign-in required",
    errCity: "City not found",
    errUser: "User missing",
    errWorkersOver: "Workers cannot exceed population",
    errBuildingMax: "Building is at max level",
    errInsufficient: "Not enough resources",
    errBarracksFull: "Barracks capacity full",
    errInvalidAmount: "Invalid amount",
    errBuildingLocked: "This building is not available in your age",
    errBuildBusy: "A building upgrade is already in progress in this city.",
    errResearchMax: "Research is at maximum",
    errResearchBusy: "Research is already in progress; wait until it finishes.",
    worldmapTitle: "World",
    worldmapIntro:
      "There is no drawn map here: the world uses (X:Y:Z) coordinates. Fleet and diplomacy use the same model.",
    worldmapNoTileMap:
      "No tile map or zoom view is planned; you play from lists and coordinate inputs.",
    worldmapYourCities: "Your cities",
    worldmapCoord: "Coordinates",
    worldmapFleetCta: "Use the Fleet page to send armies to a target.",
    worldmapNoCities: "No cities yet. Start from Overview or run the seed.",
    worldmapComingSoon:
      "Coming: neighbor scan, distance hints, links to battle/scout reports.",
    worldmapAllPlayers: "All players (X–Y plane)",
    worldmapLegendYou: "You",
    worldmapLegendOther: "Other players",
    worldmapPlaneHint: "X → right, Y → up; Z is not shown on this plane.",
    marketTitle: "Market",
    marketIntro:
      "Sell troops: when you list, a countdown starts; nobody can buy until it ends. Purchases open when the timer hits zero.",
    marketListSoldiers: "Sell soldiers (deducted from barracks city; delivered to buyer city)",
    marketFromCity: "City",
    marketQty: "Amount",
    marketPriceWood: "Price (wood)",
    marketPriceIron: "Price (iron)",
    marketPriceFood: "Price (food)",
    marketSubmitList: "List for sale",
    marketBuy: "Buy",
    marketReceiveCity: "Receive troops in city",
    marketEmpty: "No listings yet.",
    marketSeller: "Seller",
    marketTribe: "Tribe",
    marketOpensAt: "Opens for purchase",
    marketTimerWait: "Locked — countdown",
    marketTimerReady: "Ready to buy",
    foundCityTitle: "Found a new city",
    foundCityExpl:
      "Requires at least Age 3 (Renaissance) and empire research tier 3+. Cost is paid from the city you select.",
    foundCityLocked:
      "Found city is locked: reach Age 3 and research tier 3+.",
    foundCityName: "City name",
    foundCityPayFrom: "Pay from city",
    foundCityCoordX: "X",
    foundCityCoordY: "Y",
    foundCityCoordZ: "Z",
    foundCitySubmit: "Found city",
    errFoundCityLocked: "Found-city requirements not met.",
    errMarketNotOpen: "This listing cannot be bought until the countdown ends.",
    errMarketGone: "Listing is gone or already sold.",
    errMarketSelf: "You cannot buy your own listing.",
    marketDelayNote: "Wait after listing (seconds): {sec}",
    marketSoldiersUnit: "soldiers",
    marketYourListing: "Your listing",
  },
};

const map: Record<AppLocale, Dictionary> = { tr, en };

export function getDictionary(locale: AppLocale): Dictionary {
  return map[locale] ?? tr;
}
