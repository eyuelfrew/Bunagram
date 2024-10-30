import 'package:flutter/material.dart';

class DropdownList extends StatelessWidget {
  final List<String> users;
  final Function(String) onSelect;

  const DropdownList({super.key, required this.users, required this.onSelect});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: kToolbarHeight,
      left: 0,
      right: 0,
      child: Card(
        elevation: 4,
        child: ListView.builder(
          shrinkWrap: true,
          itemCount: users.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text(users[index]),
              onTap: () => onSelect(users[index]),
            );
          },
        ),
      ),
    );
  }
}
