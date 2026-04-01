import { PublicPageLayout } from "@/components/landing/PublicPageLayout";
import { countryLabelById } from "@/config/countries";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function KurallarPage() {
  const raw = await prisma.user.findMany({
    where: { passwordHash: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 25,
    select: {
      username: true,
      registrationCountry: true,
      createdAt: true,
    },
  });

  const recent = raw.map((u) => ({
    username: u.username,
    registrationCountry:
      u.registrationCountry && u.registrationCountry.length > 0
        ? countryLabelById(u.registrationCountry)
        : "—",
    createdAt: u.createdAt,
  }));

  return (
    <PublicPageLayout recent={recent} activeNav="kurallar">
      <div className="max-w-lg rounded border border-[#2a3441]/90 bg-black/35 p-5 text-sm leading-relaxed text-zinc-300">
        <h1
          className="mb-4 text-xl text-amber-200/90"
          style={{ fontFamily: "var(--font-warcity), serif" }}
        >
          Kurallar
        </h1>
        <ol className="list-decimal space-y-3 pl-5">
          <li>Hesabın sana ait; başkasıyla paylaşma, bot veya hile kullanma.</li>
          <li>
            Diğer oyunculara saygılı ol; hakaret, spam ve dolandırıcılık yasaktır.
          </li>
          <li>Oyun dengesini bozan hataları yöneticiye bildir; kötüye kullanma.</li>
          <li>Birden fazla hesap kurallara aykırı olabilir (sunucu politikasına göre güncellenir).</li>
        </ol>
        <p className="mt-6 text-xs text-zinc-500">
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
