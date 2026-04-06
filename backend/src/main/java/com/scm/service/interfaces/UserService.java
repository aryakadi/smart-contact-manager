package com.scm.service.interfaces;

import com.scm.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    User getCurrentUser(String email);
    User updateUser(String email, String name, MultipartFile profilePic) throws Exception;
}
