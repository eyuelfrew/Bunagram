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
      id: json['_id'] ?? '',
      name: json['name'] ?? 'Unknown',
      profilePic: json['profile_pic'] ?? '',
      lastSeen: json['lastSeen'] ?? '',
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
  final User? userDetails; // Optional field for storing user details

  Conversation({
    required this.id,
    required this.sender,
    required this.receiver,
    required this.lastMessage,
    this.userDetails,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: json['_id'] ?? '',
      sender: User.fromJson(json['sender'] ?? {}),
      receiver: User.fromJson(json['receiver'] ?? {}),
      lastMessage: Message.fromJson(json['lastMessage'] ?? {}),
    );
  }

  // The copyWith method
  Conversation copyWith({
    String? id,
    User? sender,
    User? receiver,
    Message? lastMessage,
    User? userDetails,
  }) {
    return Conversation(
      id: id ?? this.id,
      sender: sender ?? this.sender,
      receiver: receiver ?? this.receiver,
      lastMessage: lastMessage ?? this.lastMessage,
      userDetails: userDetails ?? this.userDetails,
    );
  }
}
