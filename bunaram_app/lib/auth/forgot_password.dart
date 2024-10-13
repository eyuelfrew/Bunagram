import 'package:flutter/material.dart';

class ForgotPassword extends StatefulWidget {
  const ForgotPassword({super.key});
  @override
  _ForgotPasswordState createState() => _ForgotPasswordState();
}

class _ForgotPasswordState extends State<ForgotPassword> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("Forgot Password!"),
        ),
        body: const Align(
          alignment: Alignment.center,
          child: Text(
            "Insert your email",
            textAlign: TextAlign.center,
          ),
        ));
  }
}
