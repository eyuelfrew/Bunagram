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
      appBar: AppBar(
        title: const Text("Verify Email!"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: SingleChildScrollView(
            child: Form(
              key: _formKeytoken,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(
                    height: 40,
                    child: Text("Insert the code we sent to your email"),
                  ),
                  TextFormField(
                    controller: _token,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      labelText: "Token",
                      border: const OutlineInputBorder(),
                      suffixIcon: IconButton(
                        icon: Icon(_obscurePassword
                            ? Icons.visibility
                            : Icons.visibility_off),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'token is required!';
                      }
                      if (value.length != 6) {
                        return "Invalid token format!";
                      }
                      return null;
                    },
                  ),
                  const SizedBox(
                    height: 24,
                  ),
                  SizedBox(
                    child: ElevatedButton(
                      onPressed: _VerifyTokenInit,
                      child: const Text(
                        "Verify",
                        style: TextStyle(fontSize: 18),
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
  void _VerifyTokenInit() {
    if (_formKeytoken.currentState!.validate()) {
      String token = _token.text;
      print("Token = ${token}");
      print("test works");
      return;
    }
  }
}
