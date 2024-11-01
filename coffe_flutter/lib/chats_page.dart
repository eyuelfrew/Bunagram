import 'package:bunaram_ap/models/Conversation.dart';
import 'package:bunaram_ap/service/api_service.dart';
import 'package:bunaram_ap/service/socket_service.dart';
import 'package:bunaram_ap/widgets/side_bar.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ChatsPage extends StatefulWidget {
  const ChatsPage({super.key});

  @override
  _ChatsPageState createState() => _ChatsPageState();
}

class _ChatsPageState extends State<ChatsPage> {
  String? apiUrl = dotenv.env['BACKEND_API_URL'];

  List<Conversation> allUsers = [];
  String? token;
  final SocketService _socketService = SocketService();

  final TextEditingController _searchController = TextEditingController();

  @override
  @override
  void initState() {
    super.initState();
    _loadToken();
    fetchConversations();
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
    try {
      var dio = ApiService.getDioInstance();
      final response = await dio.get('${apiUrl}:5000/api/conversations');
      print("Conersaions = ${response.data}");
      // Assuming that response.data is directly the list of conversations
      setState(() {
        if (response.data != null && response.data is List) {
          allUsers = (response.data as List)
              .map((json) => (Conversation.fromJson(json)))
              .toList();
          print("All User  =  ${allUsers}");
        } else {
          print('Unexpected response format: ${response.data}');
          allUsers = [];
        }
      });
    } catch (e) {
      print('Error fetching conversations: $e');
    }
  }

  // initialize rocket connection method
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
          print("conversation = ${conversation}");
          final user =
              conversation.receiver; // You can customize sender/receiver logic

          return ListTile(
            leading: CircleAvatar(
              backgroundImage: user.profilePic.isNotEmpty
                  ? NetworkImage("${apiUrl}:5000${user.profilePic}")
                  : const AssetImage('assets/images/userpic.png')
                      as ImageProvider,
              radius: 24,
            ),
            title: Text(
              user.name,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text(
              conversation.lastMessage.text.length > 30
                  ? '${conversation.lastMessage.text.substring(0, 30)}...'
                  : conversation.lastMessage.text,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            trailing: const Icon(
              Icons.circle,
              // color: user.lastSeen.isAfter(
              //         DateTime.now().subtract(const Duration(minutes: 5)))
              //     ? Colors.green
              //     : Colors.grey,
              size: 12,
            ),
            onTap: () {
              // Navigate to chat screen with selected user
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
