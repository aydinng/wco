import Image from "next/image";

type Props = {
  line1: string;
  rights: string;
};

export function LandingFooter({ line1, rights }: Props) {
  return (
    <footer className="relative mt-auto w-full border-t border-[#2a3441]/80">
      <div className="relative mx-auto max-w-7xl">
        <div className="relative h-44 w-full overflow-hidden sm:h-52 md:h-60">
          <Image
            src="/footer/landing-footer.svg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e14]/70 via-transparent to-[#0a0e14]/70" />
        </div>
        <div className="border-t border-[#2a3441]/60 bg-[#05080c]/95 px-4 py-3 text-center text-[11px] text-zinc-500 sm:text-xs">
          <p>{line1}</p>
          <p className="mt-1 text-zinc-600">
            © {new Date().getFullYear()} — {rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
