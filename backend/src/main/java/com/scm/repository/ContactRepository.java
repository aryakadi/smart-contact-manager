package com.scm.repository;

import com.scm.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends MongoRepository<Contact, String> {

    Page<Contact> findByUserId(String userId, Pageable pageable);
    
    Page<Contact> findByUserIdAndFavoriteTrue(String userId, Pageable pageable);

    Page<Contact> findByUserIdAndGroupIgnoreCase(String userId, String group, Pageable pageable);

    Page<Contact> findByUserIdAndNameContainingIgnoreCase(String userId, String name, Pageable pageable);
    
    Page<Contact> findByUserIdAndEmailContainingIgnoreCase(String userId, String email, Pageable pageable);
    
    Page<Contact> findByUserIdAndAddressContainingIgnoreCase(String userId, String address, Pageable pageable);
    
    Page<Contact> findByUserIdAndDescriptionContainingIgnoreCase(String userId, String description, Pageable pageable);

    long countByUserId(String userId);

    long countByUserIdAndFavoriteTrue(String userId);
    
    java.util.List<Contact> findAllByUserId(String userId);
}
