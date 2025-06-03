import { handleCurionaError } from "../error";

export async function encrypt<T = unknown>(payload: T) {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encodedData = new TextEncoder().encode(JSON.stringify(payload));

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(process.env.APP_SECRET, "base64"),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    cryptoKey,
    encodedData
  );

  const data = Buffer.from(encryptedData).toString("base64");
  const initVector = Buffer.from(iv).toString("base64");

  return `${initVector}.${data}`;
}

export async function decrypt<T = unknown>(payload: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(process.env.APP_SECRET, "base64"),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const [initVector, data] = payload.split(".");
  const iv = Buffer.from(initVector, "base64");
  const encryptedData = Buffer.from(data, "base64");

  try {
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      cryptoKey,
      encryptedData
    );

    return JSON.parse(new TextDecoder().decode(decryptedData)) as T;
  } catch (error) {
    const err = handleCurionaError(error);
    console.error(err);
    return null;
  }
}
