// ignore_for_file: use_build_context_synchronously, avoid_print, library_private_types_in_public_api

import 'dart:io';

import 'package:coffegram/chat_box.dart';
import 'package:coffegram/models/Conversation.dart';
import 'package:coffegram/service/api_service.dart';
import 'package:coffegram/store/chats_data.dart';
import 'package:coffegram/store/reciver_data.dart';
import 'package:coffegram/store/socket_provider.dart';
import 'package:coffegram/utils/encryption_service.dart';
import 'package:coffegram/widgets/side_bar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ChatsPage extends StatefulWidget {
  const ChatsPage({super.key});

  @override
  _ChatsPageState createState() => _ChatsPageState();
}

class _ChatsPageState extends State<ChatsPage> {
  String? loggedInUserId;
  List<Conversation> allConversations = [];
  List<Map<String, dynamic>> searchResults = [];
  Set<String> onlineUsers = {};
  bool isSearching = false;
  String? token;
  final TextEditingController _searchController = TextEditingController();

  @override
  @override
  void initState() {
    super.initState();
    onlineUsersSocket();
    _initialize();
    _searchController.addListener(_handleSearch);
    _loadUserId();
    listedForDeletedConversation();
  }

  @override
  void dispose() {
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    socketProvider.socket?.off("conversation");
    _searchController.removeListener(_handleSearch);
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadUserId() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      loggedInUserId = prefs.getString('userId');
    });
  }

  Future<void> listedForDeletedConversation() async {
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    socketProvider.socket?.on('con-delet', (data) async {
      await fetchConversations();
    });
  }

  Future<void> _initialize() async {
    // await _loadToken();
    await fetchConversations();
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    socketProvider.socket?.on("conversation", (data) async {
      await fetchConversations();
    });
    socketProvider.socket?.on("all-seen", (data) async {
      await fetchConversations();
    });
  }

  //load token and inititialze socket connection
  Future<void> onlineUsersSocket() async {
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);

    socketProvider.onOnlineUsersReceived = (List<String> users) {
      setState(() {
        onlineUsers = users.toSet();
      });
    };
  }

  Future<void> fetchConversations() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString("userId");

    try {
      var dio = ApiService.getDioInstance();
      final response =
          await dio.get('https://chatapp.welllaptops.com/api/conversations');

      if (response.data != null && response.data is List) {
        setState(() {
          allConversations = (response.data as List)
              .map((json) {
                final conversation = Conversation.fromJson(json);

                if (conversation.receiver.id == userId) {
                  return conversation.copyWith(
                      userDetails: conversation.sender,
                      unseenMessages: conversation.unseenMessages,
                      lastMessage: conversation.lastMessage);
                } else if (conversation.sender.id == userId) {
                  return conversation.copyWith(
                      userDetails: conversation.receiver,
                      unseenMessages: conversation.unseenMessages,
                      lastMessage: conversation.lastMessage);
                } else {
                  return null;
                }
              })
              .whereType<Conversation>()
              .toList();
        });
      } else {
        setState(() {
          allConversations = [];
        });
        print('Unexpected response format: ${response.data}');
      }
    } catch (e) {
      print('Error fetching conversations: $e');
    }
  }

  Future<void> fetchSearchResults(String query) async {
    try {
      var dio = ApiService.getDioInstance();
      final response = await dio.post(
        'https://chatapp.welllaptops.com/api/search',
        data: {'query': query},
      );
      print(response.data['data']);
      if (response.data['data'] != null && response.data['data'] is List) {
        setState(() {
          searchResults =
              List<Map<String, dynamic>>.from(response.data['data']);
        });
      } else {
        setState(() {
          searchResults = [];
        });
      }
    } catch (e) {
      print('Error fetching search results: $e');
    }
  }

  void _handleSearch() {
    final query = _searchController.text.trim();

    if (query.isEmpty) {
      setState(() {
        isSearching = false;
        searchResults = [];
      });
    } else {
      setState(() {
        isSearching = true;
      });
      fetchSearchResults(query);
    }
  }

  @override
  Widget build(BuildContext context) {
    // ignore: deprecated_member_use
    return WillPopScope(
      onWillPop: () async {
        final shouldExit = await _showExitConfirmationDialog(context);
        if (shouldExit ?? false) {
          exit(0);
        }
        return false;
      },
      child: Scaffold(
        appBar: AppBar(
          title: _buildSearchBar(),
          leading: Builder(
            builder: (BuildContext context) {
              return IconButton(
                icon: const Icon(Icons.menu),
                onPressed: () {
                  Scaffold.of(context).openDrawer();
                },
              );
            },
          ),
        ),
        drawer: const SideBar(),
        body: isSearching
            ? _buildUserList(loggedInUserId ?? "")
            : _buildConversationList(),
      ),
    );
  }

  // Search bar widget in the app bar
  Widget _buildSearchBar() {
    return TextField(
      controller: _searchController,
      decoration: const InputDecoration(
        hintText: 'Search users...',
        border: InputBorder.none,
        suffixIcon: Icon(Icons.search),
      ),
    );
  }

  Widget _buildUserList(String loggedInUserId) {
    final filteredResults =
        searchResults.where((user) => user['_id'] != loggedInUserId).toList();
    return ListView.builder(
      itemCount: filteredResults.length,
      itemBuilder: (context, index) {
        final user = searchResults[index];
        final userName = user['name'];
        final profilePic = user['profile_pic'] ?? '';
        final userId = user['_id'];

        return ListTile(
          leading: CircleAvatar(
            backgroundImage: profilePic.isNotEmpty
                ? NetworkImage("https://chatapp.welllaptops.com$profilePic")
                : const AssetImage('assets/images/userpic.png')
                    as ImageProvider,
            radius: 24,
          ),
          title: Text(
            userName,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          onTap: () {
            final chatBoxProvider =
                Provider.of<ChatBoxStateProvider>(context, listen: false);
            chatBoxProvider.setChatDetails(userName, userId, userId);

            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const ChatBox(),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildConversationList() {
    return ListView.builder(
      itemCount: allConversations.length,
      itemBuilder: (context, index) {
        final conversation = allConversations[index];
        final user = conversation.userDetails;
        final isOnline = onlineUsers.contains(user!.id);
        final unseenMessages = conversation.unseenMessages;

        return ListTile(
          leading: Stack(
            children: [
              CircleAvatar(
                backgroundImage: user.profilePic.isNotEmpty
                    ? NetworkImage(
                        "https://chatapp.welllaptops.com${user.profilePic}")
                    : const AssetImage('assets/images/userpic.png')
                        as ImageProvider,
                radius: 24,
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Icon(
                  Icons.circle,
                  color: isOnline ? Colors.green : Colors.grey,
                  size: 12,
                ),
              ),
            ],
          ),
          title: Text(
            user.name,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          subtitle: Row(
            children: [
              Expanded(
                child: Text(
                  EncryptionService.decrypt(conversation.lastMessage.text)
                              .length >
                          30
                      ? '${EncryptionService.decrypt(conversation.lastMessage.text).substring(0, 30)}...'
                      : EncryptionService.decrypt(
                          conversation.lastMessage.text),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              conversation.lastMessage.seen
                  ? const Row(
                      children: [
                        Icon(Icons.check, size: 14, color: Colors.blue),
                        Icon(Icons.check, size: 14, color: Colors.blue),
                      ],
                    )
                  : const Icon(Icons.check, size: 14, color: Colors.grey),
            ],
          ),
          trailing: unseenMessages > 0
              ? CircleAvatar(
                  radius: 12,
                  backgroundColor: Colors.red,
                  child: Text(
                    '$unseenMessages',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                )
              : null,
          onTap: () {
            final receiverProvider =
                Provider.of<ReceiverProvider>(context, listen: false);
            receiverProvider.setReceiverDetails(user.id, user.name, user.bio,
                user.username, user.email, user.profilePic, user.joinedDate);
            final chatBoxProvider =
                Provider.of<ChatBoxStateProvider>(context, listen: false);
            chatBoxProvider.setChatDetails(user.name, conversation.id, user.id);

            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const ChatBox(),
              ),
            );
          },
        );
      },
    );
  }

  Future<bool?> _showExitConfirmationDialog(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Exit App'),
          content: const Text('Are you sure you want to exit?'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(false);
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(true);
              },
              child: const Text('Exit'),
            ),
          ],
        );
      },
    );
  }
}
