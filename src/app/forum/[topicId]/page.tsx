import { LoginScreenLayout } from "@/components/landing/LoginScreenLayout";
import { createForumPost } from "@/app/actions/forum";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ForumTopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const serverNow = new Date();
  const session = await auth();

  const topic = await prisma.forumTopic.findUnique({
    where: { id: topicId },
    include: {
      author: { select: { username: true } },
      posts: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { username: true } } },
      },
    },
  });

  if (!topic) notFound();

  return (
    <LoginScreenLayout dict={dict} serverNow={serverNow} activeNav="forum">
      <div
        className="mx-auto max-w-3xl space-y-6 text-[15px] leading-relaxed text-zinc-200"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        <Link
          href="/forum"
          className="text-sm text-amber-400/90 underline hover:text-amber-200"
        >
          ← {locale === "en" ? "Forum" : "Forum"}
        </Link>
        <h2 className="text-xl font-bold text-amber-200">{topic.title}</h2>
        <p className="text-xs text-zinc-500">
          {topic.author.username} ·{" "}
          {new Date(topic.createdAt).toLocaleString(
            locale === "en" ? "en-US" : "tr-TR",
          )}
        </p>

        <ul className="space-y-4">
          {topic.posts.map((p) => (
            <li
              key={p.id}
              className="rounded-lg border border-zinc-700/50 bg-black/30 px-4 py-3"
            >
              <div className="mb-2 text-xs text-zinc-500">
                <span className="font-medium text-amber-100/90">
                  {p.author.username}
                </span>{" "}
                ·{" "}
                {new Date(p.createdAt).toLocaleString(
                  locale === "en" ? "en-US" : "tr-TR",
                )}
              </div>
              <p className="whitespace-pre-wrap text-sm text-zinc-200">
                {p.body}
              </p>
            </li>
          ))}
        </ul>

        {session?.user?.id ? (
          <form
            action={createForumPost.bind(null, topicId)}
            className="rounded-lg border border-amber-900/40 bg-black/40 p-4"
          >
            <div className="mb-2 text-xs font-semibold uppercase text-amber-600/90">
              {locale === "en" ? "Reply" : "Yanıt"}
            </div>
            <textarea
              name="body"
              required
              rows={4}
              className="mb-3 w-full rounded border border-zinc-600 bg-black/50 px-3 py-2 text-sm text-zinc-100"
              placeholder={locale === "en" ? "Your message…" : "Mesajınız…"}
            />
            <button
              type="submit"
              className="rounded border border-amber-700/80 bg-amber-950/50 px-4 py-2 text-sm font-semibold text-amber-100"
            >
              {locale === "en" ? "Send" : "Gönder"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-zinc-500">
            <Link href="/login" className="text-amber-200 underline">
              {locale === "en" ? "Log in" : "Giriş yap"}
            </Link>{" "}
            {locale === "en" ? "to reply." : "— yanıtlamak için."}
          </p>
        )}
      </div>
    </LoginScreenLayout>
  );
}
