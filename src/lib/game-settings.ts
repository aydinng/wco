import { prisma } from "@/lib/prisma";

export async function getWorldEraId() {
  const s = await prisma.gameSettings.findUnique({
    where: { id: "singleton" },
  });
  return s?.currentEra ?? "ilk_cag";
}
