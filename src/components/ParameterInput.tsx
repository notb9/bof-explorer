import { useId } from "react";
import { Form, InputGroup } from "react-bootstrap";
import type { BofArg } from "../types";
import type { UseFormRegister, FieldError } from "react-hook-form";
import Markdown from "react-markdown";
import { getValidationRules } from "../utils/validation";

type ParameterInputProps = {
  param: BofArg;
  register: UseFormRegister<Record<string, unknown>>;
  error?: FieldError;
};

export function ParameterInput({
  param,
  register,
  error,
}: ParameterInputProps) {
  let input = null;
  const id = useId();

  const rules = getValidationRules(param);

  switch (param.type) {
    case "AnsiString":
    case "UnicodeString":
      input = (
        <Form.Control
          type="text"
          placeholder={
            param.default === "" && !param.required
              ? '"<empty string>"'
              : param.name
          }
          defaultValue={param.default}
          id={id}
          {...register(param.name, rules)}
        />
      );
      break;

    case "Short":
    case "Int":
      input = (
        <Form.Control
          type="number"
          step={1}
          placeholder={param.name}
          defaultValue={param.default}
          id={id}
          {...register(param.name, rules)}
        />
      );
      break;

    case "Binary":
      input = (
        <Form.Control
          type="file"
          id={id}
          multiple={false}
          {...register(param.name, { required: param.required })}
        />
      );
      break;

    default:
      input = <h1>Error…</h1>;
  }

  const lookup = {
    AnsiString: "z",
    UnicodeString: "Z",
    Short: "s",
    Int: "i",
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label style={{ textTransform: "capitalize", fontWeight: "bold" }}>
        {param.name}
        {param.required && "*"}
      </Form.Label>

      <InputGroup>
        {param.type !== "Binary" && (
          <InputGroup.Text>{lookup[param.type]}</InputGroup.Text>
        )}
        {input}
      </InputGroup>

      {error && <p className="text-danger small">{error.message}</p>}

      <Form.Text>
        {param.description && <Markdown>{param.description}</Markdown>}
      </Form.Text>
    </Form.Group>
  );
}
