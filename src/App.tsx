import { useState, useEffect, useRef } from "react";
import * as OTPAuth from "otpauth";

import Setup from "./components/Setup";
import DisplayCode from "./components/DisplayCode";
import TockGlyph from "./components/TockGlyph";
import Welcome from "./components/Welcome";

import { decryptSecret, getSecret } from "./utils";

type Screen = "welcome" | "setup" | "code";

export default function App() {
  const [secret, setSecret] = useState<number[] | null>(null);
  const [screen, setScreen] = useState<Screen>(secret ? "code" : "welcome");
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
    if (screen != "code") return;

    (async () => {
      const res = await getSecret();
      setSecret(res);
    })()
  }, [screen])

  useEffect(() => {
    (async () => {
      if (screen !== "code") {
        return;
      }

      if (!secret) {
        return;
      }

      const decryptedSecret = await decryptSecret(secret);

      const totp = new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromBase32(decryptedSecret),
        digits: 6,
        period: 30,
      });
      totpRef.current = totp;

      const tick = () => setCode(totp.generate());
      tick();

      const interval = setInterval(tick, 1000);
      return () => clearInterval(interval);
    })()
  }, [secret, screen]);

  const handleReset = async () => {
    await chrome.storage.local.remove("secret");
    await chrome.storage.local.remove("loggedIn");
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
          {screen === "setup" && <Setup onComplete={() => go("code")} onBack={() => go("welcome")} />}
          {screen === "code" && <DisplayCode code={code} onReset={handleReset} />}
        </div>
      </div>
    </div>
  );
}

