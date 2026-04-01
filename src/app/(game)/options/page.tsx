import { PlaceholderPage } from "@/components/game/PlaceholderPage";

export default async function OptionsPage() {
  return (
    <PlaceholderPage title="Options">
      <p className="mt-2 text-sm text-zinc-400">
        Oyuncu ayarları (ses, bildirim vb.) buraya eklenecek. Sunucu çağını
        ayarlamak sadece admin içindir: <strong>Admin → Çağ</strong>.
      </p>
    </PlaceholderPage>
  );
}
