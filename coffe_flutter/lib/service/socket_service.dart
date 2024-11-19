import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  late IO.Socket socket;

  void initializeSocket(String token) {
    socket = IO.io(
      "https://www.chatapp.welllaptops.com",
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setAuth({'token': token})
          .build(),
    );

    socket.connect();

    socket.onConnect((_) {
      print('Connected Successfully');
      // Additional event handling
    });

    socket.onDisconnect((_) {
      print("Socket Disconnected");
    });
    socket.on('onlineuser', (data) {
      if (data != null && data is List) {
        _handleOnlineUsers(List<String>.from(data));
      }
    });
  }

  bool get isConnected => socket.connected;
  void disconnect() {
    if (isConnected) {
      socket.disconnect();
    }
  }

  Function(List<String>)? onOnlineUsersReceived;

  void _handleOnlineUsers(List<String> onlineUsers) {
    if (onOnlineUsersReceived != null) {
      onOnlineUsersReceived!(onlineUsers);
    }
  }
}
