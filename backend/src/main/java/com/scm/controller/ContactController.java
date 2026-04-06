package com.scm.controller;

import com.scm.entity.Contact;
import com.scm.service.interfaces.ContactService;
import com.scm.service.interfaces.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    /** POST /api/contacts — create a new contact */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Contact> createContact(
            Authentication auth,
            @RequestPart("contact") String contactJson,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws Exception {
        String userId = userService.getCurrentUser(auth.getName()).getId();
        Contact contact = objectMapper.readValue(contactJson, Contact.class);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contactService.createContact(userId, contact, image));
    }

    /** GET /api/contacts — paginated list of user's contacts */
    @GetMapping
    public ResponseEntity<Page<Contact>> getContacts(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        String userId = userService.getCurrentUser(auth.getName()).getId();
        return ResponseEntity.ok(contactService.getContacts(userId, page, size));
    }

    /** GET /api/contacts/favorites — paginated list of user's favorite contacts */
    @GetMapping("/favorites")
    public ResponseEntity<Page<Contact>> getFavoriteContacts(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        String userId = userService.getCurrentUser(auth.getName()).getId();
        return ResponseEntity.ok(contactService.getFavoriteContacts(userId, page, size));
    }

    /** GET /api/contacts/{id} — single contact */
    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(Authentication auth, @PathVariable String id) {
        String userId = userService.getCurrentUser(auth.getName()).getId();
        return ResponseEntity.ok(contactService.getContactById(userId, id));
    }

    /** PUT /api/contacts/{id} — update contact */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Contact> updateContact(
            Authentication auth,
            @PathVariable String id,
            @RequestPart("contact") String contactJson,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws Exception {
        String userId = userService.getCurrentUser(auth.getName()).getId();
        Contact contact = objectMapper.readValue(contactJson, Contact.class);
        return ResponseEntity.ok(contactService.updateContact(userId, id, contact, image));
    }

    /** DELETE /api/contacts/{id} — delete contact */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(Authentication auth, @PathVariable String id) {
        String userId = userService.getCurrentUser(auth.getName()).getId();
        contactService.deleteContact(userId, id);
        return ResponseEntity.noContent().build();
    }

    /** GET /api/contacts/search?field=email&keyword=abc — search by field */
    @GetMapping("/search")
    public ResponseEntity<Page<Contact>> searchContacts(
            Authentication auth,
            @RequestParam(defaultValue = "name") String field,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        String userId = userService.getCurrentUser(auth.getName()).getId();
        return ResponseEntity.ok(contactService.searchContacts(userId, field, keyword, page, size));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getContactCount(Authentication auth) {
        String userId = userService.getCurrentUser(auth.getName()).getId();
        return ResponseEntity.ok(contactService.getContactCount(userId));
    }

    @GetMapping("/favorites/count")
    public ResponseEntity<Long> getFavoriteContactCount(Authentication auth) {
        String userId = userService.getCurrentUser(auth.getName()).getId();
        return ResponseEntity.ok(contactService.getFavoriteContactCount(userId));
    }

    @GetMapping("/group-stats")
    public ResponseEntity<java.util.List<java.util.Map<String, Object>>> getGroupStats(Authentication auth) {
        String userId = userService.getCurrentUser(auth.getName()).getId();
        return ResponseEntity.ok(contactService.getGroupStats(userId));
    }

    @GetMapping("/weekly-stats")
    public ResponseEntity<java.util.List<java.util.Map<String, Object>>> getWeeklyStats(Authentication auth) {
        String userId = userService.getCurrentUser(auth.getName()).getId();
        return ResponseEntity.ok(contactService.getWeeklyStats(userId));
    }
}
