import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import type { Bof, BofArg } from "../types";
import { TerminalCommand } from "./TerminalCommand";
import { useForm } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import { BinaryEncoder, bufferToHex } from "../utils/argumentPacking";
import { ParameterInput } from "./ParameterInput";
import { useUserSettings } from "../contexts/UserSettings";

/**
 * Converts a form of inputs for a Beacon Object File into a packed byte buffer.
 *
 * @param params Array of BofArg structures describing all parameters.
 * @param data Keys of records must match with `params` parameter.
 * @returns Hex string of packed arguments.
 */
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

export function ParameterPane({ bof }: ParameterPaneProps) {
  const [command, setCommand] = useState("");
  const {
    settings: { coffloaderPath, kitPaths },
  } = useUserSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DynamicFormValues>({ mode: "onTouched" });

  const onSubmit = (data: DynamicFormValues) => {
    packParams(bof.args, data).then((val) => {
      setCommand(
        `${coffloaderPath} go "${kitPaths[bof.kit]}/${bof.bin_path}" "${bufferToHex(val)}"'`,
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
            content={`${coffloaderPath} go "${kitPaths[bof.kit]}/${bof.bin_path}" ''`}
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
