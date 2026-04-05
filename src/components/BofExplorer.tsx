import { useState } from "react";
import { Collapse, Stack } from "react-bootstrap";
import { useUserSettings } from "../contexts/UserSettings";
import { useBofs } from "../hooks/useBofs";
import type { Bof } from "../types";
import { BofDetails } from "./BofDetails";
import { BofUsage } from "./BofUsage";
import { Footer } from "./Footer";
import { SearchForm } from "./SearchForm";

export function BofExplorer() {
  const [bof, setBof] = useState<Bof | null>(null);
  const allBofs = useBofs();
  const {
    settings: { alwaysExpandUsage },
  } = useUserSettings();

  const callback = (bof: Bof | null) => {
    setBof(() => bof);
  };

  return (
    <div>
      <Stack gap={4}>
        <SearchForm allBofs={allBofs} onSelect={callback} />
        <Collapse in={bof !== null}>
          <div>
            {bof && (
              <Stack key={bof.name} gap={4}>
                <BofUsage bof={bof} expand={alwaysExpandUsage} />
                <BofDetails bof={bof} />
              </Stack>
            )}
          </div>
        </Collapse>
        <Footer />
      </Stack>
    </div>
  );
}
