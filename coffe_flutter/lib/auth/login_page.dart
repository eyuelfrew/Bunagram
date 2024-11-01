import 'package:bunaram_ap/service/api_service.dart';
import 'package:bunaram_ap/auth/forgot_password.dart';
import 'package:bunaram_ap/auth/sign_up.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../chats_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  // ignore: library_private_types_in_public_api
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  String? apiUrl = dotenv.env['BACKEND_API_URL'];
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
            child: Form(
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
                          prefixIcon:
                              const Icon(Icons.email, color: Color(0xFF4A90E2)),
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
                          prefixIcon:
                              const Icon(Icons.lock, color: Color(0xFF4A90E2)),
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
                          child: const Text("Login"),
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

        // Send login request
        var response = await dio.post(
          '$apiUrl:5000/api/login',
          data: {
            'email': email,
            'password': password,
          },
        );

        // Dismiss loading dialog
        // ignore: use_build_context_synchronously
        Navigator.pop(context);

        var responseData = response.data;

        await cookieJar.loadForRequest(Uri.parse('$apiUrl:5000'));
        // Handling different responses
        if (responseData['wrongCredentials'] == true) {
          showSnackBar(
              context, 'Wrong Credentials. Please try again.', Colors.red);
        } else if (responseData['isLocked'] == true) {
          showSnackBar(
              context, 'Too many attempts. Try again later!', Colors.red);
        } else if (responseData['notFound'] == true) {
          showSnackBar(context, 'User not found!', Colors.red);
        } else if (responseData['loggedIn'] == true) {
          // Successfully logged in
          final userId = responseData['user']['_id'];
          final token = responseData['token'];
          final prefs = await SharedPreferences.getInstance();

          // Store token and userId in local storage
          await prefs.setString("token", token);
          await prefs.setString('userId', userId);

          // Navigate to ChatsPage after successful login
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const ChatsPage()),
          );
        } else {
          // Handle any unexpected response
          showSnackBar(context,
              'An unexpected error occurred. Please try again.', Colors.red);
        }
      } catch (e) {
        // Ensure loading indicator is dismissed in case of an error
        Navigator.pop(context);

        // Log the error for debugging
        print('Error occurred: $e');

        // Display a generic error message
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

  // Helper function for displaying a snackbar message
}
