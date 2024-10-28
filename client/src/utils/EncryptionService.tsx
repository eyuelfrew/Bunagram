import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
// import { Buffer } from "buffer";

// function arrayToBase64(
//   arr: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>
// ) {
//   return Buffer.from(arr).toString("base64");
// }
// function base64ToArray(
//   base64Str:
//     | WithImplicitCoercion<string>
//     | { [Symbol.toPrimitive](hint: "string"): string }
// ) {
//   return Uint8Array.from(Buffer.from(base64Str, "base64"));
// }
// Encryption
// const secretKey = nacl.randomBytes(nacl.secretbox.keyLength);
// const base64Key = arrayToBase64(secretKey);
// console.log(base64Key);
export const encryptMessage = (message: string) => {
  const transitKey = import.meta.env.VITE_TRANSIT_KEY;
  const secretKey = naclUtil.decodeBase64(transitKey);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageUint8 = naclUtil.decodeUTF8(message);
  const box = nacl.secretbox(messageUint8, nonce, secretKey);

  // Combine nonce and box
  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  return naclUtil.encodeBase64(fullMessage); // Base64 encoding for easier transfer
};

// Decryption
export const decryptMessage = (encryptedMessage: string) => {
  const storgeKey = import.meta.env.VITE_STORAGE_KEY;
  const secretKey = naclUtil.decodeBase64(storgeKey);
  const messageWithNonce = naclUtil.decodeBase64(encryptedMessage);
  const nonce = messageWithNonce.slice(0, nacl.secretbox.nonceLength);
  const message = messageWithNonce.slice(nacl.secretbox.nonceLength);

  const decrypted = nacl.secretbox.open(message, nonce, secretKey);

  if (!decrypted) {
    throw new Error("Decryption failed");
  }

  return naclUtil.encodeUTF8(decrypted);
};
export const decryptIncomingMessage = (encryptedMessage: string) => {
  const transitKey = import.meta.env.VITE_INCOMING_MESSAGE_KEY;

  if (!transitKey) {
    throw new Error("Encryption key missing from environment variables.");
  }

  const secretKey = naclUtil.decodeBase64(transitKey);
  const messageWithNonce = naclUtil.decodeBase64(encryptedMessage);

  const nonce = messageWithNonce.slice(0, nacl.secretbox.nonceLength);
  const message = messageWithNonce.slice(nacl.secretbox.nonceLength);

  const decrypted = nacl.secretbox.open(message, nonce, secretKey);

  if (!decrypted) {
    throw new Error("Decryption failed");
  }

  return naclUtil.encodeUTF8(decrypted);
};
