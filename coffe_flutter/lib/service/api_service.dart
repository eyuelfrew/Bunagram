// lib/services/api_service.dart

import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';

class ApiService {
  static Dio? _dio;
  static CookieJar? _cookieJar;

  static Dio getDioInstance() {
    if (_dio == null) {
      _dio = Dio();
      _cookieJar = CookieJar();
      _dio!.interceptors.add(CookieManager(_cookieJar!));
    }
    return _dio!;
  }

  static CookieJar getCookieJarInstance() {
    if (_cookieJar == null) {
      _cookieJar = CookieJar();
    }
    return _cookieJar!;
  }
}
