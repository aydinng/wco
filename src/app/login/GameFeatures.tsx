export function GameFeatures() {
  return (
    <section
      id="ozellikler"
      className="mt-6 w-full max-w-md scroll-mt-24 rounded border border-[#2a3441]/80 bg-black/25 p-4 text-sm leading-relaxed text-zinc-400"
    >
      <h2
        className="mb-3 text-base text-amber-200/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        Oyun özellikleri
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Çoklu şehir ve kaynak ekonomisi (odun, demir, petrol, yiyecek)</li>
        <li>İşçi dağılımı, nüfus ve üretim kuyrukları</li>
        <li>Araştırma, bina ve birlik üretimi (genişletme devam ediyor)</li>
        <li>Filo ile hedefe süreli gönderim; saldırı / savunma raporları</li>
        <li>Çağlara göre değişen dünya görünümü</li>
      </ul>
    </section>
  );
}
