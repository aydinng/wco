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
        className="max-w-3xl space-y-4 text-[15px] font-semibold leading-relaxed text-[#FFFF00] sm:text-base"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        <h2 className="text-xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          {ABOUT_WAR_OF_CITY_TR.title}
        </h2>
        {ABOUT_WAR_OF_CITY_TR.body.split("\n\n").map((block, i) => (
          <p
            key={i}
            className="whitespace-pre-line drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]"
          >
            {block.trim()}
          </p>
        ))}
      </article>
    </LoginScreenLayout>
  );
}
