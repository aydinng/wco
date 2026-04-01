import { BRAND } from "@/config/brand";
import type { EraConfig } from "@/config/eras";
import Image from "next/image";

type Props = {
  era: EraConfig;
  bannerAlt: string;
};

/**
 * Banner kutuyu yatayda doldurur (object-cover); üst/alt kırpma ile boşluk kalmaz.
 */
export function TopBanner({ era, bannerAlt }: Props) {
  return (
    <header className="relative mb-3 w-full">
      <div
        className="relative w-full overflow-hidden rounded-lg border-2 shadow-xl"
        style={{
          borderColor: era.banner.borderColor,
          boxShadow: `0 0 24px ${era.banner.glow}`,
        }}
      >
        <div className="relative w-full bg-black">
          <div className="relative aspect-[21/9] w-full min-h-[7rem] max-h-[min(32vh,18rem)] sm:min-h-[8rem] sm:max-h-[min(34vh,20rem)]">
            <Image
              src={BRAND.bannerSrc}
              alt={bannerAlt}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
          </div>
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>
      </div>
    </header>
  );
}
