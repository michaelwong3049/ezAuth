const iv = crypto.getRandomValues(new Uint8Array(12));
const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);

export async function encryptSecret(secret: string): Promise<ArrayBuffer> {
  try {
    const enc = new TextEncoder();
    const encodedSecret = enc.encode(secret);

    const encryptedSecret = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      encodedSecret
    );

    return encryptedSecret;
  } catch (err) {
    console.error("Error: ", err);
    throw new Error("Error in encryptSecret");
  }
}

export async function decryptSecret(secret: number[]): Promise<string> {
  try {
    const data = new Uint8Array(secret).buffer;

    const decryptedSecretBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      data
    );

    const dec = new TextDecoder();
    const decryptedSecret = dec.decode(decryptedSecretBuffer);

    return decryptedSecret;
  } catch (err) {
    console.error("Error: ", err);
    throw new Error("Error in decryptSecret");
  }
}

export async function getSecret(): Promise<number[]>{
  try {
    const result = await chrome.storage.local.get<{ secret: number[] }>("secret");
    return result.secret;
  } catch (err: any) {
    throw new Error("error here?", err);
  }
}

