class User {
  final String id;
  final String name;
  final String profilePic;
  final String lastSeen;
  final bool deletedAccount;

  User({
    required this.id,
    required this.name,
    required this.profilePic,
    required this.lastSeen,
    required this.deletedAccount,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? '', // Default to empty string if null
      name: json['name'] ?? 'Unknown', // Default to 'Unknown' if null
      profilePic: json['profile_pic'] ?? '', // Default to empty string
      lastSeen: json['lastSeen'] ?? '', // Default to empty string
      deletedAccount: json['deletedAccount'] ?? false,
    );
  }
}

class Message {
  final String text;

  Message({required this.text});

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      text: json['text'] ?? '', // Default to empty string
    );
  }
}

class Conversation {
  final String id;
  final User sender;
  final User receiver;
  final Message lastMessage;

  Conversation({
    required this.id,
    required this.sender,
    required this.receiver,
    required this.lastMessage,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: json['_id'] ?? '', // Default to empty string if null
      sender:
          User.fromJson(json['sender'] ?? {}), // Handle possible null sender
      receiver: User.fromJson(
          json['receiver'] ?? {}), // Handle possible null receiver
      lastMessage: Message.fromJson(
          json['lastMessage'] ?? {}), // Handle possible null last message
    );
  }
}
