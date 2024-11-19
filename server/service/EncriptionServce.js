const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
dotenv.config();
const IncomingSecretKey = `${process.env.INCOMING_MESSAGE}`;
const StorageSecretKey = `${process.env.STORAGE_SECRETE_KEY}`;
const OutGoingKey = `${process.env.TRANSIT_SECERETE_KEY}`;
const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
const DecryptIncomingMessage = (CipherText) => {
  if (CipherText?.trim() == "") {
    return "";
  }
  try {
    const decrypted = CryptoJS.AES.decrypt(
      CipherText,
      CryptoJS.enc.Utf8.parse(IncomingSecretKey),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const plainText = decrypted.toString(CryptoJS.enc.Utf8);
    return plainText;
  } catch (error) {
    console.log(error);
    return "";
  }
};
const EncryptMessageToStore = (plainText) => {
  console.log("Plain Text = ", plainText);
  if (plainText.trim() == "") {
    return "";
  }
  var ciphertext = CryptoJS.AES.encrypt(
    plainText,
    CryptoJS.enc.Utf8.parse(StorageSecretKey),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
  console.log("Cipher Text = ", ciphertext);
  return ciphertext;
};
const DecryptStoredMessage = (CipherText) => {
  console.log("Stored Message : ", CipherText);
  if (CipherText.trim() == "") {
    return "";
  }
  try {
    const decrypted = CryptoJS.AES.decrypt(
      CipherText,
      CryptoJS.enc.Utf8.parse(StorageSecretKey),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const planText = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("Stored Plain Text : ", planText);
    return planText;
  } catch (error) {
    console.log(error);
    return "";
  }
};
const EncryptToClient = (plainText) => {
  console.log("Out Going Plain Text = ", plainText);
  if (plainText.trim() == "") {
    return "";
  }
  var ciphertext = CryptoJS.AES.encrypt(
    plainText,
    CryptoJS.enc.Utf8.parse(OutGoingKey),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
  console.log("Out Going Cipher Text = ", ciphertext);
  return ciphertext;
};
module.exports = {
  DecryptIncomingMessage,
  EncryptMessageToStore,
  DecryptStoredMessage,
  EncryptToClient,
};
