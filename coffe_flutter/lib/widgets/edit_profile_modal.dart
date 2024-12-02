// ignore_for_file: use_build_context_synchronously, avoid_print

import 'package:coffegram/auth/login_page.dart';
import 'package:coffegram/service/api_service.dart';
import 'package:coffegram/store/socket_provider.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class EditProfileModal extends StatefulWidget {
  const EditProfileModal({super.key});

  @override
  State<EditProfileModal> createState() => _EditProfileModalState();
}

class _EditProfileModalState extends State<EditProfileModal> {
  late TextEditingController nameController;
  late TextEditingController usernameController;
  late TextEditingController emailController;
  late TextEditingController bioController;
  String? joinedAt;
  String? profilePic;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController();
    usernameController = TextEditingController();
    emailController = TextEditingController();
    bioController = TextEditingController();
    _getUserDetails();
  }

  Future<void> _getUserDetails() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      nameController.text = prefs.getString('Name') ?? '';
      bioController.text = prefs.getString('userBio') ?? '';
      usernameController.text = prefs.getString('userName') ?? '';
      emailController.text = prefs.getString('userEmail') ?? '';
      joinedAt = prefs.getString('JoinedAt') ?? 'Unknown';
      profilePic = prefs.getString('profilePic');
    });
  }

  Future<void> _saveUserDetails() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('Name', nameController.text);
    await prefs.setString('userName', usernameController.text);
    await prefs.setString('userBio', bioController.text);
    try {
      var dio = ApiService.getDioInstance();
      var response = await dio
          .post('https://chatapp.welllaptops.com/api/user/update', data: {
        'name': nameController.text,
        'user_name': usernameController.text,
        'user_id': prefs.getString('userId')
      });
      if (response.data['status'] == 1) {
        showSnackBar(context, 'Saved Succesfully', Colors.green);
      } else {
        print("Eroor Saving Data ${response.data['message']}");
      }
    } catch (error) {
      print('Error while saving data :- $error');
    }
  }

  Future<void> _selectImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        profilePic = pickedFile.path;
      });
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('profilePic', profilePic!);
    }
  }

  Future<void> _deleteAccount() async {
    final socketProvider = Provider.of<SocketProvider>(context, listen: false);
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );
    final prefs = await SharedPreferences.getInstance();
    final loggedInUserId = prefs.getString('userId');
    await prefs.clear();
    try {
      var dio = ApiService.getDioInstance();
      final response = await dio.delete(
          'https://chatapp.welllaptops.com/api/del-acc/${loggedInUserId}');
      if (response.data['status'] == 1) {
        final cookieJar = ApiService.getCookieJarInstance();
        await cookieJar
            .loadForRequest(Uri.parse('https://chatapp.welllaptops.com'));
        await dio.get('https://chatapp.welllaptops.com/api/logout');

        socketProvider.disconnect();
        cookieJar.deleteAll();
        if (Navigator.canPop(context)) {
          Navigator.pop(context);
        }
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
        );
      }
    } catch (error) {
      if (Navigator.canPop(context)) {
        Navigator.pop(context);
      }
      print("Error Deleting user account :- error");
    }
  }

  @override
  void dispose() {
    nameController.dispose();
    usernameController.dispose();
    emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text(
        'Profile',
        style: TextStyle(fontSize: 16),
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              alignment: Alignment.center,
              children: [
                CircleAvatar(
                  radius: 40,
                  backgroundImage: profilePic != null && profilePic!.isNotEmpty
                      ? NetworkImage(
                          'https://chatapp.welllaptops.com$profilePic')
                      : const AssetImage('assets/images/userpic.png')
                          as ImageProvider,
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: IconButton(
                    icon: const Icon(Icons.edit, color: Colors.white),
                    onPressed: _selectImage,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            TextFormField(
              controller: nameController,
              decoration: const InputDecoration(labelText: 'Name'),
            ),
            TextFormField(
              controller: bioController,
              decoration: const InputDecoration(labelText: 'Bio'),
            ),
            TextFormField(
              controller: usernameController,
              decoration: const InputDecoration(labelText: 'Username'),
              enabled: false,
            ),
            const SizedBox(height: 20),
            TextFormField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email'),
              enabled: false,
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Joined at:',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 14,
                  ),
                ),
                Text(
                  joinedAt != null && joinedAt!.isNotEmpty
                      ? DateFormat('dd MMM , yyyy')
                          .format(DateTime.parse(joinedAt!))
                      : 'Unknown',
                  style: const TextStyle(
                    color: Colors.black,
                    fontSize: 14,
                    fontWeight: FontWeight.normal,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            TextButton(
              onPressed: () => _showDeleteConfirmationDialog(context),
              child: const Text(
                'Delete Account',
                style: TextStyle(
                  color: Colors.red,
                ),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () async {
            await _saveUserDetails();
            Navigator.pop(context);
          },
          child: const Text('Save'),
        ),
      ],
    );
  }

  void _showDeleteConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Confirm Delete'),
          content: const Text(
            'Are you sure you want to delete your account? This action cannot be undone.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
              ),
              onPressed: () async {
                Navigator.pop(context);
                await _deleteAccount();
              },
              child: const Text(
                'Delete',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        );
      },
    );
  }

  void showSnackBar(BuildContext context, String message, Color color) {
    if (Navigator.canPop(context)) {
      Navigator.pop(context);
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
      ),
    );
  }
}
