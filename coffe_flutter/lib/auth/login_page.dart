import 'package:bunaram_ap/service/api_service.dart';
import 'package:bunaram_ap/auth/forgot_password.dart';
import 'package:bunaram_ap/auth/sign_up.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../chats_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
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
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 40),
                  TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      labelText: "Email",
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.email),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'email is required!';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  TextFormField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      labelText: "Password",
                      border: const OutlineInputBorder(),
                      prefixIcon: const Icon(Icons.lock),
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
                        return 'Please enter your password';
                      } else if (value.length < 6) {
                        return 'Password must be at least 6 character';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(
                    height: 24,
                  ),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _login,
                      child: const Text(
                        "Login",
                        style: TextStyle(fontSize: 18),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      TextButton(
                        onPressed: _forgotPasswordPage,
                        child: const Text('Forgot Password ?'),
                      ),
                      const SizedBox(
                        width: 10,
                      ),
                      TextButton(
                          onPressed: _signUpPage, child: const Text('Sign Up'))
                    ],
                  )
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
    if (_formKey.currentState!.validate()) {
      String email = _emailController.text;
      String password = _passwordController.text;
      showDialog(
        context: context,
        builder: (context) => const Center(
          child: CircularProgressIndicator(),
        ),
      );
      try {
        var dio = ApiService.getDioInstance();
        var cookieJar = ApiService.getCookieJarInstance();
        var response = await dio.post(
          'http://192.168.137.209:5000/api/login',
          data: {
            'email': email,
            'password': password,
          },
        );
        print('Response Body : ${response.data}');
        var responseData = response.data;
        var cookies = await cookieJar
            .loadForRequest(Uri.parse('http://192.168.137.209:5000'));
        print('Stored Cookies: $cookies');
        /*
  -- if login success full close the loding state and navigate to chats page
  */

        if (responseData['loggedIn']) {
          final userId = responseData['user']['_id'];
          print("ID : $userId");
          final token = responseData['token'];
          final prefs = await SharedPreferences.getInstance();
          print("Login Success full");
          await prefs.setString("token", token);
          await prefs.setString('userId', userId);
          // await prefs.setString('_id', value)
          Navigator.pushReplacement(context,
              MaterialPageRoute(builder: (context) => const ChatsPage()));
          return;
        }
        if (responseData['wrongCredentials']) {
          return;
        }
        if (responseData['notFound']) {
          return;
        }
        /*
      -- if login faild close loading 
       */
        Future.delayed(const Duration(seconds: 2), () {
          Navigator.pop(context);
        });
      } catch (e) {
        print('Error occurred: $e');
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
}
