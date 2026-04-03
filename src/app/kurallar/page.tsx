import { LoginScreenLayout } from "@/components/landing/LoginScreenLayout";
import { ABOUT_WAR_OF_CITY_TR } from "@/content/about-war-of-city-tr";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";

export default async function KurallarPage() {
  const dict = getDictionary(await getLocale());
  const serverNow = new Date();

  return (
    <LoginScreenLayout dict={dict} serverNow={serverNow} activeNav="about">
      <article
        className="max-w-3xl space-y-4 rounded-lg border border-yellow-900/45 bg-black/88 px-4 py-5 text-[14px] font-semibold leading-relaxed text-[#FFFF00] backdrop-blur-md sm:px-5 sm:text-[15px]"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        <h2 className="text-lg font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-xl">
          {ABOUT_WAR_OF_CITY_TR.title}
        </h2>
        {ABOUT_WAR_OF_CITY_TR.body.split("\n\n").map((block, i) => (
          <p
            key={i}
            className="whitespace-pre-line text-[#FFFF00]/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
          >
            {block.trim()}
          </p>
        ))}
      </article>
    </LoginScreenLayout>
  );
}
