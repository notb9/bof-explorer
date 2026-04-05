import { Suspense, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import { Banner } from "./components/Banner";
import "./App.css";

import { UserSettingsProvider } from "./contexts/UserSettings";
import { SettingsButton } from "./components/SettingsButton";
import { SettingsModal } from "./components/SettingsModal";
import { Loading } from "./components/Loading";
import { BofExplorer } from "./components/BofExplorer";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <Container fluid className="app-layout p-3">
      <UserSettingsProvider>
        <Container className="app-panel p-3">
          <SettingsButton onClick={() => setShowSettings(true)} />
          <Stack className="app-container" gap={3}>
            <Banner />
            <Suspense fallback={<Loading />}>
              <BofExplorer />
            </Suspense>
          </Stack>
        </Container>
        <SettingsModal
          show={showSettings}
          onHide={() => setShowSettings(false)}
        />
      </UserSettingsProvider>
    </Container>
  );
}

export default App;
