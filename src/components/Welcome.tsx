import TockGlyph from "./TockGlyph";
import Arrow from "./Arrow";

export default function Welcome({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="welcome">
      <div className="welcome-hero">
        <div className="welcome-rings">
          <span className="pulse-ring r1" />
          <span className="pulse-ring r2" />
          <span className="pulse-ring r3" />
          <span className="welcome-mark">
            <TockGlyph size={28} />
          </span>
        </div>
      </div>

      <div style={{ padding: "2px 0 0" }}>
        <h1 className="display-heading">
          <span className="cuny-badge">CUNY</span> <span className="serif">Two-factor,</span><br />
          one click away.
        </h1>
        <p className="lede">
          Tock pins your 2FA codes to the browser. No more reaching for a phone mid-login.
        </p>
      </div>

      <ul className="welcome-list">
        <li><span className="wl-num">01</span><span>Paste your TOTP secret once.</span></li>
        <li><span className="wl-num">02</span><span>Codes refresh every 30 seconds, locally.</span></li>
        <li><span className="wl-num">03</span><span>Nothing leaves your device.</span></li>
      </ul>

      <div className="welcome-actions">
        <button className="btn-primary" onClick={onContinue}>
          Get started
          <Arrow />
        </button>
        <p className="fineprint">Takes about a minute.</p>
      </div>
    </div>
  );
}
