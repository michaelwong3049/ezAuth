import { useState, useEffect, useCallback, useRef } from "react";

import CheckInline from "./CheckInLine";
import Ring from "./Ring";
import CodeBlock from "./CodeBlock";
import CopyIcon from "./CopyIcon";

type Props = {
  code: string;
  onReset: () => void;
};

const PERIOD = 30;

export default function DisplayCode({ code, onReset }: Props) {
  const [timeLeft, setTimeLeft] = useState(PERIOD - (Math.floor(Date.now() / 1000) % PERIOD));
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(PERIOD - (Math.floor(Date.now() / 1000) % PERIOD));
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const doCopy = useCallback(() => {
    try { navigator.clipboard?.writeText(code); } catch {}
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 1400);
  }, [code]);

  const warn = timeLeft <= 5;
  const progress = timeLeft / PERIOD;

  return (
    <div className="code-screen">
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 0 0" }}>
        <button className="menu-item danger" onClick={onReset}>
          Logout
        </button>
      </div>

      <div className="code-main">
        <Ring progress={progress} warn={warn} seconds={Math.ceil(timeLeft)} />
        <CodeBlock code={code || "------"} warn={warn} />
      </div>

      <button className={`copy-btn${copied ? " copied" : ""}`} onClick={doCopy}>
        <span className="copy-inner">
          {copied ? <><CheckInline /> Copied to clipboard</> : <><CopyIcon /> Copy code</>}
        </span>
      </button>

    </div>
  );
}
