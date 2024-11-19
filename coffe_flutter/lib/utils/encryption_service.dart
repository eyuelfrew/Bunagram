import 'package:encrypt/encrypt.dart';

class EncryptionService {
  static final Key _key = Key.fromUtf8('12345ABCDE67890FGHIJKLQRSTUVWXYZ');
  static final IV _iv = IV.fromUtf8('1234567890123456');

  static String encrypt(String plainText) {
    final encrypter = Encrypter(AES(_key, mode: AESMode.cbc, padding: 'PKCS7'));
    final encrypted = encrypter.encrypt(plainText, iv: _iv);
    return encrypted.base64;
  }

  static String decrypt(String encryptedText) {
    try {
      final encrypter =
          Encrypter(AES(_key, mode: AESMode.cbc, padding: 'PKCS7'));
      final decrypted = encrypter.decrypt64(encryptedText, iv: _iv);
      return decrypted;
    } catch (error) {
      print('Error during decryption: $error');
      return "";
    }
  }
}
