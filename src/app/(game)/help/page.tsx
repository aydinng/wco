import { HelpAdminRequest } from "@/components/game/HelpAdminRequest";
import { PlaceholderPage } from "@/components/game/PlaceholderPage";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function InGameHelpPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <PlaceholderPage title={dict.game.help}>
      <p className="mt-2 text-sm text-zinc-400">
        {locale === "en"
          ? "Shortcuts and tips will be expanded here."
          : "Kısayollar ve ipuçları burada genişletilecek."}
      </p>
      <HelpAdminRequest locale={locale} />
    </PlaceholderPage>
  );
}
