import type { Bof, BofData } from "../types";

let data: Bof[] | null = null;
let promise: Promise<Bof[]> | null = null;

const files = ["/operators-kit.json", "/situational-awareness.json"];

export function useBofs() {
  if (data) return data;

  // Fetch if not doing so already
  if (!promise) {
    promise = Promise.all(
      files.map((file) => fetch(file).then((res) => res.json())),
    ).then((jsons) => {
      data = jsons.flatMap((json: BofData) =>
        json.bofs.map((bof) => ({
          ...bof,
          url: `${json.url}/tree/${json.branch}/${bof.src_path}`,
          kit: json.kit,
        })),
      );
      return data;
    });
  }

  // Throw promise to trigger Suspense
  throw promise;
}
