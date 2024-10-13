const CryptoJS = require("crypto-js");

class Encryption {
  constructor(transite_key, storage_enc_key, backto_client_key) {
    this.transite_key = transite_key;
    this.storage_enc_key = storage_enc_key;
    this.backto_client_key = backto_client_key;
  }

  // Decrypt single message sent from client side
  decryptIncomingSingleMessage(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.transite_key);
    const originalMessage = bytes.toString(CryptoJS.enc.Utf8);

    if (!originalMessage || originalMessage.length === 0) {
      throw new Error("Decryption failed, invalid cipher or key!");
    }

    return originalMessage;
  }

  // Encrypt message before storing to database
  encryptForStorage(plainText) {
    const cipherText = CryptoJS.AES.encrypt(
      plainText,
      this.storage_enc_key
    ).toString();
    return cipherText;
  }

  //decrypt stored message
  decrypteStoredMessage(CipherText) {
    const bytes = CryptoJS.AES.decrypt(CipherText, this.storage_enc_key);
    const originalMessage = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalMessage || originalMessage.length === 0) {
      throw new Error("Decryption failed, invalid cipher or key!");
    }
    return originalMessage;
  }

  // encrypt single message for sending it to each users
  encryptSingleMessage(PlainText) {
    return CryptoJS.AES.encrypt(PlainText, this.backto_client_key).toString();
  }
}

module.exports = Encryption;
