// ignore_for_file: use_build_context_synchronously, non_constant_identifier_names

import 'dart:io';

import 'package:coffegram/auth/two_step_verification.dart';
import 'package:coffegram/complient_page.dart';
import 'package:coffegram/service/api_service.dart';
import 'package:coffegram/auth/forgot_password.dart';
import 'package:coffegram/auth/sign_up.dart';
import 'package:coffegram/store/socket_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../chats_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  // ignore: library_private_types_in_public_api
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        final shouldExit = await _showExitConfirmationDialog(context);
        if (shouldExit ?? false) {
          exit(0);
        }
        return false;
      },
      child: Scaffold(
        body: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF4A90E2), Color(0xFF0061FF)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: Center(
            child: SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Login Form Container
                  Form(
                    key: _formKey,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Container(
                        padding: const EdgeInsets.all(24.0),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              'Welcome Back!',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF4A90E2),
                              ),
                            ),
                            const SizedBox(height: 30),
                            TextFormField(
                              controller: _emailController,
                              decoration: InputDecoration(
                                labelText: "Email",
                                labelStyle: const TextStyle(fontSize: 14),
                                filled: true,
                                fillColor: Colors.grey[200],
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(30),
                                  borderSide: BorderSide.none,
                                ),
                                prefixIcon: const Icon(Icons.email,
                                    color: Color(0xFF4A90E2)),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Email is required!';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 20),
                            TextFormField(
                              controller: _passwordController,
                              obscureText: _obscurePassword,
                              decoration: InputDecoration(
                                labelText: "Password",
                                labelStyle: const TextStyle(fontSize: 14),
                                filled: true,
                                fillColor: Colors.grey[200],
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(30),
                                  borderSide: BorderSide.none,
                                ),
                                prefixIcon: const Icon(Icons.lock,
                                    color: Color(0xFF4A90E2)),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons.visibility
                                        : Icons.visibility_off,
                                    color: const Color(0xFF4A90E2),
                                  ),
                                  onPressed: () {
                                    setState(() {
                                      _obscurePassword = !_obscurePassword;
                                    });
                                  },
                                ),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your password';
                                } else if (value.length < 6) {
                                  return 'Password must be at least 6 characters';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 30),
                            SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: ElevatedButton(
                                onPressed: _login,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF0061FF),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(30),
                                  ),
                                  textStyle: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                child: const Text(
                                  "Login",
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                TextButton(
                                  onPressed: _forgotPasswordPage,
                                  child: const Text(
                                    'Forgot Password?',
                                    style: TextStyle(
                                        color: Color(0xFF4A90E2), fontSize: 14),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                TextButton(
                                  onPressed: _signUpPage,
                                  child: const Text(
                                    'Sign Up',
                                    style: TextStyle(
                                        color: Color(0xFF4A90E2), fontSize: 14),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 30),

                  // Complaint Button Positioned Below Form
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const ComplaintPage()),
                      );
                    },
                    child: const Text(
                      'Have a complaint? Click here',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  /*
 ---- Login Function
*/
  void _login() async {
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

    if (_formKey.currentState!.validate()) {
      String email = _emailController.text;
      String password = _passwordController.text;

      // Show loading dialog
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(),
        ),
      );

      try {
        // Initialize Dio and CookieJar
        var dio = ApiService.getDioInstance();
        var cookieJar = ApiService.getCookieJarInstance();

        // Show loading dialog
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) {
            return const Center(child: CircularProgressIndicator());
          },
        );

        // Send login request
        var response = await dio.post(
          'https://chatapp.welllaptops.com/api/login',
          data: {
            'email': email,
            'password': password,
          },
        );

        var responseData = response.data;

        var baned = (responseData['user']?['banded'] ?? false);

        await cookieJar
            .loadForRequest(Uri.parse('https://chatapp.welllaptops.com'));

        if (Navigator.canPop(context)) {
          Navigator.pop(context);
        }
        if ((responseData['wrongCredentials'] ?? false) == true) {
          showSnackBar(
              context, 'Wrong Credentials. Please try again.', Colors.red);
        } else if ((responseData['isLocked'] ?? false) == true) {
          showSnackBar(
              context, 'Too many attempts. Try again later!', Colors.red);
        } else if ((responseData['notFound'] ?? false) == true) {
          showSnackBar(context, 'User not found!', Colors.red);
        } else if ((responseData['loggedIn'] ?? false) == true &&
            !responseData['twoStepVerification'] &&
            !baned) {
          final userId = responseData['user']['_id'];
          final token = responseData['token'];
          final profilePic = responseData['user']['profile_pic'] ?? "";
          final userEmail = responseData['user']['email'];
          final userName = responseData['user']['user_name'] ?? "";
          final name = responseData['user']['name'];
          final JoinedAt = responseData['user']['createdAt'];
          final userBio = responseData['user']['bio'] ?? "";
          final prefs = await SharedPreferences.getInstance();

          // Store token and user info locally
          await prefs.setString("token", token);
          await prefs.setString('userId', userId);
          await prefs.setString('profilePic', profilePic);

          await prefs.setString('userEmail', userEmail);
          await prefs.setString('userName', userName);
          await prefs.setString('Name', name);
          await prefs.setString('userBio', userBio);
          await prefs.setString('JoinedAt', JoinedAt);
          if (responseData['token'] != null) {
            final socketProvider =
                Provider.of<SocketProvider>(context, listen: false);
            socketProvider.initializeSocket(responseData['token']);
          }

          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const ChatsPage()),
          );
        } else if (baned) {
          showSnackBar(context, 'Baned from using this app!', Colors.red);
        } else if (responseData['twoStepVerification'] == true) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const TwoStepVerificationPage(),
            ),
          );
        } else {
          if (Navigator.canPop(context)) {
            Navigator.pop(context);
          }
          showSnackBar(context,
              'An unexpected error occurred. Please try again.', Colors.red);
        }
      } catch (e) {
        if (Navigator.canPop(context)) {
          Navigator.pop(context);
        }
        print('Error occurred: $e');
        showSnackBar(context, 'An error occurred: $e', Colors.red);
      }
    }
  }

  /*
    -- Navigate To Forgot Password Page
    */
  void _forgotPasswordPage() {
    Navigator.push(context,
        MaterialPageRoute(builder: (context) => const ForgotPassword()));
  }

  /*
  -- Navigate To Sign Up Page
  */
  void _signUpPage() {
    Navigator.push(
        context, MaterialPageRoute(builder: (context) => const SignUpPage()));
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
                Navigator.of(context).pop(false); // Don't exit
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(true); // Exit
              },
              child: const Text('Exit'),
            ),
          ],
        );
      },
    );
  }
}
