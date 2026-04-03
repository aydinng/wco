import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Ana adres: oturum yoksa giriş; varsa genel bakış (oyun kabuğu /overview). */
export default async function RootPage() {
  const session = await auth();
  if (!session) redirect("/login");
  redirect("/overview");
}
