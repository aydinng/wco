import { LoginLandingContent } from "@/components/landing/LoginLandingContent";
import { LoginScreenLayout } from "@/components/landing/LoginScreenLayout";
import { getDictionary } from "@/i18n/dictionaries";
import { getLoginLandingData } from "@/lib/get-login-landing-data";
import { getLocale } from "@/lib/locale";

export default async function LoginPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const stats = await getLoginLandingData();
  const serverNow = new Date();

  return (
    <LoginScreenLayout dict={dict} serverNow={serverNow} activeNav="login">
      <LoginLandingContent dict={dict} locale={locale} stats={stats} />
    </LoginScreenLayout>
  );
}
