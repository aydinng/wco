import { redirect } from "next/navigation";

/** Menüden kaldırıldı; doğrudan URL eski bağlantılar için ana sayfaya yönlendirilir. */
export default function MissionsPage() {
  redirect("/");
}
