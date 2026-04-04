/** `src/data/strategic-world-map.json` ile uyumlu tipler */

export type StrategicLocaleKey = "tr" | "en";

export type LocalizedString = {
  tr: string;
  en: string;
};

export type StrategicWorldMeta = {
  id: string;
  title: LocalizedString;
  coordinateSystem: {
    unit: string;
    range: [number, number];
    axes: { x: string; y: string };
    note: string;
  };
  inspiration: string[];
};

export type StrategicFaction = {
  id: string;
  code: string;
  names: LocalizedString;
  ideology: string;
  enemyFactionIds: string[];
  fillColor: string;
  strokeColor: string;
  territory: {
    type: "polygon";
    points: [number, number][];
  };
  capitalNodeId: string;
};

export type StrategicNodeType = "chokepoint" | "energy_basin" | "tech_hub";

export type StrategicNode = {
  id: string;
  factionId: string;
  type: StrategicNodeType;
  names: LocalizedString;
  position: [number, number];
  sunTzuModifiers: Record<string, number | LocalizedString>;
};

export type LogisticsRouteType = "sea" | "land" | "air_corridor";

export type LogisticsRoute = {
  id: string;
  type: LogisticsRouteType;
  names: LocalizedString;
  factionIds: string[];
  capacityIndex: number;
  riskIndex: number;
  path: [number, number][];
  clancyNotes: LocalizedString;
};

export type StrategicWorldMapData = {
  meta: StrategicWorldMeta;
  factions: StrategicFaction[];
  strategicNodes: StrategicNode[];
  logisticsRoutes: LogisticsRoute[];
};
