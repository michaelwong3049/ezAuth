export default function TockGlpyh({ size }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 10 L10 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 10 L13.5 11.5" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="10" r="1.1" fill="currentColor" />
    </svg>
  );
}
