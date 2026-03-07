import { SearchForm } from "./components/SearchForm";
import { ParameterPane } from "./components/ParameterPane";
import { useBofs } from "./hooks/useBofs";
import { useState } from "react";
import { Container, Row, Tab, Tabs, Accordion } from "react-bootstrap";
import { CodeBlock } from "./components/CodeBlock";
import { Banner } from "./components/Banner";
import { AnalysisPane } from "./components/AnalysisPane";
import "./App.css";

import type { Bof } from "./types";

function App() {
  const allBofs = useBofs();
  const [bof, setBof] = useState<Bof | null>(null);

  if (!allBofs) {
    return <div> Loading... </div>;
  }

  const callback = (bof: Bof | null) => {
    console.log("Loading bof: " + bof?.name);
    console.log("code:\n" + bof?.code);
    setBof(() => bof);
  };

  if (allBofs.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <Container fluid className={`app-layout p-3`}>
      <Container className="app-panel border border-light rounded p-3">
        <Row className="mb-4">
          <Banner />
        </Row>
        <Row className="mb-4">
          <SearchForm allBofs={allBofs} onSelect={callback} />
        </Row>
        {bof && (
          <Row className="px-2">
            <Accordion defaultActiveKey="0" className="px-0 mb-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>{bof.name} usage</Accordion.Header>
                <Accordion.Body>
                  <pre className="bof-usage">{bof.description}</pre>
                  <a
                    target={"_blank"}
                    href={bof.url}
                    className="btn btn-outline-light"
                  >
                    {"View on GitHub"} <i className="bi bi-github mx-2"></i>
                  </a>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Tabs defaultActiveKey="parameters">
              <Tab eventKey="parameters" title="Arguments" className="py-3">
                <ParameterPane bof={bof} />
              </Tab>
              <Tab eventKey="cna" title="CNA" className="py-3">
                <h2> CNA </h2>
                <CodeBlock code={bof.cna} language="groovy" />
              </Tab>
              <Tab eventKey="code" title="Entrypoint" className="py-3">
                <p>The entrypoint of the Beacon Object File.</p>
                <CodeBlock code={bof.code} language="c" />
              </Tab>
              <Tab eventKey="analysis" title="Analysis" className="py-3">
                <AnalysisPane bof={bof} />
              </Tab>
            </Tabs>
          </Row>
        )}
      </Container>
    </Container>
  );
}

export default App;
