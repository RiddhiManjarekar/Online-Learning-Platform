
package com.learningplatform.controller;

import com.learningplatform.dto.ContactRequest;
import com.learningplatform.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

        private final ContactService contactService;

        public ContactController(ContactService contactService) {
                this.contactService = contactService;
        }

        @PostMapping
        public ResponseEntity<Map<String, String>> submitContactMessage(
                @Valid @RequestBody ContactRequest request
        ) {
                contactService.saveMessage(request);

                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(Map.of(
                                "message",
                                "Your message has been submitted successfully."
                        ));
        }
}
