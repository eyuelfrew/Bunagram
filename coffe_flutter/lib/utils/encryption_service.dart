import 'package:encrypt/encrypt.dart';

class EncryptionService {
  static final Key _key = Key.fromUtf8('12345ABCDE67890FGHIJKLQRSTUVWXYZ');
  static final IV _iv = IV.fromUtf8('1234567890123456');
  static final Key _toServer = Key.fromUtf8('LKJHGFDSAQWERTYUIOPZXCVBNMASDF12');
  static final Key _transitkey =
      Key.fromUtf8('QAZWSXEDCRFVTGBYHNUJMIKOLP123456');
  static String encryptMessage(String plainText) {
    if (plainText == "") {
      return "";
    }
    try {
      final encrypter =
          Encrypter(AES(_toServer, mode: AESMode.cbc, padding: 'PKCS7'));
      final encrypted = encrypter.encrypt(plainText, iv: _iv);
      return encrypted.base64;
    } catch (error) {
      print("Error Encrypting $error");
      return "";
    }
  }

  static String decrypt(String encryptedText) {
    try {
      final encrypter =
          Encrypter(AES(_key, mode: AESMode.cbc, padding: 'PKCS7'));
      final decrypted = encrypter.decrypt64(encryptedText, iv: _iv);
      return decrypted;
    } catch (error) {
      print('Error All Message decryption: $error');
      return "";
    }
  }

  static String decryptIncoming(String cypherText) {
    try {
      final encrypter =
          Encrypter(AES(_transitkey, mode: AESMode.cbc, padding: 'PKCS7'));
      final plainText = encrypter.decrypt64(cypherText, iv: _iv);
      return plainText;
    } catch (error) {
      print('Error Incoming decryption: $error');
      return "";
    }
  }
}
