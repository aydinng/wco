/** Ülke skorları: şehir kaynakları ülke bazında toplanır. */
export function aggregateTopCountries(
  rows: {
    registrationCountry: string;
    cities: { wood: number; iron: number; oil: number; food: number }[];
  }[],
  topN: number,
): { rank: number; countryId: string }[] {
  const scoreBy = new Map<string, number>();
  for (const u of rows) {
    const code = u.registrationCountry?.trim();
    if (!code) continue;
    let s = 0;
    for (const c of u.cities) {
      s += c.wood + c.iron + c.oil + c.food;
    }
    scoreBy.set(code, (scoreBy.get(code) ?? 0) + s);
  }
  return [...scoreBy.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([code], i) => ({
      rank: i + 1,
      countryId: code,
    }));
}

/** Oyuncu skorları: tüm şehir kaynakları toplamı. */
export function aggregateTopPlayers(
  rows: {
    username: string;
    registrationCountry: string;
    cities: { wood: number; iron: number; oil: number; food: number }[];
  }[],
  topN: number,
): { rank: number; username: string; countryId: string }[] {
  const scored = rows.map((u) => {
    let s = 0;
    for (const c of u.cities) {
      s += c.wood + c.iron + c.oil + c.food;
    }
    const cid = u.registrationCountry?.trim() || "other";
    return { username: u.username, countryId: cid, score: s };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((u, i) => ({
      rank: i + 1,
      username: u.username,
      countryId: u.countryId,
    }));
}
