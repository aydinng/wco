export function HowToPlay() {
  return (
    <section
      id="nasil-oynanir"
      className="mt-8 w-full max-w-md scroll-mt-24 rounded border border-[#2a3441]/80 bg-black/25 p-4 text-sm leading-relaxed text-zinc-400"
    >
      <h2
        className="mb-3 text-base text-amber-200/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        Nasıl oynanır?
      </h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          <strong className="text-zinc-300">Kayıt ol:</strong> kullanıcı adı, şifre ve ülke
          seç. Başlangıç şehrin oluşur.
        </li>
        <li>
          <strong className="text-zinc-300">Giriş yap</strong> ve şehirlerini, kaynaklarını
          yönet.
        </li>
        <li>
          <strong className="text-zinc-300">Binalar / araştırma / üretim</strong> ile
          ekonomini ve ordunu güçlendir (sayfalar yakında genişleyecek).
        </li>
        <li>
          <strong className="text-zinc-300">Fleet</strong> ile hedef koordinata ordu
          gönder; saldırı ve savunma toplamlarına göre rapor alırsın.
        </li>
        <li>
          <strong className="text-zinc-300">İttifak / diplomasi / harita</strong> modülleri
          üzerinden diğer oyuncularla etkileş (geliştirme devam ediyor).
        </li>
      </ol>
    </section>
  );
}
