import { useState, useEffect, useRef } from "react";
import * as OTPAuth from "otpauth";
import Setup from "./components/Setup";
import DisplayCode from "./components/DisplayCode";

import TockGlyph from "./components/TockGlyph";
import Welcome from "./components/Welcome";

type Screen = "welcome" | "setup" | "code";

export default function App() {
  const hasSecret = !!localStorage.getItem("secret");
  const [screen, setScreen] = useState<Screen>(hasSecret ? "code" : "welcome");
  const [transitionOut, setTransitionOut] = useState(false);
  const [code, setCode] = useState("");
  const totpRef = useRef<OTPAuth.TOTP | null>(null);

  const go = (next: Screen) => {
    setTransitionOut(true);
    setTimeout(() => {
      setScreen(next);
      setTransitionOut(false);
    }, 260);
  };

  useEffect(() => {
    if (screen !== "code") return;

    const secret = localStorage.getItem("secret");
    if (!secret) return;

    const totp = new OTPAuth.TOTP({
      secret: OTPAuth.Secret.fromBase32(secret),
      digits: 6,
      period: 30,
    });
    totpRef.current = totp;

    const tick = () => setCode(totp.generate());
    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [screen]);

  const handleReset = () => {
    localStorage.removeItem("secret");
    localStorage.removeItem("loggedIn");
    totpRef.current = null;
    go("setup");
  };

  return (
    <div className="popup">
      <div className="popup-header">
        <div className="brand">
          <TockGlyph size={18} />
          <span className="brand-name">Tock</span>
        </div>
        <div className="brand-sub">
          <span className="sync-dot" />
          synced
        </div>
      </div>

      <div className="popup-body">
        <div className={`screen-wrap${transitionOut ? " out" : ""}`} key={screen}>
          {screen === "welcome" && <Welcome onContinue={() => go("setup")} />}
          {screen === "setup"   && <Setup onComplete={() => go("code")} onBack={() => go("welcome")} />}
          {screen === "code"    && <DisplayCode code={code} onReset={handleReset} />}
        </div>
      </div>
    </div>
  );
}

