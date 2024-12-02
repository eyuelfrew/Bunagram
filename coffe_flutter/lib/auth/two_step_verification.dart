import 'package:coffegram/chats_page.dart';
import 'package:coffegram/service/api_service.dart';
import 'package:coffegram/store/socket_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TwoStepVerificationPage extends StatefulWidget {
  const TwoStepVerificationPage({super.key});

  @override
  _TwoStepVerificationPageState createState() =>
      _TwoStepVerificationPageState();
}

class _TwoStepVerificationPageState extends State<TwoStepVerificationPage> {
  final _verificationCodeController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  String? _errorMessage;

  // Simulated correct code for verification

  void _handleVerify() async {
    final cloudPassword = _verificationCodeController.text;
    if (_formKey.currentState?.validate() ?? false) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      try {
        var dio = ApiService.getDioInstance();

        var response = await dio.post(
          'https://chatapp.welllaptops.com/api/verify-cloud-password',
          data: {
            'cloud_password': cloudPassword,
          },
        );
        setState(() {
          _isLoading = false;
        });

        if (response.data["loggedIn"] == true) {
          final prefs = await SharedPreferences.getInstance();
          final token = prefs.getString('token');
          if (token != null) {
            final socketProvider =
                Provider.of<SocketProvider>(context, listen: false);
            socketProvider.initializeSocket(token);
          }
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const ChatsPage(),
            ),
          );
        } else {
          setState(() {
            _errorMessage = "Incorrect cloud password.";
          });
        }
      } catch (error) {
        print(error);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Two-Step Login"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                "Enter your cloud password",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _verificationCodeController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: "Cloud Passcode",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  prefixIcon: const Icon(Icons.lock),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "field is required";
                  }

                  return null;
                },
              ),
              const SizedBox(height: 20),
              if (_errorMessage != null)
                Text(
                  _errorMessage!,
                  style: const TextStyle(color: Colors.red),
                ),
              const SizedBox(height: 10),
              _isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _handleVerify,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 32, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                      ),
                      child: const Text("Verify"),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
