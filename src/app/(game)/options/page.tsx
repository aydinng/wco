import { OptionsSettingsForm } from "@/components/game/OptionsSettingsForm";
import { PlaceholderPage } from "@/components/game/PlaceholderPage";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function OptionsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const user = await getCurrentUser();

  if (!user) {
    return (
      <PlaceholderPage title={dict.game.options}>
        <p className="mt-2 text-sm text-zinc-500">
          {locale === "en" ? "Login required." : "Giriş gerekli."}
        </p>
      </PlaceholderPage>
    );
  }

  return (
    <PlaceholderPage title={dict.game.options}>
      <p className="mb-4 text-sm text-zinc-400">
        {locale === "en"
          ? "Browser game settings — review and tell us what to keep."
          : "Tarayıcı oyunu ayarları — hangilerini tutacağımızı sonra değerlendirebilirsiniz."}
      </p>
      <OptionsSettingsForm
        locale={locale}
        initial={{
          blockIncomingMessages: user.blockIncomingMessages,
          settingSoundEnabled: user.settingSoundEnabled,
          settingNotifyBattle: user.settingNotifyBattle,
          settingCompactTables: user.settingCompactTables,
        }}
      />
    </PlaceholderPage>
  );
}
