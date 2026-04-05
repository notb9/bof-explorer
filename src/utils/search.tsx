import type { Bof } from "../types";

export function searchBofs(
  bofs: Bof[],
  query: string,
  fields: (keyof Bof)[],
  matchLogic: "any" | "all",
) {
  const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (keywords.length === 0) return bofs;

  const result = bofs.filter((item) => {
    // Initialize the count of all search terms to 0
    const terms = keywords.reduce(
      (acc, curr) => {
        acc[curr.toLowerCase()] = 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Check all the fields for matches
    for (const field of fields) {
      const value = item[field];

      // Only consider string fields for now
      if (typeof value === "string") {
        const ivalue = value.toLowerCase();
        for (const term in terms) {
          if (ivalue.includes(term)) {
            terms[term] += 1;
          }
        }
      } else {
        console.debug(`Ignoring field: ${field} of type ${typeof value}`);
      }
    }

    // Check if we matched anything
    const matchCounts = Object.values(terms);
    if (matchLogic === "all") {
      return matchCounts.every((value) => value > 0);
    } else {
      return matchCounts.some((value) => value > 0);
    }
  });

  return result;
}
