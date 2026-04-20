async function createIvAndKey() {
  const res = await chrome.storage.local.get<{ iv?: number[], key?: JsonWebKey }>([ "iv", "key" ]);

  if (res.iv && res.key) {
    const iv = new Uint8Array(res.iv);
    const key = await crypto.subtle.importKey(
      "jwk",
      res.key,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    )
    return { iv, key };
  }
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const exportedKey = await crypto.subtle.exportKey("jwk",key );

  await chrome.storage.local.set({ iv: Array.from(iv), key: exportedKey });
  return { iv, key };
}

export async function encryptSecret(secret: string): Promise<ArrayBuffer> {
  const { iv, key } = await createIvAndKey();

  try {
    const enc = new TextEncoder();
    const encodedSecret = enc.encode(secret);

    const encryptedSecret = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
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
  const { iv, key } = await createIvAndKey();

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
  const result = await chrome.storage.local.get<{ secret: number[] }>("secret");
  return result.secret;
}

