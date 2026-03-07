export type BofArgType =
  | "AnsiString"
  | "UnicodeString"
  | "Short"
  | "Binary"
  | "Int";

export type BofArg = {
  name: string;
  description: string;
  type: BofArgType;
  required: boolean;
  default?: string | number;
  validator?: string | string[];
  validator_type?: "regex" | "minmax" | "min" | "max" | "choice";
};

export type Bof = {
  name: string;
  description: string;
  args: BofArg[];
  code: string;
  cna: string;
  external_symbols: string[];
  bin_path: string;
  src_path: string;
  url: string;
  kit: string;
};

export type BofData = {
  bofs: Bof[];
  kit: string;
  url: string;
  branch: string;
};
