import { HelpTutorialContent } from "@/components/landing/HelpTutorialContent";
import { LoginScreenLayout } from "@/components/landing/LoginScreenLayout";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";

type PageProps = {
  searchParams: Promise<{ p?: string }>;
};

export default async function EgitimPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = parseInt(sp.p ?? "1", 10);
  const page = Number.isFinite(raw) ? raw : 1;

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const serverNow = new Date();

  return (
    <LoginScreenLayout dict={dict} serverNow={serverNow} activeNav="tutorial">
      <HelpTutorialContent page={page} />
    </LoginScreenLayout>
  );
}
