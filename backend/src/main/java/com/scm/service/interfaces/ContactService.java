package com.scm.service.interfaces;

import com.scm.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface ContactService {
    Contact createContact(String userId, Contact contact, MultipartFile image) throws Exception;
    Page<Contact> getContacts(String userId, int page, int size);
    Page<Contact> getFavoriteContacts(String userId, int page, int size);
    Contact getContactById(String userId, String contactId);
    Contact updateContact(String userId, String contactId, Contact updated, MultipartFile image) throws Exception;
    void deleteContact(String userId, String contactId);
    Page<Contact> searchContacts(String userId, String field, String keyword, int page, int size);
    long getContactCount(String userId);
    long getFavoriteContactCount(String userId);
    java.util.List<java.util.Map<String, Object>> getGroupStats(String userId);
    java.util.List<java.util.Map<String, Object>> getWeeklyStats(String userId);
}
