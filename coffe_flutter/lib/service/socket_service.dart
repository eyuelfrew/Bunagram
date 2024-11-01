import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class SocketService {
  late IO.Socket socket;
  String? apiUrl = dotenv.env['BACKEND_API_URL'];
  void initializeSocket(String token) {
    socket = IO.io(
      "${apiUrl}:5000",
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
  }

  bool get isConnected => socket.connected;
  void disconnect() {
    if (isConnected) {
      socket.disconnect();
    }
  }
}
