import * as OTPAuth from "otpauth";

async function createIvAndKey() {
  const res = await chrome.storage.local.get<{ iv?: number[]; key?: JsonWebKey }>(["iv", "key"]);
  if (res.iv && res.key) {
    const iv = new Uint8Array(res.iv);
    const key = await crypto.subtle.importKey("jwk", res.key, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
    return { iv, key };
  }
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const exportedKey = await crypto.subtle.exportKey("jwk", key);
  await chrome.storage.local.set({ iv: Array.from(iv), key: exportedKey });
  return { iv, key };
}

async function getTOTPCode(): Promise<string | null> {
  const result = await chrome.storage.local.get<{ secret: number[] }>("secret");
  if (!result.secret) return null;

  const { iv, key } = await createIvAndKey();
  const data = new Uint8Array(result.secret).buffer;
  const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  const decryptedSecret = new TextDecoder().decode(decryptedBuffer);

  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(decryptedSecret),
    digits: 6,
    period: 30,
  });

  return totp.generate();
}

function findTOTPInput(): HTMLInputElement | null {
  const selectors = [
    'input[autocomplete="one-time-code"]',
    'input[name*="otp" i]',
    'input[name*="totp" i]',
    'input[name*="passcode" i]',
    'input[name*="token" i]',
    'input[id*="otp" i]',
    'input[id*="totp" i]',
    'input[placeholder*="enter code" i]',
    'input[placeholder*="verification code" i]',
    'input[placeholder*="authenticator" i]',
    'input[maxlength="6"][type="text"]',
    'input[maxlength="6"][type="number"]',
    'input[maxlength="6"]:not([type="password"])',
  ];

  for (const selector of selectors) {
    const input = document.querySelector<HTMLInputElement>(selector);
    if (input && input.offsetParent !== null) return input;
  }
  return null;
}

function fillAndSubmit(input: HTMLInputElement, code: string) {
  input.focus();

  // Trigger React/framework synthetic input handling
  const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  nativeSetter?.call(input, code);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  input.dispatchEvent(new Event("blur", { bubbles: true }));

  // Wait for Oracle JET / Knockout to sync the observable before submitting
  setTimeout(() => {
    // Oracle JET: dispatch ojAction on the oj-button element
    const ojBtn = document.querySelector<HTMLElement>("oj-button");
    if (ojBtn) {
      ojBtn.dispatchEvent(new CustomEvent("ojAction", { bubbles: true, cancelable: true }));
      // Also click the inner button as a fallback
      const innerBtn = ojBtn.querySelector<HTMLElement>("button");
      innerBtn?.click();
      return;
    }

    // Generic fallback: Enter key then submit button click
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));

    const submitBtn =
      document.querySelector<HTMLElement>("button.oj-button-button")
      ?? document.querySelector<HTMLElement>('button[type="submit"], input[type="submit"]');
    submitBtn?.click();
  }, 500);
}

let filled = false;

async function tryAutoFill() {
  if (filled) return;
  const input = findTOTPInput();
  if (!input) return;

  const code = await getTOTPCode();
  if (!code) return;

  filled = true;
  fillAndSubmit(input, code);
}

tryAutoFill();

// Watch for dynamically rendered TOTP fields (SPAs)
const observer = new MutationObserver(() => {
  if (!filled) tryAutoFill();
  else observer.disconnect();
});

observer.observe(document.documentElement, { childList: true, subtree: true });
