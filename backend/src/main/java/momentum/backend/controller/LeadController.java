package momentum.backend.controller;

import momentum.backend.model.Lead;
import momentum.backend.repository.LeadRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import momentum.backend.model.User;
import momentum.backend.repository.UsersRepository;
import momentum.backend.service.NotificationService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class LeadController {

    private final LeadRepository leadRepository;
    private final NotificationService notificationService; // Add this
    private final UsersRepository usersRepository;         // Add this

    public LeadController(LeadRepository leadRepository, NotificationService notificationService, UsersRepository usersRepository) {
        this.leadRepository = leadRepository;
        this.notificationService = notificationService;
        this.usersRepository = usersRepository;
    }

    // Public Endpoint: Submit Contact Form
    @PostMapping("/contact")
    public ResponseEntity<?> submitContact(@RequestBody Lead lead) {
        lead.setSource("CONTACT_US");
        if (lead.getProgram() == null || lead.getProgram().isEmpty()) {
            lead.setProgram("General Inquiry");
        }
        Lead savedLead = leadRepository.save(lead);

        // --- NEW CODE: NOTIFY ADMINS ---
        List<User> admins = usersRepository.findByRole(User.Role.admin);
        for (User admin : admins) {
            notificationService.sendNotification(
                    admin,
                    "New Inquiry from " + savedLead.getName(),
                    "/admin/leads" // Link to redirect
            );
        }
        // -------------------------------

        return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
    }


    // Public Endpoint: Submit Enrollment
    @PostMapping("/enroll")
    public ResponseEntity<?> submitEnrollment(@RequestBody Lead lead) {
        lead.setSource("ENROLLMENT");
        Lead savedLead = leadRepository.save(lead); // Capture saved lead

        // --- ADD THIS BLOCK (Copied from contact) ---
        List<User> admins = usersRepository.findByRole(User.Role.admin);
        for (User admin : admins) {
            notificationService.sendNotification(
                    admin,
                    "New Enrollment: " + savedLead.getName(),
                    "/admin/leads"
            );
        }
        // --------------------------------------------

        return ResponseEntity.ok(Map.of("message", "Enrollment request submitted successfully"));
    }

    // Admin Endpoint: Get All Leads
    @GetMapping
    public ResponseEntity<List<Lead>> getAllLeads() {
        return ResponseEntity.ok(leadRepository.findAllByOrderByCreatedAtDesc());
    }

    // Admin Endpoint: Update Lead Status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return leadRepository.findById(id).map(lead -> {
            if (payload.containsKey("status")) {
                lead.setStatus(payload.get("status"));
                leadRepository.save(lead);
                return ResponseEntity.ok(lead);
            }
            return ResponseEntity.badRequest().body("Status is required");
        }).orElse(ResponseEntity.notFound().build());
    }
}