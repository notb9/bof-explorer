import {
  Card,
  Form,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import type { Bof } from "../types";

interface AdvancedSearchFormProps {
  fields: (keyof Bof)[];
  setFields: React.Dispatch<React.SetStateAction<(keyof Bof)[]>>;
  matchLogic: "any" | "all";
  setMatchLogic: React.Dispatch<React.SetStateAction<"any" | "all">>;
}

export function AdvancedSearchForm({
  fields,
  setFields,
  matchLogic,
  setMatchLogic,
}: AdvancedSearchFormProps) {
  return (
    <Card body className="border-1 p-1">
      <Card.Title>Advanced Search Options</Card.Title>
      <Card.Body>
        <Stack gap={3}>
          <div className="d-flex align-items-center justify-content-between">
            <Form.Label className="fw-bold mb-2 small text-uppercase text-secondary">
              Search in fields
            </Form.Label>
            <ToggleButtonGroup
              type="checkbox"
              name="fields"
              value={fields}
              onChange={setFields}
              size="sm"
            >
              {[
                "name",
                "description",
                "code",
                "cna",
                // "external_symbols",
                // "args",
              ].map((field) => (
                <ToggleButton
                  key={field}
                  id={`toggle-${field}`}
                  variant="outline-secondary"
                  size="sm"
                  value={field}
                  className="d-flex align-items-center justify-content-center"
                >
                  {field.replace("_", " ")}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>

          <hr className="my-1 opacity-10" />

          {/* Sectie: Match Logic */}
          <div className="d-flex align-items-center justify-content-between">
            <Form.Label className="fw-bold mb-0 small text-uppercase text-secondary">
              Match logic
            </Form.Label>
            <ToggleButtonGroup
              type="radio"
              name="matchLogic"
              value={matchLogic}
              onChange={setMatchLogic}
              size="sm"
            >
              {["any", "all"].map((mode) => (
                <ToggleButton
                  key={mode}
                  id={`logic-${mode}`}
                  value={mode}
                  variant="outline-secondary"
                  className="px-4"
                >
                  {mode.toUpperCase()}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
        </Stack>
      </Card.Body>
    </Card>
  );
}
