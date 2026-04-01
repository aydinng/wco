import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return { title: "Yönetim paneli" };
}

export default async function AdminHomePage() {
  const session = await auth();
  if (!session?.user?.id) notFound();
  const u = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });
  if (!u?.isAdmin) notFound();

  return (
    <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
      <h2
        className="mb-4 text-lg text-amber-200/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        Yönetim paneli
      </h2>
      <p className="mb-4 text-sm text-zinc-400">
        Dünya çağı ve ileride eklenecek sunucu ayarları buradan yönetilir.
      </p>
      <ul className="list-inside list-disc space-y-2 text-sm text-amber-200/85">
        <li>
          <Link href="/admin/era" className="underline hover:text-amber-100">
            Dünya çağı (tüm oyuncuların arka planı)
          </Link>
        </li>
      </ul>
    </div>
  );
}
