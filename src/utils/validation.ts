import type { BofArg } from "../types";

export function getValidationRules(param: BofArg) {
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
