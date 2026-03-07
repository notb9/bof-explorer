import type { Bof } from "../types";
import { ListGroup, Accordion } from "react-bootstrap";

type AnalysisPaneProps = {
  bof: Bof;
};

export function AnalysisPane({ bof }: AnalysisPaneProps) {
  const dlls = [
    ...new Set(
      bof?.external_symbols
        .filter((s) => s.includes("$"))
        .map((x) =>
          x
            .replace(/^_?_imp_/, "")
            .split("$")[0]
            .toUpperCase(),
        ),
    ),
  ];
  const funcs = [
    ...new Set(
      bof?.external_symbols
        .filter((s) => s.includes("$"))
        .map(
          (x) =>
            `${x.split("$")[1]} (${x.split("$")[0].replace(/^_?_imp_/, "")})`,
        ),
    ),
  ];

  const internal_funcs = [
    ...new Set(
      bof?.external_symbols.filter((s) => !s.includes("$")).map((x) => x),
    ),
  ];

  return (
    <>
      <p>Overview of the runtime effects of the BOF:</p>
      <Accordion defaultActiveKey="0" className="px-0 mb-4 flush">
        <Accordion.Item eventKey="0">
          <Accordion.Header className="analysis-header">DLLs</Accordion.Header>
          <Accordion.Body>
            <ListGroup>
              {dlls.sort().map((x) => (
                <ListGroup.Item>{x}</ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion defaultActiveKey="0" className="px-0 mb-4">
        <Accordion.Item eventKey="1">
          <Accordion.Header className="analysis-header">
            External Functions
          </Accordion.Header>
          <Accordion.Body>
            <ListGroup>
              {funcs.sort().map((x) => (
                <ListGroup.Item key={x}>{x}</ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion defaultActiveKey="0" className="px-0 mb-4">
        <Accordion.Item eventKey="2">
          <Accordion.Header className="analysis-header">
            Internal Functions
          </Accordion.Header>
          <Accordion.Body>
            <ListGroup>
              {internal_funcs.sort().map((x) => (
                <ListGroup.Item key={x}>{x}</ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
