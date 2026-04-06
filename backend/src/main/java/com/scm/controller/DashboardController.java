package com.scm.controller;

import com.scm.service.interfaces.ContactService;
import com.scm.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ContactService contactService;
    private final UserService userService;

    /** GET /api/dashboard — returns stats for the current user */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard(Authentication auth) {
        var user = userService.getCurrentUser(auth.getName());
        long totalContacts = contactService.getContactCount(user.getId());

        Map<String, Object> data = new HashMap<>();
        data.put("user", user);
        data.put("totalContacts", totalContacts);

        return ResponseEntity.ok(data);
    }
}
