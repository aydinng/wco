import { MessagesHub } from "@/components/game/MessagesHub";
import { PlaceholderPage } from "@/components/game/PlaceholderPage";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const labels =
    locale === "en"
      ? {
          reports: "Battle reports",
          inbox: "Messages from players",
          compose: "Send message",
          to: "To (username)",
          subject: "Subject",
          body: "Message",
          send: "Send",
          empty: "Nothing here yet.",
        }
      : {
          reports: "Savaş raporları",
          inbox: "Oyunculardan gelen mesajlar",
          compose: "Mesaj gönder",
          to: "Alıcı (kullanıcı adı)",
          subject: "Konu",
          body: "Mesaj",
          send: "Gönder",
          empty: "Henüz kayıt yok.",
        };

  return (
    <PlaceholderPage title={dict.game.messages}>
      <MessagesHub locale={locale} labels={labels} />
    </PlaceholderPage>
  );
}
