import 'dart:io';

import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketProvider extends ChangeNotifier {
  IO.Socket? _socket;
  bool _isInitialized = false;

  /// Getter for the socket instance
  IO.Socket? get socket => _socket;

  /// Getter for connection status
  bool get isConnected => _socket?.connected ?? false;

  /// Initialize the socket connection
  void initializeSocket(String token) {
    if (_isInitialized) return;

    _isInitialized = true;
    HttpOverrides.global = MyHttpOverrides();
    _socket = IO.io(
      "https://chatapp.welllaptops.com",
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect() // Prevent auto-connection
          .setAuth({'token': token})
          .setExtraHeaders({'rejectUnauthorized': 'false'})
          .build(),
    );

    _socket!.connect();
    _socket?.on('onlineuser', (data) {
      if (onOnlineUsersReceived != null && data is List) {
        onOnlineUsersReceived!(List<String>.from(data));
      }
    });
    // Register event listeners
    _registerSocketEvents();
  }

  /// Disconnect the socket connection
  void disconnect() {
    if (_socket != null) {
      _removeSocketListeners(); // Clean up listeners
      _socket!.disconnect();
      _socket = null;
      _isInitialized = false;
      notifyListeners();
    }
  }

  /// Join a specific room
  void joinRoom(String roomName) {
    _socket?.emit('join-room', {'roomName': roomName});
    debugPrint('Joined room: $roomName');
  }

  /// Leave a specific room
  void leaveRoom(String roomName) {
    _socket?.emit('leave-room', {'roomName': roomName});
    debugPrint('Left room: $roomName');
  }

  /// Register a callback for incoming messages
  void onMessageReceived(Function(dynamic) callback) {
    _socket?.on('new-message', (data) {
      debugPrint("Incoming Message: $data");
      callback(data);
    });
  }

  /// Remove the listener for incoming messages
  void offMessageReceived() {
    _socket?.off('new-message');
  }

  /// Handle receiving online users

  /// Remove the listener for online users
  void offOnlineUsersReceived() {
    _socket?.off('onlineuser');
  }

  Function(List<String>)? onOnlineUsersReceived;

  /// Private method to register all socket events
  void _registerSocketEvents() {
    _socket?.onConnect((_) {
      debugPrint('Socket connected successfully');
      notifyListeners();
    });

    _socket?.onDisconnect((_) {
      debugPrint('Socket disconnected');
      notifyListeners();
    });

    _socket?.onConnectError((error) {
      debugPrint('Connection Error: $error');
    });
  }

  /// Private method to remove all socket event listeners
  void _removeSocketListeners() {
    _socket?.off('connect');
    _socket?.off('disconnect');
    _socket?.off('connect_error');
    _socket?.off('connect_timeout');
    _socket?.off('error');
    _socket?.off('reconnect');
    _socket?.off('reconnect_error');
    _socket?.off('reconnect_failed');
    _socket?.off('onlineuser');
    _socket?.off('new-message');
  }
}

class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
  }
}
