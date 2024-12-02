import 'package:coffegram/store/chats_data.dart';
import 'package:coffegram/store/reciver_data.dart';
import 'package:coffegram/store/socket_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'auth/login_page.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => SocketProvider()),
        ChangeNotifierProvider(create: (context) => ChatBoxStateProvider()),
        ChangeNotifierProvider(create: (context) => ReceiverProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Coffeegram',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const LoginPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}
