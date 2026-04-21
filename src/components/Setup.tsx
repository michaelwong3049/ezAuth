import { useState, useMemo } from "react";

import Arrow from "./Arrow";
import Spinner from "./Spinner";
import CheckInline from "./CheckInLine";

import { encryptSecret } from "../utils";

type SetupProps = {
  onComplete: () => void;
  onBack: () => void;
};

export default function Setup({ onComplete, onBack }: SetupProps) {
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validSecret = useMemo(
    () => /^[A-Z2-7]{16,}$/i.test(secret.replace(/\s/g, "")),
    [secret]
  );

  const handleSubmit = async () => {
    if (!validSecret) return setErr("That doesn't look like a Base32 secret. Check for typos.");
    setErr(null);
    setSubmitting(true);

    const encryptedSecret = await encryptSecret(secret.replace(/\s/g, "").toUpperCase());

    await chrome.storage.local.set({ "secret": Array.from(new Uint8Array(encryptedSecret)) });
    setTimeout(() => onComplete(), 700);
  };

  return (
    <div className="setup">
      <button className="back-btn" onClick={onBack} aria-label="Back">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M8.5 3L4.5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="setup-head">
        <h2 className="setup-title">
          Paste your <span className="serif">secret key</span>.
        </h2>
        <p className="setup-sub">
          The Base32 string from your 2FA enrollment page.
        </p>
      </div>

      <div className="setup-form">
        <div className="field">
          <label>TOTP secret</label>
          <div className={`input-wrap${validSecret ? " ok" : ""}`}>
            <input
              autoFocus
              type="password"
              placeholder="JBSWY3DP EHPK3PXP …"
              value={secret}
              onChange={(e) => setSecret(e.target.value.toUpperCase())}
              spellCheck={false}
              className="mono"
            />
            {validSecret && <CheckInline />}
          </div>
          <div className="hint">Base32 characters only (A–Z, 2–7).</div>
        </div>

        {err && <div className="err-msg">{err}</div>}
      </div>

      <div className="setup-actions">
        <button className="btn-primary" disabled={!validSecret || submitting} onClick={handleSubmit}>
          {submitting ? <Spinner /> : <><span>Save token</span><Arrow /></>}
        </button>
        <button className="btn-ghost" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
