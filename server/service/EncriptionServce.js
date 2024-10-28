const nacl = require("tweetnacl");
const naclUtil = require("tweetnacl-util");

// Encryption
const encryptMessage = (message) => {
  const transitKey = process.env.TRANSIT_SECERETE_KEY;
  const secretKey = naclUtil.decodeBase64(transitKey);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageUint8 = naclUtil.decodeUTF8(message);
  const box = nacl.secretbox(messageUint8, nonce, key);

  // Combine nonce and box
  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  return naclUtil.encodeBase64(fullMessage); // Base64 encoding for easier transfer
};

// Decryption
const decryptMessage = (encryptedMessage) => {
  const transitKey = process.env.TRANSIT_SECERETE_KEY;
  const secretKey = naclUtil.decodeBase64(transitKey);
  const fullMessage = naclUtil.decodeBase64(encryptedMessage);
  const nonce = fullMessage.slice(0, nacl.secretbox.nonceLength);
  const box = fullMessage.slice(nacl.secretbox.nonceLength);

  const decrypted = nacl.secretbox.open(box, nonce, secretKey);
  if (!decrypted) {
    throw new Error("Decryption failed!");
  }

  return naclUtil.encodeUTF8(decrypted);
};

const encryptMessageToStore = (message) => {
  const storageKey = process.env.STORAGE_SECRETE_KEY;
  const secreteKey = naclUtil.decodeBase64(storageKey);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageUint8 = naclUtil.decodeUTF8(message);
  const box = nacl.secretbox(messageUint8, nonce, secreteKey);

  // Combine nonce and box
  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  return naclUtil.encodeBase64(fullMessage); // Base64 encoding for easier transfer
};
/*
---- decrypt storeed message
*/
const decryptStoredMessage = (encryptedMessage) => {
  const storgeKey = process.env.STORAGE_SECRETE_KEY;
  const secretKey = naclUtil.decodeBase64(storgeKey);
  const fullMessage = naclUtil.decodeBase64(encryptedMessage);
  const nonce = fullMessage.slice(0, nacl.secretbox.nonceLength);
  const box = fullMessage.slice(nacl.secretbox.nonceLength);

  const decrypted = nacl.secretbox.open(box, nonce, secretKey);
  if (!decrypted) {
    throw new Error("Decryption failed!");
  }

  return naclUtil.encodeUTF8(decrypted);
};
/*
-- messgae to clinet 
*/
const messageEncryptToClient = (plainText) => {
  const storageKey = process.env.BACK_TO_CLIENT_KEY;
  const secreteKey = naclUtil.decodeBase64(storageKey);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageUint8 = naclUtil.decodeUTF8(plainText);
  const box = nacl.secretbox(messageUint8, nonce, secreteKey);

  // Combine nonce and box
  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  return naclUtil.encodeBase64(fullMessage);
};
function arrayToBase64(arr) {
  return Buffer.from(arr).toString("base64");
}
function base64ToArray(base64Str) {
  return Uint8Array.from(Buffer.from(base64Str, "base64"));
}
module.exports = {
  decryptMessage,
  encryptMessage,
  encryptMessageToStore,
  decryptStoredMessage,
  messageEncryptToClient,
};
// const secretKey = nacl.randomBytes(nacl.secretbox.keyLength);
// const base64Key = arrayToBase64(secretKey);
// console.log(base64Key);
