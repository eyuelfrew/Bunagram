import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late WebViewController controller;

  @override
  void initState() {
    super.initState();

    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            print('Page started loading: $url');
          },
          onPageFinished: (String url) {
            print('Page finished loading: $url');
          },
          onProgress: (int progress) {
            // Update loading bar (if you have one)
          },
          onHttpError: (HttpResponseError error) {
            print('HTTP error: ${error}');
          },
          onWebResourceError: (WebResourceError error) {
            print(
              'Web resource error: ${error.errorCode} - ${error.description}',
            );
          },
          onNavigationRequest: (NavigationRequest request) {
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(
          Uri.parse('https://bunagram.vercel.app')); // Your React Chat App URL
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Chat App WebView',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Chat App'),
        ),
        body: WebViewWidget(
          controller: controller,
        ),
      ),
    );
  }
}
