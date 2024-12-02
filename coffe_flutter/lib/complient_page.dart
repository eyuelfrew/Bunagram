import 'package:coffegram/service/api_service.dart';
import 'package:flutter/material.dart';

class ComplaintPage extends StatefulWidget {
  const ComplaintPage({super.key});

  @override
  State<ComplaintPage> createState() => _ComplaintPageState();
}

class _ComplaintPageState extends State<ComplaintPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _complaintController = TextEditingController();

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
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Submit a Complaint',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF4A90E2),
                        ),
                      ),
                      const SizedBox(height: 30),
                      // Name Field
                      TextFormField(
                        controller: _nameController,
                        decoration: InputDecoration(
                          labelText: "Name",
                          labelStyle: const TextStyle(fontSize: 14),
                          filled: true,
                          fillColor: Colors.grey[200],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(30),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: const Icon(Icons.person,
                              color: Color(0xFF4A90E2)),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Name is required!';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),
                      // Email Field
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
                        keyboardType: TextInputType.emailAddress,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Email is required!';
                          } else if (!RegExp(r'^[^@]+@[^@]+\.[^@]+')
                              .hasMatch(value)) {
                            return 'Enter a valid email!';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),
                      // Phone Field
                      TextFormField(
                        controller: _phoneController,
                        decoration: InputDecoration(
                          labelText: "Phone Number",
                          labelStyle: const TextStyle(fontSize: 14),
                          filled: true,
                          fillColor: Colors.grey[200],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(30),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon:
                              const Icon(Icons.phone, color: Color(0xFF4A90E2)),
                        ),
                        keyboardType: TextInputType.phone,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Phone number is required!';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),
                      // Complaint Field
                      TextFormField(
                        controller: _complaintController,
                        decoration: InputDecoration(
                          labelText: "Complaint",
                          labelStyle: const TextStyle(fontSize: 14),
                          filled: true,
                          fillColor: Colors.grey[200],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(30),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: const Icon(Icons.feedback,
                              color: Color(0xFF4A90E2)),
                        ),
                        maxLines: 5,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Complaint is required!';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 30),
                      // Submit Button
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: TextButton(
                          onPressed: _submitComplaint,
                          style: TextButton.styleFrom(
                            foregroundColor: const Color(0xFF0061FF),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          child: const Text(
                            "Submit",
                            style: TextStyle(fontSize: 16),
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

  void _submitComplaint() async {
    if (_formKey.currentState!.validate()) {
      // Collect form data
      final name = _nameController.text.trim();
      final email = _emailController.text.trim();
      final phoneNumber = _phoneController.text.trim();
      final complaintText = _complaintController.text.trim();

      try {
        // Show a loading dialog while submitting
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) =>
              const Center(child: CircularProgressIndicator()),
        );

        var dio = ApiService.getDioInstance();
        final response = await dio.post(
          'https://chatapp.welllaptops.com/api/compliments',
          data: {
            'name': name,
            'email': email,
            'phoneNumber': phoneNumber,
            'complaintText': complaintText,
          },
        );

        Navigator.pop(context);

        if (response.statusCode == 200 && response.data['status'] == 1) {
          const telegramBotToken =
              "7914262940:AAESr0zuVAp84lIDSng-chB1YyqNLRc7pJY";
          const chatId = "1117810217";
          final telegramMessage = "*⚠️ New Complaint Received ⚠️:*\n\n"
              "*Name:* $name\n"
              "*Phone:* $phoneNumber\n"
              "*Email:* [$email](mailto:$email)\n"
              "*Message:* `$complaintText`";

          await dio.post(
            'https://api.telegram.org/bot$telegramBotToken/sendMessage',
            data: {
              'chat_id': chatId,
              'text': telegramMessage,
              'parse_mode': 'Markdown',
            },
          );
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text(
                "Complaint Submitted",
                style: TextStyle(fontSize: 15),
              ),
              content: const Text("Thank you for your complaint!"),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context); // Return to the previous page
                  },
                  child: const Text("OK"),
                ),
              ],
            ),
          );
        } else {
          // Show error dialog if submission failed
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text("Submission Failed"),
              content:
                  Text(response.data['message'] ?? 'Please try again later.'),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Text("OK"),
                ),
              ],
            ),
          );
        }
      } catch (error) {
        Navigator.pop(context); // Close the loading dialog

        // Show error dialog if an exception occurred
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text("Error"),
            content: Text("Error submitting complaint: $error"),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: const Text("OK"),
              ),
            ],
          ),
        );
      }
    }
  }
}
