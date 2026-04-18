import { useState, useEffect } from "react";

type Props = {
  code: string;
}

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DisplayCode({ code }: Props) {
  const [timeLeft, setTimeLeft] = useState(30 - (Math.floor(Date.now() / 1000) % 30));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(30 - (Math.floor(Date.now() / 1000) % 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const progress = CIRCUMFERENCE * (1 - timeLeft / 30);

  return (
    <div className="flex items-center gap-4 p-8">
      <div className="relative flex items-center justify-center w-14 h-14">
        <svg className="absolute rotate-[-90deg]" width="56" height="56">
          <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="4" />
          <circle
            cx="28" cy="28" r={RADIUS}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="text-sm font-semibold text-blue-500">{timeLeft}</span>
      </div>
      <h1 className="text-blue-500 text-2xl font-bold tracking-widest">{code}</h1>
    </div>
  )
}

