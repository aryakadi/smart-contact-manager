package com.scm.service.interfaces;

import java.util.Map;

public interface AuthService {
    Map<String, Object> register(String name, String email, String password);
    Map<String, Object> login(String email, String password);
}
