import { PublicPageLayout } from "@/components/landing/PublicPageLayout";
import Link from "next/link";

export default async function KurallarPage() {
  return (
    <PublicPageLayout activeNav="kurallar">
      <div className="max-w-lg rounded border border-[#2a3441]/90 bg-black/35 p-5 text-base leading-relaxed text-zinc-300">
        <h1
          className="mb-4 text-lg text-amber-200/90"
          style={{ fontFamily: "var(--font-warcity), serif" }}
        >
          Kurallar
        </h1>
        <ol className="list-decimal space-y-3 pl-6">
          <li>Hesabın sana ait; başkasıyla paylaşma, bot veya hile kullanma.</li>
          <li>
            Diğer oyunculara saygılı ol; hakaret, spam ve dolandırıcılık yasaktır.
          </li>
          <li>Oyun dengesini bozan hataları yöneticiye bildir; kötüye kullanma.</li>
          <li>Birden fazla hesap kurallara aykırı olabilir (sunucu politikasına göre güncellenir).</li>
        </ol>
        <p className="mt-6 text-sm text-zinc-500">
          Bu metin şimdilik özetdir; ileride detaylı kullanım şartları eklenebilir.
        </p>
        <p className="mt-4">
          <Link href="/login" className="text-amber-400 hover:underline">
            ← Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </PublicPageLayout>
  );
}
