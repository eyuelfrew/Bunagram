import 'package:coffegram/auth/reset_password.dart';
import 'package:coffegram/service/api_service.dart';
import 'package:flutter/material.dart';

class OtpPage extends StatefulWidget {
  const OtpPage({super.key});

  @override
  _OtpPageState createState() => _OtpPageState();
}

class _OtpPageState extends State<OtpPage> {
  final TextEditingController _otpController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  String? _errorMessage;

  // Simulated function to verify OTP
  Future<bool> _verifyOtp(String otp) async {
    await Future.delayed(const Duration(seconds: 2)); // Simulate API delay
    return otp == "123456";
  }

  void showSnackBar(BuildContext context, String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
      ),
    );
  }

  void _handleVerifyOtp() async {
    final verficaion_code = _otpController.text;
    if (_formKey.currentState?.validate() ?? false) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      var dio = ApiService.getDioInstance();
      var cookieJar = ApiService.getCookieJarInstance();
      var response = await dio.post(
        'https://chatapp.welllaptops.com/api/verify-email',
        data: {
          'verification_code': verficaion_code,
        },
      );
      await cookieJar
          .loadForRequest(Uri.parse('https://chatapp.welllaptops.com'));
      setState(() {
        _isLoading = false;
      });
      if (response.data['notRegistered'] == true) {
        showSnackBar(context, 'Incorrect Code.', Colors.red);
      }
      if (response.data['status'] == 200) {
        Navigator.push(context,
            MaterialPageRoute(builder: (context) => const ResetPasswordPage()));
      }

      // if (isOtpValid) {
      //   ScaffoldMessenger.of(context).showSnackBar(
      //     const SnackBar(content: Text("OTP Verified Successfully!")),
      //   );
      //   // Navigate to reset password or success page
      // } else {
      //   setState(() {
      //     _errorMessage = "Invalid OTP. Please try again.";
      //   });
      // }
    }
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
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        "Enter OTP",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF4A90E2),
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        "Enter the 6-digit OTP sent to your email.",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 30),
                      TextFormField(
                        controller: _otpController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: "OTP",
                          filled: true,
                          fillColor: Colors.grey[200],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(30),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: const Icon(
                            Icons.lock,
                            color: Color(0xFF4A90E2),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return "Please enter the OTP.";
                          }
                          if (value.length != 6) {
                            return "OTP must be exactly 6 digits.";
                          }
                          if (!RegExp(r"^\d{6}$").hasMatch(value)) {
                            return "OTP must contain only numbers.";
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),
                      if (_errorMessage != null)
                        Text(
                          _errorMessage!,
                          style: const TextStyle(color: Colors.green),
                          textAlign: TextAlign.center,
                        ),
                      const SizedBox(height: 10),
                      _isLoading
                          ? const CircularProgressIndicator()
                          : SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: ElevatedButton(
                                onPressed: _handleVerifyOtp,
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
}
