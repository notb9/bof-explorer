import Highlight from "react-highlight";
import "highlight.js/styles/atom-one-dark.css";
import "./CodeBlock.css";
import "./TerminalCommand.css";

type CodeBlockProps = {
  code: string;
  language: string;
};

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="codeblock-wrapper w-100">
      <Highlight className={`${language} codeblock-block`}>{code}</Highlight>
      <button
        className="copy-btn"
        onClick={() => navigator.clipboard.writeText(code)}
        title="Copy to clipboard"
      >
        <i className="bi bi-files"></i>
      </button>
    </div>
  );
}
