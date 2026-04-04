/**
 * ~30k oyuncuya yetecek dinamik dünya kutusu: veriye göre genişler,
 * seyrek şehirde minimum görünür alan korunur.
 */
export type CoordBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

const DEFAULT_PAD = 12;
/** En az bu kadar X/Y aralığı gösterilir (birkaç şehir varken sıkışmasın) */
const MIN_AXIS_SPAN = 80;
/** Koordinat üretimi için yumuşak üst sınır (bilgi amaçlı; DB sınırlamaz) */
export const WORLD_COORD_HINT_MAX = 2000;

export function computeWorldCoordBounds(
  rows: { coordX: number; coordY: number }[],
): CoordBounds {
  if (rows.length === 0) {
    return { minX: 0, maxX: MIN_AXIS_SPAN, minY: 0, maxY: MIN_AXIS_SPAN };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const c of rows) {
    minX = Math.min(minX, c.coordX);
    maxX = Math.max(maxX, c.coordX);
    minY = Math.min(minY, c.coordY);
    maxY = Math.max(maxY, c.coordY);
  }
  if (!Number.isFinite(minX)) {
    return { minX: 0, maxX: MIN_AXIS_SPAN, minY: 0, maxY: MIN_AXIS_SPAN };
  }

  minX -= DEFAULT_PAD;
  maxX += DEFAULT_PAD;
  minY -= DEFAULT_PAD;
  maxY += DEFAULT_PAD;

  const spanX = maxX - minX;
  const spanY = maxY - minY;
  if (spanX < MIN_AXIS_SPAN) {
    const mid = (minX + maxX) / 2;
    minX = mid - MIN_AXIS_SPAN / 2;
    maxX = mid + MIN_AXIS_SPAN / 2;
  }
  if (spanY < MIN_AXIS_SPAN) {
    const mid = (minY + maxY) / 2;
    minY = mid - MIN_AXIS_SPAN / 2;
    maxY = mid + MIN_AXIS_SPAN / 2;
  }

  return { minX, maxX, minY, maxY };
}
