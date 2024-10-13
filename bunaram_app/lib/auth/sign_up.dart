import 'dart:convert';

import 'package:bunaram_ap/auth/verify_code.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});
  @override
  _SignUpPageState createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _signUpform = GlobalKey<FormState>();

  // form input controller
  final TextEditingController _name = TextEditingController();
  final TextEditingController _email = TextEditingController();
  final TextEditingController _password = TextEditingController();
  final TextEditingController _confirmPassword = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _confirmPassword.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Sign Up',
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(18),
        child: Center(
          child: SingleChildScrollView(
            child: Form(
                key: _signUpform,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    TextFormField(
                      controller: _name,
                      decoration: const InputDecoration(
                        labelText: "Full Name",
                        hintText: "your full name",
                        hintStyle: TextStyle(
                            fontWeight: FontWeight.w400, color: Colors.grey),
                        fillColor: Colors.transparent,
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'name is required!';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(
                      height: 14,
                    ),
                    TextFormField(
                      controller: _email,
                      decoration: const InputDecoration(
                          hintText: "Your Email!",
                          labelText: "Email",
                          hintStyle: TextStyle(fontWeight: FontWeight.w400),
                          fillColor: Colors.transparent,
                          border: OutlineInputBorder()),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Email is required!";
                        }
                        String pattern = r'^[^@]+@[^@]+\.[^@]+';
                        RegExp regex = RegExp(pattern);
                        if (!regex.hasMatch(value)) {
                          return "Enter a valid email!";
                        }
                        return null;
                      },
                    ),
                    const SizedBox(
                      height: 14,
                    ),
                    TextFormField(
                      controller: _password,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                          labelText: "Password",
                          hintText: '*******',
                          hintStyle:
                              const TextStyle(fontWeight: FontWeight.w400),
                          border: const OutlineInputBorder(),
                          fillColor: Colors.transparent,
                          suffixIcon: IconButton(
                            icon: Icon(_obscurePassword
                                ? Icons.visibility
                                : Icons.visibility_off),
                            onPressed: () {
                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });
                            },
                          )),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Password is required!";
                        }
                        if (value.length <= 5) {
                          return "password lengeth should minimum 6!";
                        }
                        return null;
                      },
                    ),
                    const SizedBox(
                      height: 14,
                    ),
                    TextFormField(
                      controller: _confirmPassword,
                      obscureText: _obscureConfirmPassword,
                      decoration: InputDecoration(
                        labelText: "Confirm Password",
                        hintText: "*******",
                        hintStyle: const TextStyle(fontWeight: FontWeight.w400),
                        border: const OutlineInputBorder(),
                        fillColor: Colors.transparent,
                        suffixIcon: IconButton(
                          onPressed: () {
                            setState(() {
                              _obscureConfirmPassword =
                                  !_obscureConfirmPassword;
                            });
                          },
                          icon: Icon(_obscureConfirmPassword
                              ? Icons.visibility
                              : Icons.visibility_off),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Confirm Password is required";
                        }
                        if (value != _password.text) {
                          return "Password did not match!";
                        }
                        return null;
                      },
                    ),
                    SizedBox(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          SizedBox(
                            child: ElevatedButton(
                                onPressed: _initSignUp,
                                child: const Text("Sign Up")),
                          ),
                          SizedBox(
                            child: ElevatedButton(
                              onPressed: _restForm,
                              child: const Text("Reset"),
                            ),
                          )
                        ],
                      ),
                    )
                  ],
                )),
          ),
        ),
      ),
    );
  }

  /*
 -- Sing up request function
 */
  void _initSignUp() async {
    if (_signUpform.currentState!.validate()) {
      String name = _name.text;
      String email = _email.text;
      String password = _password.text;
      Map<String, dynamic> formdata = {
        'name': name,
        'email': email,
        'password': password
      };
      try {
        var response = await http.post(
            Uri.parse('http://192.168.137.209:5000/api/register'),
            body: formdata);
        print(response.body);
        var responseData = jsonDecode(response.body);
        if (responseData['status'] == 1) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const VerfiyToken(),
            ),
          );
        }
      } catch (e) {
        print("Error : ${e}");
      }
    }
  }

  /*
  -- Form rest functionalty 
  */
  void _restForm() {
    _signUpform.currentState?.reset();
  }
}
