import { EraOptionsForm } from "@/components/game/EraOptionsForm";
import { PlaceholderPage } from "@/components/game/PlaceholderPage";
import { getWorldEraId } from "@/lib/game-settings";

export async function generateMetadata() {
  return { title: "Çağ ayarı (Admin)" };
}

export default async function AdminEraPage() {
  const worldEra = await getWorldEraId();
  return (
    <PlaceholderPage title="Dünya çağı (yalnızca admin)">
      <p className="mt-2 text-sm text-zinc-400">
        Buradan seçilen çağ, <strong>tüm oyuncuların</strong> arka plan görselini
        belirler. Oyuncular bu sayfayı görmez.
      </p>
      <div className="mt-4 max-w-md">
        <EraOptionsForm currentEra={worldEra} />
      </div>
    </PlaceholderPage>
  );
}
