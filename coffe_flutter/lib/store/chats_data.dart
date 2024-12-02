import 'package:flutter/material.dart';

class ChatBoxStateProvider extends ChangeNotifier {
  String? _conversationId;
  String? _receiverId;
  String? _userName;

  String? get conversationId => _conversationId;
  String? get receiverId => _receiverId;
  String? get userName => _userName;

  // Set values in the provider
  void setChatDetails(
      String userName, String conversationId, String receiverId) {
    _conversationId = conversationId;
    _receiverId = receiverId;
    _userName = userName;
    notifyListeners(); // Notify listeners when data changes
  }

  // Clear values when the chat box is closed or reset
  void clearChatBoxData() {
    _conversationId = null;
    _receiverId = null;
    _userName = null;
    notifyListeners();
  }
}
