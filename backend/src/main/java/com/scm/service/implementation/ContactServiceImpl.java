package com.scm.service.implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.scm.entity.Contact;
import com.scm.exception.ResourceNotFoundException;
import com.scm.exception.UnauthorizedException;
import com.scm.repository.ContactRepository;
import com.scm.service.interfaces.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final Cloudinary cloudinary;

    @Override
    public Contact createContact(String userId, Contact contact, MultipartFile image) throws Exception {
        contact.setUserId(userId);

        if (image != null && !image.isEmpty()) {
            Map<?, ?> result = cloudinary.uploader().upload(
                    image.getBytes(),
                    ObjectUtils.asMap("folder", "scm/contacts")
            );
            contact.setImage((String) result.get("secure_url"));
        }

        return contactRepository.save(contact);
    }

    @Override
    public Page<Contact> getContacts(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return contactRepository.findByUserId(userId, pageable);
    }

    @Override
    public Page<Contact> getFavoriteContacts(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return contactRepository.findByUserIdAndFavoriteTrue(userId, pageable);
    }

    @Override
    public Contact getContactById(String userId, String contactId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + contactId));

        // Prevent horizontal privilege escalation
        if (!contact.getUserId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to access this contact");
        }

        return contact;
    }

    @Override
    public Contact updateContact(String userId, String contactId,
                                 Contact updated, MultipartFile image) throws Exception {
        Contact existing = getContactById(userId, contactId);

        if (updated.getName() != null && !updated.getName().isBlank())
            existing.setName(updated.getName());
        if (updated.getEmail() != null)       existing.setEmail(updated.getEmail());
        if (updated.getPhone() != null)       existing.setPhone(updated.getPhone());
        if (updated.getAddress() != null)     existing.setAddress(updated.getAddress());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getLinkedinLink() != null) existing.setLinkedinLink(updated.getLinkedinLink());
        if (updated.getGmailLink() != null)   existing.setGmailLink(updated.getGmailLink());
        
        // Favorite state update (it's a primitive boolean, so we just blindly copy it. 
        // If it comes through the JSON, Jackson will map it to true/false natively)
        existing.setFavorite(updated.isFavorite());
        
        if (updated.getGroup() != null) existing.setGroup(updated.getGroup().isBlank() ? null : updated.getGroup());

        if (image != null && !image.isEmpty()) {
            Map<?, ?> result = cloudinary.uploader().upload(
                    image.getBytes(),
                    ObjectUtils.asMap("folder", "scm/contacts")
            );
            existing.setImage((String) result.get("secure_url"));
        }

        return contactRepository.save(existing);
    }

    @Override
    public void deleteContact(String userId, String contactId) {
        Contact contact = getContactById(userId, contactId);
        contactRepository.delete(contact);
    }

    @Override
    public Page<Contact> searchContacts(String userId, String field, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        switch (field.toLowerCase()) {
            case "email":
                return contactRepository.findByUserIdAndEmailContainingIgnoreCase(userId, keyword, pageable);
            case "address":
                return contactRepository.findByUserIdAndAddressContainingIgnoreCase(userId, keyword, pageable);
            case "description":
                return contactRepository.findByUserIdAndDescriptionContainingIgnoreCase(userId, keyword, pageable);
            case "group":
                return contactRepository.findByUserIdAndGroupIgnoreCase(userId, keyword, pageable);
            case "name":
            default:
                return contactRepository.findByUserIdAndNameContainingIgnoreCase(userId, keyword, pageable);
        }
    }

    @Override
    public long getContactCount(String userId) {
        return contactRepository.countByUserId(userId);
    }

    @Override
    public long getFavoriteContactCount(String userId) {
        return contactRepository.countByUserIdAndFavoriteTrue(userId);
    }

    @Override
    public List<Map<String, Object>> getGroupStats(String userId) {
        List<Contact> contacts = contactRepository.findAllByUserId(userId);
        Map<String, Long> groupCounts = contacts.stream()
                .filter(c -> c.getGroup() != null && !c.getGroup().trim().isEmpty())
                .collect(Collectors.groupingBy(Contact::getGroup, Collectors.counting()));

        List<Map<String, Object>> groupStats = new ArrayList<>();
        for (Map.Entry<String, Long> entry : groupCounts.entrySet()) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", entry.getKey());
            map.put("value", entry.getValue());
            groupStats.add(map);
        }
        return groupStats;
    }

    @Override
    public List<Map<String, Object>> getWeeklyStats(String userId) {
        List<Contact> contacts = contactRepository.findAllByUserId(userId);
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        
        int[] counts = new int[8];
        for (Contact c : contacts) {
            if (c.getCreatedAt() != null && c.getCreatedAt().isAfter(oneWeekAgo)) {
                counts[c.getCreatedAt().getDayOfWeek().getValue()]++;
            }
        }

        List<Map<String, Object>> weeklyStats = new ArrayList<>();
        String[] days = {"", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        for (int i = 1; i <= 7; i++) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", days[i]);
            map.put("added", counts[i]);
            weeklyStats.add(map);
        }
        return weeklyStats;
    }
}
