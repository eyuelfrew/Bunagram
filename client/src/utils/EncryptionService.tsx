import CryptoJS from "crypto-js";
const secretKeyToServer = import.meta.env.VITE_TO_SERVER;
const secretKeyFromServer = `${import.meta.env.VITE_STORAGE_KEY}`;
const secrteTrnasitKey = `${import.meta.env.VITE_TRANSIT_KEY}`;
const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
export const EncryptMessageToServer = (plainText: string): string => {
  if (plainText.trim() == "") {
    return "";
  }
  try {
    var ciphertext = CryptoJS.AES.encrypt(
      plainText,
      CryptoJS.enc.Utf8.parse(secretKeyToServer),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return ciphertext.toString();
  } catch (error) {
    console.log(error);
    return "";
  }
};
export const DecryptAllMessage = (cipherText: string): string => {
  if (cipherText.trim() == "") {
    return "";
  }
  try {
    const decrypted = CryptoJS.AES.decrypt(
      cipherText,
      CryptoJS.enc.Utf8.parse(secretKeyFromServer),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const DecryptIncomingMessage = (cipherText: string): string => {
  if (cipherText?.trim() == "") {
    return "";
  }
  try {
    const decrypted = CryptoJS.AES.decrypt(
      cipherText,
      CryptoJS.enc.Utf8.parse(secrteTrnasitKey),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.log(error);
    return "";
  }
};
