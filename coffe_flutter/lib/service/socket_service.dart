import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  late IO.Socket socket;

  void initializeSocket(String token) {
    socket = IO.io(
      "http://192.168.1.6:5000",
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

  void disconnect() {
    socket.disconnect();
  }
}
