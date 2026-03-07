import { useState, useEffect } from "react";
import type { Bof, BofData } from "../types";

let cachedBofs: Bof[] | null = null;

export function useBofs() {
  const [data, setData] = useState<Bof[]>([]);

  useEffect(() => {
    // If already loaded, return cached data
    if (cachedBofs) {
      return;
    }

    // List all JSON files you want to load
    const files = [
      "/operators-kit.json",
      "/situational-awareness.json",
      // "/another-file.json",
    ];

    // Fetch all JSON files in parallel
    Promise.all(
      files.map((file) => fetch(file).then((res) => res.json())),
    ).then((jsons) => {
      // Flatten all bofs from all files
      const allBofs = jsons.flatMap((json) => {
        const bofData = json as BofData;
        for (const bof of bofData.bofs) {
          bof.url = `${bofData.url}/tree/${bofData.branch}/${bof.src_path}`;
          bof.kit = bofData.kit;
        }

        return (json as BofData).bofs;
      });

      // Cache and update state
      cachedBofs = allBofs;
      setData(allBofs);
    });
  }, []);

  return data;
}
