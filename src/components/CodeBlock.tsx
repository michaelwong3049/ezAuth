import Digit from "./Digit";

export default function CodeBlock({ code, warn }: { code: string; warn: boolean }) {
  const digits = code.split("");
  return (
    <div className={`code-block${warn ? " warn" : ""}`}>
      <div className="code-group">
        {digits.slice(0, 3).map((d, i) => <Digit key={`a${i}`} char={d} delay={i * 40} />)}
      </div>
      <div className="code-sep" />
      <div className="code-group">
        {digits.slice(3).map((d, i) => <Digit key={`b${i}`} char={d} delay={(i + 3) * 40} />)}
      </div>
    </div>
  );
}

