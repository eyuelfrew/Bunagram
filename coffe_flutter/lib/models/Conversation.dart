class User {
  final String id;
  final String name;
  final String profilePic;
  final String lastSeen;
  final String bio;
  final String email;
  final String username;
  final bool deletedAccount;
  final String joinedDate;

  User({
    required this.id,
    required this.name,
    required this.profilePic,
    required this.lastSeen,
    required this.deletedAccount,
    required this.email,
    required this.bio,
    required this.username,
    required this.joinedDate,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? '',
      name: json['name'] ?? 'Unknown',
      profilePic: json['profile_pic'] ?? '',
      lastSeen: json['lastSeen'] ?? '',
      bio: json['bio'] ?? '',
      email: json['email'] ?? '',
      username: json['username'] ?? '',
      joinedDate: json['createdAt'] ?? '',
      deletedAccount: json['deletedAccount'] ?? false,
    );
  }
}

class Message {
  final String text;
  final bool seen;
  Message({required this.text, required this.seen});

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(text: json['text'] ?? '', seen: false);
  }
}

class Conversation {
  final String id;
  final User sender;
  final User receiver;
  final Message lastMessage;
  final User? userDetails; // Optional field for storing user details
  final int unseenMessages;

  Conversation({
    required this.id,
    required this.sender,
    required this.receiver,
    required this.lastMessage,
    this.userDetails,
    this.unseenMessages = 0,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: json['_id'] ?? '',
      sender: User.fromJson(json['sender'] ?? {}),
      receiver: User.fromJson(json['receiver'] ?? {}),
      lastMessage: Message.fromJson(json['lastMessage'] ?? {}),
      unseenMessages: json['unseenMessages'] ?? 0,
    );
  }

  Conversation copyWith({
    String? id,
    User? sender,
    User? receiver,
    Message? lastMessage,
    User? userDetails,
    int? unseenMessages,
  }) {
    return Conversation(
      id: id ?? this.id,
      sender: sender ?? this.sender,
      receiver: receiver ?? this.receiver,
      lastMessage: lastMessage ?? this.lastMessage,
      userDetails: userDetails ?? this.userDetails,
      unseenMessages: unseenMessages ?? this.unseenMessages,
    );
  }
}
