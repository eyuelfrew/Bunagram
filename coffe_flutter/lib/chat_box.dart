import 'package:bunaram_ap/service/api_service.dart';
import 'package:bunaram_ap/utils/encryption_service.dart';
import 'package:flutter/material.dart';

class ChatBox extends StatefulWidget {
  final String userName;
  final String conversationId;
  final String reciverId;

  const ChatBox(
      {super.key,
      required this.userName,
      required this.conversationId,
      required this.reciverId});

  @override
  // ignore: library_private_types_in_public_api
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatBox> {
  List<Map<String, dynamic>> messages = [];
  bool isLoading = true;
  final ScrollController _scrollController = ScrollController();
  Map<String, dynamic>? _repliedMessage;
  @override
  void initState() {
    super.initState();
    fetchMessages();
  }

  void _scrollToEnd() {
    if (_scrollController.hasClients) {
      _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
    }
  }

  Future<void> fetchMessages() async {
    try {
      var dio = ApiService.getDioInstance();
      final response = await dio
          .post('https://www.chatapp.welllaptops.com/api/all-messages', data: {
        'reciver_id': widget.reciverId,
      });
      if (response.statusCode == 200) {
        setState(() {
          messages = List<Map<String, dynamic>>.from(response.data);
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
      // ignore: avoid_print
      print('Error fetching messages: $e');
    }
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

  void _deleteChat() {
    _clearChatHistory();
    Navigator.pop(context);
  }

  void _replyToMessage(Map<String, dynamic> message) {
    setState(() {
      _repliedMessage = message;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            const CircleAvatar(
              backgroundImage: AssetImage('assets/images/userpic.png'),
              radius: 20,
            ),
            const SizedBox(width: 8),
            Text(widget.userName, style: const TextStyle(fontSize: 16)),
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
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                  value: 'Block User', child: Text('Block User')),
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
                if (_repliedMessage != null)
                  Container(
                    color: Colors.grey[200],
                    padding: const EdgeInsets.all(8),
                    child: Row(
                      children: [
                        const Icon(Icons.reply, color: Colors.blue),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            EncryptionService.decrypt(_repliedMessage!['text']),
                            style: const TextStyle(
                                fontSize: 14, fontStyle: FontStyle.italic),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 1,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () {
                            setState(() {
                              _repliedMessage =
                                  null; // Remove the reply preview
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                Expanded(
                  child: messages.isEmpty
                      ? const Center(child: Text("No messages yet"))
                      : ListView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.all(16),
                          itemCount: messages.length,
                          itemBuilder: (context, index) {
                            final message = messages[index];
                            final bool isSender =
                                message['msgByUserId'] == widget.reciverId;
                            print(isSender);
                            print("Logged In User === ${widget.reciverId}");

                            return GestureDetector(
                              onTap: () {
                                showMenu(
                                  context: context,
                                  position:
                                      RelativeRect.fromLTRB(100, 100, 0, 0),
                                  items: [
                                    PopupMenuItem(
                                      value: 'select',
                                      child: const Text('Select Message'),
                                      onTap: () {
                                        // Logic to select a message
                                      },
                                    ),
                                    PopupMenuItem(
                                      value: 'reply',
                                      child: const Text('Reply'),
                                      onTap: () {
                                        setState(() {
                                          _repliedMessage =
                                              message; // Save the message to reply to
                                        });
                                      },
                                    ),
                                  ],
                                );
                              },
                              child: Dismissible(
                                key: Key(message['_id']),
                                direction: isSender
                                    ? DismissDirection
                                        .endToStart // Slide left for sender
                                    : DismissDirection
                                        .startToEnd, // Slide right for receiver
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
                                  // if (true &&
                                  //     direction ==
                                  //         DismissDirection.startToEnd) {
                                  setState(() {
                                    _repliedMessage = message;
                                  });
                                  //   return false;
                                  // }
                                  // else{

                                  // }
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
                                            onTap: () {
                                              // Optionally scroll to or navigate to the replied message
                                            },
                                            child: Container(
                                              padding: const EdgeInsets.all(8),
                                              decoration: const BoxDecoration(
                                                  color: Colors.black54),
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
                                            EncryptionService.decrypt(
                                                message['text']),
                                            style: TextStyle(
                                              fontSize: 16,
                                              color: isSender
                                                  ? Colors.black
                                                  : Colors.white,
                                            ),
                                          ),
                                        if (message['imageURL'] != '')
                                          Padding(
                                            padding:
                                                const EdgeInsets.only(top: 8),
                                            child: Image.network(
                                              message['imageURL'],
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
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
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
                        onPressed: () {
                          // Add sending logic here
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }
}
