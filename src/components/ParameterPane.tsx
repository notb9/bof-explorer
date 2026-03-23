import { useState, useId } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import type { Bof, BofArg } from "../types";
import { TerminalCommand } from "./TerminalCommand";
import { useForm } from "react-hook-form";
import type { UseFormRegister, FieldError } from "react-hook-form";
import { BinaryEncoder, bufferToHex } from "../utils/beacon_generate";
import Markdown from "react-markdown";

function buildRules(param: BofArg) {
  const rules: Record<string, unknown> = {};

  if (param.required) {
    rules.required = `${param.name} is required`;
  }

  if (param.type === "Int" || param.type === "Short") {
    rules.valueAsNumber = true;
    if (param.type === "Int") {
      const min = -2147483648;
      const max = 2147483647;
      rules.min = { value: min, message: `${param.name} must be >= ${min}` };
      rules.max = { value: max, message: `${param.name} must be <= ${max}` };
    } else {
      const min = -32768;
      const max = 32767;
      rules.min = { value: min, message: `${param.name} must be >= ${min}` };
      rules.max = { value: max, message: `${param.name} must be <= ${max}` };
    }
  }

  if (!param.validator) {
    return rules;
  }

  switch (param.validator_type) {
    case "regex":
      rules.pattern = {
        value: new RegExp(param.validator as string),
        message: `${param.name} is invalid`,
      };
      break;

    case "minmax": {
      const [min, max] = (param.validator as string).split("|").map(Number);
      rules.min = { value: min, message: `${param.name} must be >= ${min}` };
      rules.max = { value: max, message: `${param.name} must be <= ${max}` };
      break;
    }

    case "min":
      rules.min = {
        value: Number(param.validator),
        message: `${param.name} must be >= ${param.validator}`,
      };
      break;

    case "max":
      rules.max = {
        value: Number(param.validator),
        message: `${param.name} must be <= ${param.validator}`,
      };
      break;

    case "choice": {
      const allowed = Array.isArray(param.validator)
        ? param.validator
        : String(param.validator).split("|");
      rules.validate = (value: string) =>
        allowed.includes(value) ||
        `${param.name} must be one of: ${allowed.join(", ")}`;
      break;
    }
  }

  return rules;
}

type ParameterInputProps = {
  param: BofArg;
  register: UseFormRegister<Record<string, unknown>>;
  error?: FieldError;
};

function ParameterInput({ param, register, error }: ParameterInputProps) {
  let input = null;
  const id = useId();

  const rules = buildRules(param);

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

async function packParams(params: BofArg[], data: DynamicFormValues) {
  const packed_args = new BinaryEncoder();

  for (const param of params) {
    switch (param.type) {
      case "AnsiString":
        packed_args.writeStringWithLength(data[param.name] as string);
        break;
      case "UnicodeString":
        packed_args.writeStringUtf16LEWithLength(data[param.name] as string);
        break;
      case "Short":
        packed_args.writeInt16(data[param.name] as number);
        break;
      case "Int":
        packed_args.writeInt32(data[param.name] as number);
        break;
      case "Binary": {
        const fileList = data[param.name] as FileList;
        if (fileList instanceof FileList) {
          const buf = await fileList[0].arrayBuffer();
          packed_args.writeBytes(buf);
        } else {
          throw new Error(`Binary parameter ${param.name} must be a File`);
        }
        break;
      }
      default:
        throw new Error(`Unknown parameter type: ${param.type}`);
    }
  }

  return packed_args.finalize();
}

type ParameterPaneProps = {
  bof: Bof;
};

type DynamicFormValues = Record<string, unknown>;


// TODO: Unregister the form on change of bof
export function ParameterPane({ bof }: ParameterPaneProps) {
  const [command, setCommand] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DynamicFormValues>({ mode: "onTouched" });

  const onSubmit = (data: DynamicFormValues) => {
    packParams(bof.args, data).then((val) => {
      setCommand(
        'CoffLoader64.exe go "' +
          bof.bin_path +
          '" "' +
          bufferToHex(val) +
          '"',
      );
    });
  };

  return (
    <>
      {bof.args.length > 0 && (
        <Form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          {bof.args.map((item) => (
            <ParameterInput
              key={item.name}
              param={item}
              register={register}
              error={errors[item.name] as FieldError | undefined}
            />
          ))}

          <Button type="submit">Generate Command</Button>
        </Form>
      )}
      {bof.args.length === 0 && (
        <>
          <TerminalCommand
            content={'CoffLoader64.exe go "' + bof.bin_path + "\" ''"}
          />
        </>
      )}
      {command && bof.args.length > 0 && (
        <>
          <hr />
          <TerminalCommand content={command} />
        </>
      )}
      {!command && bof.args.length > 0 && (
        <>
          <hr />
          <span className="text-muted small fst-italic">
            Fill in the above form to generate a CoffLoader one-liner.
          </span>
        </>
      )}
    </>
  );
}
