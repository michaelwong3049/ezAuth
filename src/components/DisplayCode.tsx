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
  const [menuOpen, setMenuOpen] = useState(false);
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
      <div className="acct">
        <div className="acct-row">
          <div className="acct-badge"><span>C</span></div>
          <div>
            <div className="acct-name">CUNY Portal</div>
            <div className="acct-hint">student@login.cuny.edu</div>
          </div>
          <button className="menu-btn" aria-label="Menu" onClick={() => setMenuOpen(v => !v)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="3" cy="7" r="1.2" fill="currentColor" />
              <circle cx="7" cy="7" r="1.2" fill="currentColor" />
              <circle cx="11" cy="7" r="1.2" fill="currentColor" />
            </svg>
          </button>
          {menuOpen && (
            <div className="acct-menu" onMouseLeave={() => setMenuOpen(false)}>
              <button className="menu-item danger" onClick={() => { setMenuOpen(false); onReset(); }}>
                Remove account
              </button>
            </div>
          )}
        </div>
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

      <div className="footer-row">
        <span className="muted">Refreshes in {Math.ceil(timeLeft)}s</span>
        <button className="linkish" onClick={() => setTimeLeft(PERIOD - (Math.floor(Date.now() / 1000) % PERIOD))}>
          Regenerate
        </button>
      </div>
    </div>
  );
}
