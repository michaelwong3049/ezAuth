import { useState, useEffect } from "react";

export default function Digit({ char, delay }: { char: string; delay: number }) {
  const [settledChar, setSettledChar] = useState(char);
  const rolling = char !== settledChar;

  useEffect(() => {
    if (!rolling) {
      return;
    }

    const timer = setTimeout(() => {
      setSettledChar(char);
    }, 420);

    return () => clearTimeout(timer);
  }, [char, rolling]);

  return (
    <span className={`digit${rolling ? " rolling" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      <span className="digit-face current">{char}</span>
      <span className="digit-face previous">{settledChar}</span>
    </span>
  );
}
