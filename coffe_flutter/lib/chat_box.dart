// ignore_for_file: avoid_print, await_only_futures

import 'package:coffegram/auth/login_page.dart';
import 'package:coffegram/service/api_service.dart';
import 'package:coffegram/store/chats_data.dart';
import 'package:coffegram/store/reciver_data.dart';
import 'package:coffegram/store/socket_provider.dart';
import 'package:coffegram/utils/encryption_service.dart';
import 'package:coffegram/widgets/message_input_widget.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ChatBox extends StatefulWidget {
  const ChatBox({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatBox> {
  List<Map<String, dynamic>> messages = [];
  bool isLoading = true;
  bool typing = false;
  final ScrollController _scrollController = ScrollController();
  Map<String, dynamic>? _repliedMessage;
  String? token;

  get onSend => null;
  @override
  void initState() {
    setState(() {
      _repliedMessage?["_id"] = null;
      _repliedMessage?["text"] = null;
    });
    super.initState();
    fetchMessages();
    _joinRoom();
    listenForIncomingMessage();
    listenForDeletedMessage();

    listenTyping();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    socketProvider.socket?.off("new-message");
    super.dispose();
  }

  void _scrollToEnd() {
    if (_scrollController.hasClients) {
      _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
    }
  }

  void listenTyping() {
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    socketProvider.socket?.on("typing", (data) {
      setState(() {
        typing = true;
      });
    });

    socketProvider.socket?.on("stop typing", (data) {
      setState(() {
        typing = false;
      });
    });
  }

  Future<void> fetchMessages() async {
    final chatBoxProvider =
        Provider.of<ChatBoxStateProvider>(context, listen: false);
    String? receiverId = chatBoxProvider.receiverId;
    try {
      var dio = ApiService.getDioInstance();
      final response = await dio
          .post('https://chatapp.welllaptops.com/api/all-messages', data: {
        'reciver_id': receiverId,
      });
      print("response..... ${response.data}");
      if (response.statusCode == 200) {
        List<Map<String, dynamic>> decryptedMessages = [];
        for (var message in response.data) {
          String decryptedText = EncryptionService.decrypt(message['text']);
          decryptedMessages.add({
            ...message,
            'text': decryptedText,
          });
        }
        setState(() {
          messages = decryptedMessages;
          isLoading = false;
        });
        WidgetsBinding.instance.addPostFrameCallback((_) {
          _scrollToEnd();
        });
      } else {
        setState(() {
          isLoading = false;
        });
      }
    } catch (e) {
      print('Error fetching messages: $e');
    }
  }

  void _joinRoom() {
    final chatBoxProvider =
        Provider.of<ChatBoxStateProvider>(context, listen: false);

    String? conversationId = chatBoxProvider.conversationId;
    String? receiverId = chatBoxProvider.receiverId;
    final roomName = 'conversation_$conversationId';
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    socketProvider.socket?.emit('join-room', {'roomName': roomName});
    socketProvider.socket?.emit('all-seen', {
      "senderId": receiverId,
      "conversationId": conversationId,
    });
    print('Joined room: $roomName');
  }

  void listenForDeletedMessage() {
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    socketProvider.socket?.on('message-deleted', (data) {
      setState(() {
        messages = messages.where((msg) => msg['_id'] != data).toList();
      });
    });
    socketProvider.socket?.on('mutli-message-deleted', (deletedMessages) {
      setState(() {
        messages = messages
            .where((msg) => !deletedMessages.contains(msg['_id']))
            .toList();
      });
    });
  }

  Future<void> listenForIncomingMessage() async {
    final chatBoxProvider =
        Provider.of<ChatBoxStateProvider>(context, listen: false);
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    socketProvider.socket?.on("new-message", (data) async {
      final incomingMessage = data['message'];
      final cipherText = incomingMessage['text'];
      final plainText = await EncryptionService.decryptIncoming(cipherText);
      print("Plain Text = $plainText");
      if (cipherText != '') {
        incomingMessage['text'] = plainText;
        print("incoming message $incomingMessage");
      } else {
        data['message']['text'] = '';
      }
      setState(() {
        messages.add(incomingMessage);
      });
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _scrollToEnd();
      });
      socketProvider.socket?.emit('message-seen', {
        'conversationId': data['convID'],
        'messageId': data['message']['_id'],
        'senderId': data['sender_id'],
        'receiverId': chatBoxProvider.receiverId,
      });
    });
  }

  void _clearChatHistory() {
    setState(() {
      messages.clear();
    });
  }

  void _blockUser() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('User blocked')),
    );
  }

  String formatDateTime(String createdAt) {
    DateTime dateTime = DateTime.parse(createdAt);
    return DateFormat('MMMM dd, yyyy - h:mm a').format(dateTime);
  }

  Future<void> _deleteChat() async {
    final chatBoxProvider =
        Provider.of<ChatBoxStateProvider>(context, listen: false);
    final receiverProvider =
        Provider.of<ReceiverProvider>(context, listen: false);
    try {
      var dio = ApiService.getDioInstance();
      final response = await dio.post(
          'https://chatapp.welllaptops.com/api/delete-conversation',
          data: {
            'reciver_id': receiverProvider.receiver?.id,
            'conversation_id': chatBoxProvider.conversationId
          });
      print(response.data);
      print(response.statusCode);
    } catch (error) {
      print(error);
    }
    Navigator.pop(context);
  }

  void _replyToMessage(Map<String, dynamic> message) {
    print("Message ID: $message");
    setState(() {
      _repliedMessage = message;
    });
  }

  void deleteSingleMessage(message) async {
    setState(() {
      messages = messages.where((msg) => msg['_id'] != message['_id']).toList();
    });
    final chatBoxProvider =
        Provider.of<ChatBoxStateProvider>(context, listen: false);

    String? conversationId = chatBoxProvider.conversationId;
    String? receiverId = chatBoxProvider.receiverId;
    try {
      var dio = ApiService.getDioInstance();
      await dio.post(
        'https://chatapp.welllaptops.com/api/del-msg',
        data: {
          'reciver_id': receiverId,
          'conversation_id': conversationId,
          'message_id': message['_id']
        },
      );
    } catch (e) {
      print('Error deleting message: $e');
    }
  }

  void backToChatsPage() {
    final chatBoxProvider =
        Provider.of<ChatBoxStateProvider>(context, listen: false);

    String? conversationId = chatBoxProvider.conversationId;
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    socketProvider.socket?.emit("leave-room", {'roomName': conversationId});
    Navigator.pop(context);
  }

  Widget build(BuildContext context) {
    final chatBoxProvider =
        Provider.of<ChatBoxStateProvider>(context, listen: false);
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: backToChatsPage,
        ),
        title: Row(
          children: [
            const CircleAvatar(
              backgroundImage: AssetImage('assets/images/userpic.png'),
              radius: 20,
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${chatBoxProvider.userName}',
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 4),
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: typing
                      ? const Text(
                          "typing...",
                          key: ValueKey("typing"),
                          style: TextStyle(
                            fontSize: 12,
                            color: Color.fromARGB(255, 36, 8, 250),
                            fontStyle: FontStyle.italic,
                          ),
                        )
                      : const SizedBox.shrink(
                          key: ValueKey("notTyping"),
                        ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'Block User') {
                _blockUser();
              } else if (value == 'Clear History') {
                _clearChatHistory();
              } else if (value == 'Delete Chat') {
                _deleteChat();
              } else if (value == 'Profile') {
                _showProfileModal(context);
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'Profile', child: Text('Profile')),
              // const PopupMenuItem(
              //     value: 'Block User', child: Text('Block User')),
              const PopupMenuItem(
                  value: 'Clear History', child: Text('Clear History')),
              const PopupMenuItem(
                  value: 'Delete Chat', child: Text('Delete Chat')),
            ],
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Expanded(
                  child: messages.isEmpty
                      ? const Center(child: Text("No messages yet"))
                      : ListView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.all(16),
                          itemCount: messages.length,
                          itemBuilder: (context, index) {
                            final message = messages[index];
                            final chatBoxProvider =
                                Provider.of<ChatBoxStateProvider>(context,
                                    listen: false);
                            final bool isSender = message['msgByUserId'] ==
                                chatBoxProvider.receiverId;

                            return GestureDetector(
                              onTap: () {
                                showMenu(
                                  context: context,
                                  position: const RelativeRect.fromLTRB(
                                      100, 100, 0, 0),
                                  items: [
                                    const PopupMenuItem(
                                      value: 'select',
                                      child: Text('Select Message'),
                                      // onTap: () {
                                      //   // Logic to select a message
                                      // },
                                    ),
                                    PopupMenuItem(
                                      value: 'reply',
                                      child: const Text('Reply'),
                                      onTap: () {
                                        setState(() {
                                          _repliedMessage = message;
                                        });
                                      },
                                    ),
                                    PopupMenuItem(
                                      value: 'delete',
                                      child: const Text('Delete'),
                                      onTap: () {
                                        deleteSingleMessage(message);
                                      },
                                    ),
                                  ],
                                );
                              },
                              child: Dismissible(
                                key: Key(message['_id']),
                                direction: isSender
                                    ? DismissDirection.endToStart
                                    : DismissDirection.startToEnd,
                                background: Container(
                                  color: Colors.blue,
                                  alignment: Alignment.centerLeft,
                                  padding: const EdgeInsets.only(left: 16),
                                  child: const Icon(Icons.reply,
                                      color: Colors.white),
                                ),
                                secondaryBackground: Container(
                                  color: Colors.blue,
                                  alignment: Alignment.centerRight,
                                  padding: const EdgeInsets.only(right: 16),
                                  child: const Icon(Icons.reply,
                                      color: Colors.white),
                                ),
                                confirmDismiss: (direction) async {
                                  _replyToMessage(message);
                                  setState(() {
                                    _repliedMessage = message;
                                  });

                                  return false;
                                },
                                child: Align(
                                  alignment: isSender
                                      ? Alignment.centerLeft
                                      : Alignment.centerRight,
                                  child: Container(
                                    margin:
                                        const EdgeInsets.symmetric(vertical: 8),
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: isSender
                                          ? Colors.grey[300]
                                          : Colors.blue,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    constraints:
                                        const BoxConstraints(maxWidth: 250),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        if (message['replyToMessageId'] != null)
                                          GestureDetector(
                                            // onTap: () {
                                            //   // Optionally scroll to or navigate to the replied message
                                            // },
                                            child: Container(
                                              padding: const EdgeInsets.all(8),
                                              decoration: const BoxDecoration(
                                                  color: Color.fromARGB(
                                                      135, 43, 40, 40)),
                                              child: Text(
                                                EncryptionService.decrypt(
                                                    message['replyToMessageId']
                                                        ['text']),
                                                style: const TextStyle(
                                                  fontSize: 12,
                                                  color: Colors.white,
                                                  fontStyle: FontStyle.italic,
                                                ),
                                                overflow: TextOverflow.ellipsis,
                                                maxLines: 1,
                                              ),
                                            ),
                                          ),
                                        if (message['text'] != null)
                                          Text(
                                            message['text'],
                                            style: TextStyle(
                                              fontSize: 16,
                                              color: isSender
                                                  ? Colors.black
                                                  : Colors.white,
                                            ),
                                          ),
                                        if (message['imageURL'] != null &&
                                            message['imageURL'] != '')
                                          Padding(
                                            padding:
                                                const EdgeInsets.only(top: 8),
                                            child: Image.network(
                                              'https://chatapp.welllaptops.com${message['imageURL']}',
                                              height: 150,
                                              width: 150,
                                              fit: BoxFit.cover,
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                ),
                MessageInputWidget(repliedMessage: {
                  '_id': _repliedMessage?['_id'],
                  "text": _repliedMessage?['text'],
                  onSend: () {
                    setState(() {
                      _repliedMessage = null;
                    });
                  }
                })
              ],
            ),
    );
  }

  void _showProfileModal(BuildContext context) {
    // Mock Data
    final receiverProvider =
        Provider.of<ReceiverProvider>(context, listen: false);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        final receiverData = receiverProvider.receiver;

        return DraggableScrollableSheet(
          expand: false,
          builder: (context, scrollController) {
            return SingleChildScrollView(
              controller: scrollController,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircleAvatar(
                      backgroundImage: receiverData!.profilePicUrl.isNotEmpty
                          ? NetworkImage(
                              "https://chatapp.welllaptops.com${receiverData.profilePicUrl}")
                          : const AssetImage('assets/images/userpic.png')
                              as ImageProvider,
                      radius: 50,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      receiverData.name,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      receiverData.bio,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Icon(Icons.email, color: Colors.grey),
                        const SizedBox(width: 8),
                        Text(
                          receiverData.email,
                          style: const TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.person, color: Colors.grey),
                        const SizedBox(width: 8),
                        Text(
                          '@${receiverData.username}',
                          style: const TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.calendar_today, color: Colors.grey),
                        const SizedBox(width: 8),
                        Text(
                          formatDateTime(receiverData.joinedDate),
                          style: const TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: const Text("Close"),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _logout() async {
    showDialog(
      context: context,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );

    final dio = ApiService.getDioInstance();
    final cookieJar = ApiService.getCookieJarInstance();
    await cookieJar
        .loadForRequest(Uri.parse('https://chatapp.welllaptops.com'));
    try {
      var response =
          await dio.get('https://chatapp.welllaptops.com/api/logout');
      if (response.data['status'] == 1) {
        final socketProvider =
            Provider.of<SocketProvider>(context, listen: false);
        socketProvider.disconnect();
        cookieJar.deleteAll();
        final prefs = await SharedPreferences.getInstance();
        prefs.clear();
        await prefs.remove("authToken");
        if (Navigator.canPop(context)) {
          Navigator.pop(context);
        }
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
        );
      }
    } catch (err) {
      print('Error occurred: $err');
    }
  }
}
