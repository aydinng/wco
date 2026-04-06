/** Ülke sıralaması: toplam skor (User.scoreTotal) ülke bazında toplanır. */
export function aggregateTopCountries(
  rows: { registrationCountry: string; scoreTotal: number }[],
  topN: number,
): { rank: number; countryId: string; score: number }[] {
  const scoreBy = new Map<string, number>();
  for (const u of rows) {
    const code = u.registrationCountry?.trim();
    if (!code) continue;
    const s = Math.max(0, u.scoreTotal ?? 0);
    scoreBy.set(code, (scoreBy.get(code) ?? 0) + s);
  }
  return [...scoreBy.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([code, score], i) => ({
      rank: i + 1,
      countryId: code,
      score,
    }));
}

/** Oyuncu sıralaması: toplam skor. */
export function aggregateTopPlayers(
  rows: {
    username: string;
    registrationCountry: string;
    scoreTotal: number;
  }[],
  topN: number,
): { rank: number; username: string; countryId: string; score: number }[] {
  const scored = rows.map((u) => {
    const cid = u.registrationCountry?.trim() || "other";
    return {
      username: u.username,
      countryId: cid,
      score: Math.max(0, u.scoreTotal ?? 0),
    };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((u, i) => ({
      rank: i + 1,
      username: u.username,
      countryId: u.countryId,
      score: u.score,
    }));
}
