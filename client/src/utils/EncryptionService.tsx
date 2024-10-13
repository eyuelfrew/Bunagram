import CryptoJS from "crypto-js";

class EncryptinService {
  private transit_key: string;
  private stored_dec_key: string;
  private incoming_message_key: string;
  constructor(
    transit_key: string,
    stored_dec_key: string,
    incoming_message_key: string
  ) {
    this.transit_key = transit_key;
    this.stored_dec_key = stored_dec_key;
    this.incoming_message_key = incoming_message_key;
  }
  /*
    -- ecrypt single message before sending to server
    */
  EncryptMessage(message: string): string {
    if (message.trim() == "") {
      return "";
    }
    return CryptoJS.AES.encrypt(message, this.transit_key).toString();
  }

  /*
    -- decrypt all messages sent as an array from the back end
    */
  DecryptMessage(cyphertext: string): string {
    if (cyphertext.trim() == "") {
      return "";
    }
    const bytes = CryptoJS.AES.decrypt(cyphertext, this.stored_dec_key);
    const originalMessage = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalMessage) {
      throw new Error("Decritpion faild. Inalid key or cipher-text");
    }
    return originalMessage;
  }
  /*
    -- derypt sinlge message sent from the server of from other end (sender)
    */
  DecryptIncomingMessage(CypherText: string): string {
    if (CypherText.trim() == "") {
      console.log("epitiy text");
      return "";
    }
    const bytes = CryptoJS.AES.decrypt(CypherText, this.incoming_message_key);
    const orgiginalMessage = bytes.toString(CryptoJS.enc.Utf8);
    if (!orgiginalMessage || orgiginalMessage.length === 0) {
      throw new Error("Error Decrypting Single Message");
    }
    return orgiginalMessage;
  }
}
export default EncryptinService;
