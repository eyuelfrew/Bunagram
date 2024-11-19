import 'package:bunaram_ap/chat_box.dart';
import 'package:bunaram_ap/models/Conversation.dart';
import 'package:bunaram_ap/service/api_service.dart';
import 'package:bunaram_ap/service/socket_service.dart';
import 'package:bunaram_ap/utils/encryption_service.dart';
import 'package:bunaram_ap/widgets/side_bar.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ChatsPage extends StatefulWidget {
  const ChatsPage({super.key});

  @override
  _ChatsPageState createState() => _ChatsPageState();
}

class _ChatsPageState extends State<ChatsPage> {
  List<Conversation> allUsers = [];
  Set<String> onlineUsers = {};
  String? token;
  final SocketService _socketService = SocketService();
  final TextEditingController _searchController = TextEditingController();

  @override
  @override
  void initState() {
    super.initState();
    _loadToken();
    fetchConversations();
    _socketService.onOnlineUsersReceived = (List<String> users) {
      setState(() {
        onlineUsers = users.toSet();
      });
    };
  }

  //load token
  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      token = prefs.getString('token');
    });
    // initalize socket connection
    _initializeSocketConnection(token);
  }

  Future<void> fetchConversations() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString("userId");
    try {
      var dio = ApiService.getDioInstance();
      final response = await dio
          .get('https://www.chatapp.welllaptops.com/api/conversations');

      setState(() {
        if (response.data != null && response.data is List) {
          allUsers = (response.data as List)
              .map((json) {
                final conversation = Conversation.fromJson(json);
                if (conversation.receiver.id == userId) {
                  return conversation.copyWith(
                      userDetails: conversation.sender);
                } else if (conversation.sender.id == userId) {
                  return conversation.copyWith(
                      userDetails: conversation.receiver);
                } else {
                  return null;
                }
              })
              .whereType<Conversation>()
              .toList();
        } else {
          print('Unexpected response format: ${response.data}');
          allUsers = [];
        }
      });
    } catch (e) {
      print('Error fetching conversations: $e');
    }
  }

  // initialize socket connection method
  void _initializeSocketConnection(token) {
    if (token != null) {
      _socketService.initializeSocket(token!);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _buildSearchBar(),
        leading: Builder(
          builder: (BuildContext context) {
            return IconButton(
              icon: const Icon(Icons.menu),
              onPressed: () {
                Scaffold.of(context).openDrawer(); // Open the sidebar
              },
            );
          },
        ),
      ),
      drawer: const SideBar(),
      body: ListView.builder(
        itemCount: allUsers.length,
        itemBuilder: (context, index) {
          final conversation = allUsers[index];
          final user = conversation.userDetails;
          final isOnline = onlineUsers.contains(user!.id);
          return ListTile(
            leading: CircleAvatar(
              backgroundImage: user.profilePic.isNotEmpty
                  ? NetworkImage(
                      "https://www.chatapp.welllaptops.com${user.profilePic}")
                  : const AssetImage('assets/images/userpic.png')
                      as ImageProvider,
              radius: 24,
            ),
            title: Text(
              user.name,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text(
              EncryptionService.decrypt(conversation.lastMessage.text).length >
                      30
                  ? '${EncryptionService.decrypt(conversation.lastMessage.text).substring(0, 30)}...'
                  : EncryptionService.decrypt(conversation.lastMessage.text),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            trailing: Icon(
              Icons.circle,
              color: isOnline ? Colors.green : Colors.grey,
              size: 12,
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ChatBox(
                      conversationId: conversation.id,
                      reciverId: user.id,
                      userName: user.name),
                ),
              );
            },
          );
        },
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
}
