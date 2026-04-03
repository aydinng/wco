import { LoginScreenLayout } from "@/components/landing/LoginScreenLayout";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";

export default async function PublicMissionsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const serverNow = new Date();

  return (
    <LoginScreenLayout dict={dict} serverNow={serverNow} activeNav="manual">
      <div
        className="max-w-2xl space-y-3 text-[15px] font-semibold leading-relaxed text-[#FFFF00]"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        <h2 className="text-xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          {dict.public.loginNavManual}
        </h2>
        <p className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
          Kılavuz ve görevler bölümü geliştirilmektedir. Oyuna giriş yaptıktan sonra üst menüden ilgili sayfalara ulaşabilirsiniz.
        </p>
      </div>
    </LoginScreenLayout>
  );
}
