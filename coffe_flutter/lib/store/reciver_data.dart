import 'package:flutter/material.dart';

class Receiver {
  final String id;

  final String name;
  final String bio;
  final String username;
  final String email;
  final String profilePicUrl;
  final String joinedDate;

  Receiver({
    required this.id,
    required this.name,
    required this.bio,
    required this.username,
    required this.email,
    required this.profilePicUrl,
    required this.joinedDate,
  });

  get profilePic => null;
}

class ReceiverProvider with ChangeNotifier {
  Receiver? _receiver;

  Receiver? get receiver => _receiver;

  void setReceiverDetails(String id, String name, String bio, String username,
      String email, String profilePicUrl, String joinedDate) {
    _receiver = Receiver(
      id: id,
      name: name,
      bio: bio,
      username: username,
      email: email,
      profilePicUrl: profilePicUrl,
      joinedDate: joinedDate,
    );
    notifyListeners();
  }
}
