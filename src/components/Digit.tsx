import { useState, useEffect } from "react";

export default function Digit({ char, delay }: { char: string; delay: number }) {
  const [prev, setPrev] = useState(char);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (char !== prev) {
      setRolling(true);
      const t = setTimeout(() => {
        setPrev(char);
        setRolling(false);
      }, 420);
      return () => clearTimeout(t);
    }
  }, [char]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className={`digit${rolling ? " rolling" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      <span className="digit-face current">{char}</span>
      <span className="digit-face previous">{prev}</span>
    </span>
  );
}
