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
      id: json['_id'],
      name: json['name'],
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
      text: json['text'],
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
      id: json['_id'],
      sender: User.fromJson(json['sender']),
      receiver: User.fromJson(json['receiver']),
      lastMessage: Message.fromJson(json['lastMessage']),
    );
  }
}
