export const ENCRYPTION_KEY = "3Yfkj/D3xU9sh4f1hh5DsHH52AEkXfN7q8LN0oK7+xI=";
export class CryptoService {
  private static getKey(password: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
  }

  private static async generateKey(
    password: string,
    salt: Uint8Array
  ): Promise<CryptoKey> {
    const baseKey = await this.getKey(password);
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  static async encrypt(data: string, password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.generateKey(password, salt);

    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      new TextEncoder().encode(data)
    );

    const encryptedArray = new Uint8Array(encryptedContent);
    const resultArray = new Uint8Array(
      salt.length + iv.length + encryptedArray.length
    );
    resultArray.set(salt, 0);
    resultArray.set(iv, salt.length);
    resultArray.set(new Uint8Array(encryptedContent), salt.length + iv.length);

    return btoa(String.fromCharCode(...resultArray));
  }

  static async decrypt(
    encryptedData: string,
    password: string
  ): Promise<string> {
    const encryptedArray = new Uint8Array(
      atob(encryptedData)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    const salt = encryptedArray.slice(0, 16);
    const iv = encryptedArray.slice(16, 28);
    const data = encryptedArray.slice(28);

    const key = await this.generateKey(password, salt);

    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      data
    );

    return new TextDecoder().decode(decryptedContent);
  }
}
