import "./TerminalCommand.css";

type TerminalCommandProps = {
  content: string;
};
export function TerminalCommand({ content }: TerminalCommandProps) {
  return (
    <div className="terminal-wrapper w-100">
      <pre className="terminal-block p-4">$ {content}</pre>
      <button
        className="copy-btn"
        onClick={() => navigator.clipboard.writeText(content)}
        title="Copy to clipboard"
      >
        <i className="bi bi-files"></i>
      </button>
    </div>
  );
}
