import 'package:flutter/material.dart';

class SearchBar extends StatelessWidget {
  final TextEditingController controller;
  final Function(String) onSearch;

  const SearchBar(
      {super.key, required this.controller, required this.onSearch});

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      onChanged: onSearch,
      decoration: const InputDecoration(
        hintText: 'Search users...',
        border: InputBorder.none,
        suffixIcon: Icon(Icons.search),
      ),
    );
  }
}
