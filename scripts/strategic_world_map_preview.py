#!/usr/bin/env python3
"""JSON stratejik harita özetini terminale yazdırır (opsiyonel)."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "data" / "strategic-world-map.json"


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    print(data["meta"]["title"]["tr"])
    print("Factions:", len(data["factions"]))
    print("Nodes:", len(data["strategicNodes"]))
    print("Routes:", len(data["logisticsRoutes"]))
    for f in data["factions"]:
        print(f"  - {f['code']}: {f['names']['tr']}")


if __name__ == "__main__":
    main()
