export default function Ring({ progress, warn, seconds }: { progress: number; warn: boolean; seconds: number }) {
  const R = 42;
  const C = 2 * Math.PI * R;

  const offset = C * (1 - progress);
  return (
    <div className={`ring-wrap${warn ? " warn" : ""}`}>
      <svg width="110" height="110" viewBox="0 0 110 110" className="ring-svg">
        <circle cx="55" cy="55" r={R} fill="none" stroke="var(--rule)" strokeWidth="4" />
        <circle
          cx="55" cy="55" r={R}
          fill="none"
          stroke={warn ? "var(--warn)" : "var(--accent)"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke 0.25s ease" }}
        />
      </svg>
      <div className={`ring-num${warn ? " pulse" : ""}`}>{seconds}</div>
    </div>
  );
}

