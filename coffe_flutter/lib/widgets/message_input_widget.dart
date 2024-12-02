// ignore_for_file: library_private_types_in_public_api, avoid_print, prefer_typing_uninitialized_variables

import 'dart:async';
import 'dart:io';

import 'package:coffegram/service/api_service.dart';
import 'package:coffegram/store/chats_data.dart';
import 'package:coffegram/store/socket_provider.dart';
import 'package:coffegram/utils/encryption_service.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:emoji_picker_flutter/emoji_picker_flutter.dart';
import 'package:flutter/foundation.dart' as foundation;
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class MessageInputWidget extends StatefulWidget {
  final dynamic repliedMessage;
  final Function()? onSend;
  const MessageInputWidget({
    super.key,
    required this.repliedMessage,
    this.onSend,
  });

  @override
  _MessageInputWidgetState createState() => _MessageInputWidgetState();
}

class _MessageInputWidgetState extends State<MessageInputWidget> {
  final TextEditingController _messageController = TextEditingController();

  bool _showEmojiPicker = false;
  File? _selectedImage;
  var _stopTypingTimer;

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _selectedImage = File(pickedFile.path);
      });
      _showImageModal();
    }
  }

  void _showImageModal() {
    showDialog(
        context: context,
        builder: (context) {
          final TextEditingController _captionController =
              TextEditingController();
          return AlertDialog(
            title: const Text('Add a caption'),
            content: Column(mainAxisSize: MainAxisSize.min, children: [
              if (_selectedImage != null)
                Image.file(
                  _selectedImage!,
                  height: 150,
                  width: 150,
                  fit: BoxFit.cover,
                ),
              const SizedBox(height: 8),
              TextField(
                controller: _captionController,
                decoration: const InputDecoration(
                  hintText: "Add a caption (optional)...",
                ),
              ),
            ]),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  setState(() {
                    _selectedImage = null;
                  });
                },
                child: const Text("Cancel"),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  _sendMessageWithImage(_captionController.text);
                },
                child: const Text("Send"),
              ),
            ],
          );
        });
  }

  Future<void> _sendMessageWithImage(String? caption) async {
    final chatBoxProvider =
        Provider.of<ChatBoxStateProvider>(context, listen: false);
    String? receiverId = chatBoxProvider.receiverId;
    if (_selectedImage != null) {
      print("Image Path: ${_selectedImage!.path}");
      print("Caption: $caption");
      String fileName = _selectedImage!.path.split('/').last;
      FormData formData = FormData.fromMap({
        "reciver_id": receiverId,
        "text": caption == ""
            ? ""
            : EncryptionService.encryptMessage(caption ?? ""),
        "image": await MultipartFile.fromFile(_selectedImage!.path,
            filename: fileName),
      });
      var dio = ApiService.getDioInstance();
      final response = await dio.post(
          'https://chatapp.welllaptops.com/api/create-caption',
          data: formData);
      if (response.statusCode == 200) {
        print("Message sent successfully: ${response.data}");
      } else {
        print("Failed to send message: ${response.statusCode}");
      }
      setState(() {
        _selectedImage = null;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    print(widget.repliedMessage);
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        children: [
          if (widget.repliedMessage['_id'] != null &&
              widget.repliedMessage['text'] != null)
            Container(
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(8),
              ),
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(8),
              child: Row(
                children: [
                  const Icon(Icons.reply, color: Colors.blue),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      widget.repliedMessage['text'] ?? '',
                      style: const TextStyle(
                        fontSize: 14,
                        fontStyle: FontStyle.italic,
                        color: Colors.black87,
                      ),
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close,
                        color: Color.fromARGB(255, 35, 0, 230)),
                    onPressed: () {
                      setState(() {
                        widget.repliedMessage['_id'] = null;
                        widget.repliedMessage['text'] = null;
                      });
                    },
                  ),
                ],
              ),
            ),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.emoji_emotions_outlined),
                onPressed: () {
                  setState(() {
                    _showEmojiPicker = !_showEmojiPicker;
                  });
                },
              ),
              IconButton(
                icon: const Icon(Icons.attach_file),
                onPressed: _pickImage,
              ),
              Expanded(
                child: TextField(
                  controller: _messageController,
                  onChanged: (value) {
                    if (value.isNotEmpty) {
                      sendTypingEvent();
                    }
                  },
                  decoration: InputDecoration(
                    hintText: "Type a message...",
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.send),
                onPressed: _sendMessage,
              ),
            ],
          ),
          if (_showEmojiPicker)
            SizedBox(
              height: 250,
              child: EmojiPicker(
                onEmojiSelected: (category, emoji) {
                  setState(() {
                    _messageController.text += emoji.emoji;
                  });
                },
                config: Config(
                  height: 256,
                  checkPlatformCompatibility: true,
                  emojiViewConfig: EmojiViewConfig(
                    emojiSizeMax: 28 *
                        (foundation.defaultTargetPlatform == TargetPlatform.iOS
                            ? 1.20
                            : 1.0),
                  ),
                  swapCategoryAndBottomBar: false,
                  skinToneConfig: const SkinToneConfig(),
                  categoryViewConfig: const CategoryViewConfig(),
                  bottomActionBarConfig: const BottomActionBarConfig(),
                  searchViewConfig: const SearchViewConfig(),
                ),
              ),
            )
        ],
      ),
    );
  }

  Future<void> sendTypingEvent() async {
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    final chatBoxProvider =
        Provider.of<ChatBoxStateProvider>(context, listen: false);
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('userId');
    socketProvider.socket?.emit("typing", {
      "recevierId": chatBoxProvider.receiverId,
      "typerId": userId,
    });
    _stopTypingTimer?.cancel();
    _stopTypingTimer = Timer(const Duration(seconds: 2), () {
      sendStopTypingEvent();
    });
  }

  Future<void> sendStopTypingEvent() async {
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    final chatBoxProvider =
        Provider.of<ChatBoxStateProvider>(context, listen: false);

    socketProvider.socket?.emit(
      "stop typing",
      chatBoxProvider.receiverId,
    );
  }

  Future<void> _sendMessage() async {
    // onSend();
    widget.onSend;
    final chatBoxProvider =
        Provider.of<ChatBoxStateProvider>(context, listen: false);

    if (_messageController.text.isEmpty) return;

    final cipherText =
        EncryptionService.encryptMessage(_messageController.text);

    try {
      var dio = ApiService.getDioInstance();
      final requestData = {
        'reciver_id': chatBoxProvider.receiverId,
        'text': cipherText,
        'conversation': chatBoxProvider.conversationId,
        'replyToMessageId': widget.repliedMessage?['_id'] == ""
            ? ""
            : widget.repliedMessage?['_id'],
      };
      final response = await dio.post(
        "https://chatapp.welllaptops.com/api/create-message",
        data: requestData,
      );

      if (response.statusCode == 200) {
        _messageController.clear();
        setState(() {
          widget.repliedMessage['_id'] = null;
          widget.repliedMessage['text'] = null;
        });
      } else {
        throw Exception(
            'Failed to send message. Status: ${response.statusCode}');
      }
    } catch (error) {
      print("Error sending message: $error");
    }
  }
}
