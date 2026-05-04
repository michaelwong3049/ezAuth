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
const getTimeLeft = (now: number) => PERIOD - (Math.floor(now / 1000) % PERIOD);

export default function DisplayCode({ code, onReset }: Props) {
  const [now, setNow] = useState(0);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setNow(Date.now());
    };

    const timeout = setTimeout(updateTime, 0);
    const interval = setInterval(updateTime, 250);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const doCopy = useCallback(() => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(code).catch(() => undefined);
    }

    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 1400);
  }, [code]);

  const timeLeft = now === 0 ? PERIOD : getTimeLeft(now);
  const warn = timeLeft <= 5;
  const progress = timeLeft / PERIOD;

  return (
    <div className="code-screen">
      <div className="code-topbar">
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
