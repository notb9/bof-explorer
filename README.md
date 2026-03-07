# Bof Explorer

A fast, completely client-side running React app for exploring and working with Beacon Object Files (BOFs). Designed for operators who want a quick way to inspect BOF metadata, understand parameter structures, and generate packed argument buffers.

## Kits

Currently the following kits have been added:

1. [TrustedSec - Situational Awareness](https://github.com/trustedsec/CS-Situational-Awareness-BOF)
2. [REDMED-X - Operators Kit](https://github.com/REDMED-X/OperatorsKit)

## Data Format

The kits should be supplied as json files in the `public/` directory. In addition, the file must be added to the `files` variable in the `src/hooks/useBofs.ts` file. The file must have the structure below.

```json
{
  "kit": "<name>",
  "url": "<github url>",
  "branch": "<git branch>",
  "bofs": [
    {
      "name": "<name>",
      "description": "<description>",
      "cna": "<cna code>",
      "code": "<source code>",
      "external_symbols": [
        "dll$fn", ...
      ]
      "parameters": [
        {
          "name": "<name>",
          "description": "<description>",
          "type": "AnsiString|UnicodeString|Short|Int|Binary",
          "required": "true|false",
          "default": "<value: optional>",
          "validator": "<regex|min-max|number|pipe seperated list>",  // Can also be a list in case of validator_type = choices
          "validator_type": "regex|minmax|choice|min|max"
        }, ...
      ]
    },...
  ]
}
```
