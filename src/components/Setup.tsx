import { useState, useMemo } from "react";

import Arrow from "./Arrow";
import Spinner from "./Spinner";
import CheckInline from "./CheckInLine";

type SetupProps = {
  onComplete: () => void;
  onBack: () => void;
};

export default function Setup({ onComplete, onBack }: SetupProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [secret, setSecret] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validSecret = useMemo(
    () => /^[A-Z2-7]{16,}$/i.test(secret.replace(/\s/g, "")),
    [secret]
  );

  const pwValid = pw.length >= 8 && pw === pw2;

  const handleContinue = () => {
    if (!validSecret) return setErr("That doesn't look like a Base32 secret. Check for typos.");
    setErr(null);
    setStep(2);
  };

  const handleSubmit = () => {
    if (pw.length < 8) return setErr("Password needs at least 6 characters.");
    if (pw !== pw2) return setErr("Passwords don't match.");
    setErr(null);
    setSubmitting(true);
    localStorage.setItem("secret", secret.replace(/\s/g, "").toUpperCase());
    localStorage.setItem("loggedIn", "true");
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
        <div className="eyebrow">
          <span className={`step-dot${step >= 1 ? " on" : ""}`} />
          <span className={`step-dot${step >= 2 ? " on" : ""}`} />
          <span className="eyebrow-txt">{step === 1 ? "Step 1 of 2" : "Step 2 of 2"}</span>
        </div>
        <h2 className="setup-title">
          {step === 1 ? (
            <>Paste your <span className="serif">secret key</span>.</>
          ) : (
            <>Lock it with a password.</>
          )}
        </h2>
        <p className="setup-sub">
          {step === 1
            ? "The Base32 string from your 2FA enrollment page."
            : "Encrypts the secret on this device. You'll need it to reopen Tock."}
        </p>
      </div>

      <div className="setup-form">
        {step === 1 && (
          <div className="field">
            <label>TOTP secret</label>
            <div className={`input-wrap${validSecret ? " ok" : ""}`}>
              <input
                autoFocus
                type="text"
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
        )}

        {step === 2 && (
          <>
            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  autoFocus
                  type="password"
                  placeholder="At least 8 characters"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label>Confirm password</label>
              <div className={`input-wrap${pwValid ? " ok" : ""}`}>
                <input
                  type="password"
                  placeholder="Type it again"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                />
                {pwValid && <CheckInline />}
              </div>
            </div>
          </>
        )}

        {err && <div className="err-msg">{err}</div>}
      </div>

      <div className="setup-actions">
        {step === 1 ? (
          <button className="btn-primary" disabled={!validSecret} onClick={handleContinue}>
            Continue <Arrow />
          </button>
        ) : (
          <button className="btn-primary" disabled={!pwValid || submitting} onClick={handleSubmit}>
            {submitting ? <Spinner /> : <><span>Create token</span><Arrow /></>}
          </button>
        )}
        <button className="btn-ghost" onClick={() => { setStep(1); setErr(null); }} disabled={step === 1}>
          Back
        </button>
      </div>
    </div>
  );
}
