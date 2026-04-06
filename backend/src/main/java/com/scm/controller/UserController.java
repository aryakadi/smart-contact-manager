package com.scm.controller;

import com.scm.entity.User;
import com.scm.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** GET /api/users/me — return current authenticated user profile */
    @GetMapping("/me")
    public ResponseEntity<User> getProfile(Authentication auth) {
        return ResponseEntity.ok(userService.getCurrentUser(auth.getName()));
    }

    /** PUT /api/users/me — update name and/or profile picture */
    @PutMapping(value = "/me", consumes = "multipart/form-data")
    public ResponseEntity<User> updateProfile(
            Authentication auth,
            @RequestParam(required = false) String name,
            @RequestPart(value = "profilePic", required = false) MultipartFile profilePic
    ) throws Exception {
        return ResponseEntity.ok(userService.updateUser(auth.getName(), name, profilePic));
    }
}
