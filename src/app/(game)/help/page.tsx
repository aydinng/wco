import { PlaceholderPage } from "@/components/game/PlaceholderPage";

export default function HelpPage() {
  return (
    <PlaceholderPage title="Help">
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-400">
        <li>Çağ arka planını değiştirmek için Options sayfasına git.</li>
        <li>Kendi görsellerini koymak için: public/eras/ klasörüne aynı dosya adıyla.</li>
      </ul>
    </PlaceholderPage>
  );
}
