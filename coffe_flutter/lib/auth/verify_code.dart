// ignore_for_file: use_build_context_synchronously

import 'package:coffegram/auth/login_page.dart';
import 'package:coffegram/service/api_service.dart';
import 'package:flutter/material.dart';

class VerfiyToken extends StatefulWidget {
  const VerfiyToken({super.key});
  @override
  _VerifyTokenState createState() => _VerifyTokenState();
}

class _VerifyTokenState extends State<VerfiyToken> {
  final _formKeytoken = GlobalKey<FormState>();
  final TextEditingController _token = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _token.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                child: Form(
                  key: _formKeytoken,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        'Verify Email',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF4A90E2),
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        "Insert the code we sent to your email",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 30),
                      TextFormField(
                        controller: _token,
                        obscureText: _obscurePassword,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: "Token",
                          filled: true,
                          fillColor: Colors.grey[200],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(30),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: const Icon(
                            Icons.security,
                            color: Color(0xFF4A90E2),
                          ),
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
                            return 'Token is required!';
                          }
                          if (value.length != 6) {
                            return "Invalid token format!";
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 30),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: _VerifyTokenInit,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0061FF),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          child: const Text(
                            "Verify",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ignore: non_constant_identifier_names
  Future<void> _VerifyTokenInit() async {
    if (_formKeytoken.currentState!.validate()) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return const Center(child: CircularProgressIndicator());
        },
      );
      String token = _token.text;
      try {
        var dio = ApiService.getDioInstance();
        final response = await dio.post(
            'https://chatapp.welllaptops.com/api/verify-email',
            data: {'verification_code': token});
        final responseData = response.data;
        if (Navigator.canPop(context)) {
          Navigator.pop(context);
        }
        if (responseData['status'] == 200) {
          showSnackBar(context, 'Email Verifiedd!',
              const Color.fromARGB(255, 4, 255, 75));
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const LoginPage()),
          );
        } else {
          showSnackBar(context, '${responseData['message']}', Colors.red);
        }
      } catch (error) {
        print('Error handleing $error');
      }
    }
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
