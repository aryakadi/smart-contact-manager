package com.scm.service.implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.scm.entity.User;
import com.scm.exception.ResourceNotFoundException;
import com.scm.repository.UserRepository;
import com.scm.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    /** Used by Spring Security to load user for authentication */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
    }

    @Override
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User updateUser(String email, String name, MultipartFile profilePic) throws Exception {
        User existing = getCurrentUser(email);

        if (name != null && !name.isBlank()) {
            existing.setName(name);
        }

        if (profilePic != null && !profilePic.isEmpty()) {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    profilePic.getBytes(),
                    ObjectUtils.asMap("folder", "scm/profiles")
            );
            existing.setProfilePic((String) uploadResult.get("secure_url"));
        }

        return userRepository.save(existing);
    }
}
