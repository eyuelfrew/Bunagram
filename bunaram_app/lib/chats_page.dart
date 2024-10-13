import 'package:bunaram_ap/auth/login_page.dart';
import 'package:bunaram_ap/service/api_service.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'chat_box.dart';

class ChatsPage extends StatefulWidget {
  const ChatsPage({super.key});

  @override
  _ChatsPageState createState() => _ChatsPageState();
}

class _ChatsPageState extends State<ChatsPage> {
  String? token;
  late IO.Socket socket;
  final TextEditingController _searchController = TextEditingController();
  List<String> users = [
    'John',
    'Jane',
    'David',
    'Emily',
    'Michael'
  ]; // Example user list
  List<String> filteredUsers = [];
  bool showDropdown = false; // To control the dropdown visibility
  String? selectedUser; // To track the selected user for the chat box

  @override
  @override
  void initState() {
    super.initState();
    filteredUsers = users; // Initially, show all users
    _loadToken();
  }

  //function to load stored tokne from shared preferences
  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      token = prefs.getString('token');
    });
    print("Token: $token");
    if (token != null) {
      socket = IO.io(
          "http://192.168.137.209:5000",
          IO.OptionBuilder()
              .setTransports(['websocket'])
              .disableAutoConnect()
              .setAuth({'token': token})
              .build());
      //connect to back end
      print("Scoket connection requestd......");
      socket.connect();
      //handleConnection Event
      socket.onConnect((_) {
        print('Connected Succesfully');
        final userId = prefs.getString('userId');
        print("user id...:$userId");
        socket.emit('side-bar', userId);
      });

      //handle error or connection issuse
      socket.onConnectError((data) {
        print('Connectio Error: $data');
      });
      socket.on('conversation', (data) {
        print("Conversations : $data");
      });
      //handle socket disconection
      socket.onDisconnect((_) {
        print("Socket Disconnectedd");
      });
    }
  }

  // Search function to filter users list based on search query
  void _searchUsers(String query) {
    final results = users
        .where((user) => user.toLowerCase().contains(query.toLowerCase()))
        .toList();
    setState(() {
      filteredUsers = results;
      showDropdown = query.isNotEmpty &&
          selectedUser ==
              null; // Show dropdown if there's input and no chat is selected
    });
  }

  // Function to handle user selection and show chat box
  void _selectUser(String user) {
    setState(() {
      selectedUser = user; // Set the selected user
      showDropdown = false; // Hide dropdown when a user is selected
      _searchController.clear(); // Clear search bar
    });
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
      drawer: _buildSideBar(), // Sidebar
      body: Stack(
        children: [
          selectedUser == null
              ? _buildBody()
              : ChatBox(user: selectedUser!), // Show ChatBox or user search
          if (showDropdown)
            _buildDropdown(), // Show dropdown if search is active and no user is selected
        ],
      ),
    );
  }

  // Search bar widget in the app bar
  Widget _buildSearchBar() {
    return TextField(
      controller: _searchController,
      onChanged: (query) => _searchUsers(query),
      decoration: const InputDecoration(
        hintText: 'Search users...',
        border: InputBorder.none,
        suffixIcon: Icon(Icons.search),
      ),
    );
  }

  // Dropdown widget to show filtered users
  Widget _buildDropdown() {
    return Positioned(
      top: kToolbarHeight, // Position dropdown just below the app bar
      left: 0,
      right: 0,
      child: Card(
        elevation: 4,
        child: ListView.builder(
          shrinkWrap: true,
          itemCount: filteredUsers.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text(filteredUsers[index]),
              onTap: () {
                _selectUser(filteredUsers[index]); // Select user and show chat
              },
            );
          },
        ),
      ),
    );
  }

  // Sidebar widget
  Widget _buildSideBar() {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          const DrawerHeader(
            decoration: BoxDecoration(color: Colors.blue),
            child: Text(
              'Menu',
              style: TextStyle(color: Colors.white, fontSize: 24),
            ),
          ),
          const ListTile(
            leading: Icon(Icons.person),
            title: Text("Account"),
          ),
          const ListTile(
            leading: Icon(Icons.settings),
            title: Text('Settings'),
          ),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () {
              _logout();
            },
          )
        ],
      ),
    );
  }

  // Body of the chats page when no user is selected
  Widget _buildBody() {
    return const Center(
      child: Text('Search conversation'),
    );
  }

  // Logout
  void _logout() async {
    showDialog(
      context: context,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );
    var dio = ApiService.getDioInstance();
    var cookieJar = ApiService.getCookieJarInstance();
    var cookies = await cookieJar
        .loadForRequest(Uri.parse('http://192.168.137.209:5000'));
    print("Logout cookie = $cookies");
    try {
      var response = await dio.get('http://192.168.137.209:5000/api/logout');
      print('Response Body : ${response.data}');
      if (response.data['status'] == 1) {
        socket.disconnect();
        print("Logout successfull");
        cookieJar.deleteAll();
        final prefs = await SharedPreferences.getInstance();
        await prefs.remove("authToken");
        Navigator.pop(context);
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
