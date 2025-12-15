package momentum.backend.controller;

import momentum.backend.model.Lead;
import momentum.backend.repository.LeadRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class LeadController {

    private final LeadRepository leadRepository;

    public LeadController(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    // Public Endpoint: Submit Contact Form
    @PostMapping("/contact")
    public ResponseEntity<?> submitContact(@RequestBody Lead lead) {
        lead.setSource("CONTACT_US");
        if (lead.getProgram() == null || lead.getProgram().isEmpty()) {
            lead.setProgram("General Inquiry");
        }
        leadRepository.save(lead);
        return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
    }

    // Public Endpoint: Submit Enrollment
    @PostMapping("/enroll")
    public ResponseEntity<?> submitEnrollment(@RequestBody Lead lead) {
        lead.setSource("ENROLLMENT");
        leadRepository.save(lead);
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