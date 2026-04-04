import { LoginScreenLayout } from "@/components/landing/LoginScreenLayout";
import { createForumTopic } from "@/app/actions/forum";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PublicForumPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const serverNow = new Date();
  const session = await auth();

  const topics = await prisma.forumTopic.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      author: { select: { username: true } },
      _count: { select: { posts: true } },
    },
  });

  return (
    <LoginScreenLayout dict={dict} serverNow={serverNow} activeNav="forum">
      <div
        className="mx-auto max-w-3xl space-y-6 text-[15px] leading-relaxed text-zinc-200"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        <h2 className="text-center text-2xl font-bold text-amber-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          {dict.game.forum}
        </h2>
        <p className="text-center text-sm text-zinc-400">
          {locale === "en"
            ? "Built-in forum (lightweight). Log in to start threads."
            : "Oyuna entegre hafif forum. Konu açmak için giriş yapın."}
        </p>

        {session?.user?.id ? (
          <form
            action={createForumTopic}
            className="rounded-lg border border-amber-900/40 bg-black/40 p-4"
          >
            <div className="mb-2 text-xs font-semibold uppercase text-amber-600/90">
              {locale === "en" ? "New topic" : "Yeni konu"}
            </div>
            <input
              name="title"
              required
              minLength={2}
              maxLength={200}
              placeholder={locale === "en" ? "Title" : "Başlık"}
              className="mb-2 w-full rounded border border-zinc-600 bg-black/50 px-3 py-2 text-sm text-zinc-100"
            />
            <textarea
              name="body"
              required
              minLength={1}
              rows={4}
              placeholder={locale === "en" ? "First message…" : "İlk mesaj…"}
              className="mb-3 w-full rounded border border-zinc-600 bg-black/50 px-3 py-2 text-sm text-zinc-100"
            />
            <button
              type="submit"
              className="rounded border border-amber-700/80 bg-amber-950/50 px-4 py-2 text-sm font-semibold text-amber-100"
            >
              {locale === "en" ? "Publish" : "Yayınla"}
            </button>
          </form>
        ) : (
          <p className="rounded border border-zinc-700/60 bg-black/30 px-4 py-3 text-center text-sm text-zinc-500">
            <Link href="/login" className="text-amber-200 underline">
              {locale === "en" ? "Log in" : "Giriş yap"}
            </Link>{" "}
            {locale === "en"
              ? "to create topics."
              : "— konu açmak için."}
          </p>
        )}

        <ul className="space-y-2">
          {topics.map((t) => (
            <li key={t.id}>
              <Link
                href={`/forum/${t.id}`}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded border border-zinc-700/50 bg-black/25 px-3 py-2 hover:border-amber-800/50"
              >
                <span className="font-medium text-amber-100/95">{t.title}</span>
                <span className="text-xs text-zinc-500">
                  {t.author.username} · {t._count.posts}{" "}
                  {locale === "en" ? "posts" : "mesaj"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {topics.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            {locale === "en" ? "No topics yet." : "Henüz konu yok."}
          </p>
        ) : null}
      </div>
    </LoginScreenLayout>
  );
}
