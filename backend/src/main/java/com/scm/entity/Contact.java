package com.scm.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Document(collection = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {

    @Id
    private String id;

    @NotBlank(message = "Contact name is required")
    private String name;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    private String address;

    private String description;

    /** Cloudinary URL for contact image */
    private String image;

    /** Optional: LinkedIn profile URL */
    private String linkedinLink;

    /** Optional: Gmail / Google profile link */
    private String gmailLink;

    /** Reference to the owning User's ID */
    private String userId;

    private boolean favorite;
    
    /** Group category: Work, Family, College, Friends */
    private String group;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
