import { useState } from "react";
import type { Bof } from "../types";
import { Button, Card, Collapse, Stack } from "react-bootstrap";
import { ChevronDown, ChevronUp, Github } from "react-bootstrap-icons";

interface BofUsageProps {
  bof: Bof;
  expand: boolean;
}

export function BofUsage({ bof, expand }: BofUsageProps) {
  const [open, setOpen] = useState(expand);

  return (
    <Card className="border-1">
      <Card.Header
        className="d-flex justify-content-between align-items-center"
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        <Stack direction="horizontal" gap={2}>
          {/* <Terminal className="" /> */}
          <span className="fw-bold">Usage</span>
        </Stack>

        <Button variant="link" size="sm" className="p-0 text-secondary">
          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </Card.Header>

      <Collapse in={open}>
        <div>
          <Card.Body className="">
            <div className="">
              <pre className="bof-usage">{bof.description}</pre>
              <a
                target={"_blank"}
                href={bof.url}
                className="btn btn-outline-light"
              >
                {"View on GitHub"} <Github className="mx-2" />
              </a>
            </div>
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
}
