import 'package:bunaram_ap/auth/login_page.dart';
import 'package:bunaram_ap/service/api_service.dart';
import 'package:bunaram_ap/service/socket_service.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class SideBar extends StatefulWidget {
  const SideBar({super.key});
  @override
  _SideBar createState() => _SideBar();
}

class _SideBar extends State<SideBar> {
  String? apiUrl = dotenv.env['BACKEND_API_URL'];
  final socketService = SocketService();
  Future<void> initializeSocketService() async {
    final prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('token');
    socketService.initializeSocket(token!);
  }

  void _logout(BuildContext context, SocketService socketService) async {
    showDialog(
      context: context,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );

    final dio = ApiService.getDioInstance();
    final cookieJar = ApiService.getCookieJarInstance();
    final cookies = await cookieJar.loadForRequest(Uri.parse('${apiUrl}:5000'));
    print("Cookies = ${cookies}");
    try {
      var response = await dio.get('${apiUrl}:5000/api/logout');
      if (response.data['status'] == 1) {
        if (!socketService.isConnected) {
          initializeSocketService();
        }
        socketService.disconnect();
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

  @override
  Widget build(BuildContext context) {
    initializeSocketService();
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
            onTap: () => _logout(context, socketService),
          ),
        ],
      ),
    );
  }
}
