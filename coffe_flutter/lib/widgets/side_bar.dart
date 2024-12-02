// ignore_for_file: use_build_context_synchronously

import 'package:coffegram/auth/login_page.dart';
import 'package:coffegram/service/api_service.dart';
import 'package:coffegram/store/socket_provider.dart';
import 'package:coffegram/widgets/edit_profile_modal.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SideBar extends StatefulWidget {
  const SideBar({super.key});

  @override
  State<SideBar> createState() => _SideBarState();
}

class _SideBarState extends State<SideBar> {
  String? name;
  String? email;
  String? profilePic = '';
  String? username;

  @override
  void initState() {
    super.initState();
    _getUserDetails();
    // listenForBan();
  }

  void listenForBan() {
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    socketProvider.socket?.on("banded", (data) async {
      _logout();
    });
  }

  Future<void> _getUserDetails() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      name = prefs.getString('Name') ?? '';
      email = prefs.getString('userEmail') ?? '';
      profilePic = prefs.getString('profilePic') ?? '';
      username = prefs.getString('userName') ?? '';
    });
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
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
          (route) => false,
        );
      }
    } catch (err) {
      print('Error occurred: $err');
    }
  }

  void _showEditUserDetailsModal(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => const EditProfileModal(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(color: Colors.blue),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      backgroundImage: profilePic!.isNotEmpty
                          ? NetworkImage(
                              'https://chatapp.welllaptops.com$profilePic')
                          : const AssetImage('assets/images/userpic.png'),
                      radius: 30,
                    ),
                    const SizedBox(width: 12),
                    Text(
                      name ?? 'User Name',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '@$username',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  email ?? 'user@example.com',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Account'),
            onTap: () => _showEditUserDetailsModal(context),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: _logout,
          ),
        ],
      ),
    );
  }
}
