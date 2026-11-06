
package com.learningplatform.service;

import com.learningplatform.dto.ContactRequest;
import com.learningplatform.entity.ContactMessage;
import com.learningplatform.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public void saveMessage(ContactRequest request) {

        ContactMessage contactMessage = new ContactMessage(
                request.name().trim(),
                request.email().trim().toLowerCase(),
                request.subject().trim(),
                request.message().trim()
        );

        contactMessageRepository.save(contactMessage);
    }
}
