import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  id?: string;
  imageSrc: string;
  title: string;
  /** Bina kataloğu: sıra no (1,2,…) — resim yanında büyük puntoda */
  orderBadge?: number;
  middle: ReactNode;
  rightExtra?: ReactNode;
  actionLabel: string;
  actionHref: string;
  locked?: boolean;
  lockedLabel?: string;
  /** Sayfa eni (bina/teknoloji tam genişlik) */
  fullWidth?: boolean;
  /** Sağdaki eylem linkini gizle (bilgi kataloğu) */
  hideAction?: boolean;
  /** Süre / çağ / amaç alt alta */
  middleStack?: boolean;
};

const rowFont = { fontFamily: "var(--font-warcity), serif" } as const;

export function CatalogGameRow({
  id,
  imageSrc,
  title,
  orderBadge,
  middle,
  rightExtra,
  actionLabel,
  actionHref,
  locked,
  lockedLabel,
  fullWidth,
  hideAction,
  middleStack,
}: Props) {
  const middleClass =
    middleStack && orderBadge != null
      ? "flex flex-col gap-0.5 text-[10px] leading-relaxed text-zinc-100/95 sm:text-xs"
      : middleStack
        ? "flex flex-col gap-0.5 text-[9px] leading-relaxed text-zinc-100/95 sm:text-[10px]"
        : "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[9px] leading-relaxed text-zinc-100/95 sm:text-[10px]";

  const inner = (
    <div
      className={[
        "mx-auto flex flex-row items-start gap-2 px-2 py-1.5 sm:gap-3 sm:px-3",
        fullWidth ? "w-full max-w-none" : "max-w-[min(100%,42rem)]",
      ].join(" ")}
      style={{
        background:
          "linear-gradient(90deg, rgba(61,46,26,0.92) 0%, rgba(26,21,16,0.88) 45%, rgba(0,0,0,0.96) 100%)",
      }}
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-blue-950/50 bg-black/50 sm:h-14 sm:w-14">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="56px"
        />
      </div>

      {orderBadge != null ? (
        <>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span
              className="min-w-[1.5rem] tabular-nums text-center text-xl font-bold leading-none text-amber-300 drop-shadow sm:text-2xl"
              aria-hidden
            >
              {orderBadge}
            </span>
            <h4 className="line-clamp-2 max-w-[min(100%,14rem)] text-xs font-semibold leading-tight text-yellow-300 drop-shadow-sm sm:max-w-[18rem] sm:text-sm">
              {title}
            </h4>
          </div>
          <div className={`min-w-0 flex-1 ${middleClass}`}>{middle}</div>
        </>
      ) : (
        <div className="min-w-0 flex-1">
          <h4 className="mb-0.5 line-clamp-2 text-xs font-normal leading-tight text-yellow-300 drop-shadow-sm sm:text-sm">
            {title}
          </h4>
          <div className={middleClass}>{middle}</div>
        </div>
      )}

      {rightExtra ? (
        <div className="max-w-[min(100%,9rem)] shrink-0 text-[8px] text-white sm:max-w-[11rem] sm:text-[10px]">
          {rightExtra}
        </div>
      ) : null}

      {!hideAction && (
        <div className="flex shrink-0 items-center self-center">
          {locked ? (
            <span className="rounded border border-zinc-600 bg-black/60 px-2 py-1.5 text-center text-[9px] leading-tight text-zinc-500">
              {lockedLabel ?? "Kilitli"}
            </span>
          ) : (
            <Link
              href={actionHref}
              className="inline-block rounded border border-amber-600/90 bg-black/70 px-2 py-1.5 text-center text-[9px] leading-tight text-amber-100 shadow-inner transition-colors hover:bg-amber-950/50 hover:text-yellow-100 sm:text-[10px]"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div id={id} className="border-b border-blue-950/70" style={rowFont}>
      {inner}
    </div>
  );
}

export function CatalogFieldLine({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <span className="inline-flex max-w-full flex-wrap items-baseline gap-x-1">
      <span className="shrink-0 text-cyan-400">{label}</span>
      <span
        className={`min-w-0 break-words text-white ${valueClassName ?? ""}`}
      >
        {value}
      </span>
    </span>
  );
}
