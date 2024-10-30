import 'package:bunaram_ap/auth/login_page.dart';
import 'package:bunaram_ap/service/api_service.dart';
import 'package:bunaram_ap/service/socket_service.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SideBar extends StatelessWidget {
  const SideBar({super.key});

  void _logout(BuildContext context, SocketService socketService) async {
    showDialog(
      context: context,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );

    final dio = ApiService.getDioInstance();
    final cookieJar = ApiService.getCookieJarInstance();
    final cookies =
        await cookieJar.loadForRequest(Uri.parse('http://192.168.1.6:5000'));

    try {
      var response = await dio.get('http://192.168.1.6:5000/api/logout');
      if (response.data['status'] == 1) {
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
    final socketService = SocketService();

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
