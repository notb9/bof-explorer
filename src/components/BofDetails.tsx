import { Tab, Tabs } from "react-bootstrap";
import type { Bof } from "../types";
import { ParameterPane } from "./ParameterPane";
import { CodeBlock } from "./CodeBlock";
import { AnalysisPane } from "./AnalysisPane";

interface BofDetailsProps {
  bof: Bof;
}

export function BofDetails({ bof }: BofDetailsProps) {
  const tabClasses = "p-3";

  return (
    <div className="">
      <Tabs defaultActiveKey="parameters">
        <Tab eventKey="parameters" title="Arguments" className={tabClasses}>
          <ParameterPane key={bof.name} bof={bof} />
        </Tab>
        <Tab eventKey="cna" title="CNA" className={tabClasses}>
          <h2> CNA </h2>
          <CodeBlock code={bof.cna} language="groovy" />
        </Tab>
        <Tab eventKey="code" title="Entrypoint" className={tabClasses}>
          <p>The entrypoint of the Beacon Object File.</p>
          <CodeBlock code={bof.code} language="c" />
        </Tab>
        <Tab eventKey="analysis" title="Analysis" className={tabClasses}>
          <AnalysisPane bof={bof} />
        </Tab>
      </Tabs>
    </div>
  );
}
