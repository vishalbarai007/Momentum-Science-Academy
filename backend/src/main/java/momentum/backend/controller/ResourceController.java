package momentum.backend.controller;

import momentum.backend.model.Resource;
import momentum.backend.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resources")
@CrossOrigin(origins = "http://localhost:3000") // Adjust for production
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    /**
     * Handles resource upload via JSON body from the frontend.
     * Note: This assumes the ResourceService.uploadResource method has been updated
     * to accept the ResourceUploadRequest DTO instead of individual parameters and MultipartFile.
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResource(@RequestBody ResourceUploadRequest request) {

        // Validate basic required fields
        if (request.getTitle() == null || request.getFileLink() == null || request.getResourceType() == null || request.getSubject() == null || request.getClassLevel() == null) {
            return ResponseEntity.badRequest().body("Missing required fields: title, fileLink, resourceType, subject, classLevel.");
        }

        try {
            // Get currently logged-in user from SecurityContext
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName(); // In JWT config, username is mapped to email

            // The service call is now simplified to pass the request DTO
            Resource createdResource = resourceService.uploadResource(request, email);

            return ResponseEntity.status(201).body(createdResource);
        } catch (RuntimeException e) {
            // Catches errors like "User not found" or "Unauthorized" from the service layer
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/my-uploads")
    public ResponseEntity<?> getMyUploads() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return ResponseEntity.ok(resourceService.getMyUploads(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok().body("{\"success\": true, \"message\": \"Resource deleted\"}");
    }

    /**
     * Data Transfer Object (DTO) to map the incoming JSON body from the frontend.
     */
    public static class ResourceUploadRequest {
        private String title;
        private String description;
        private String resourceType; // pq, notes, assignment, imp
        private String subject;
        private String classLevel;   // Maps to targetClass in the backend model
        private String examType;     // Maps to exam in the backend model
        private String fileLink;     // Maps to fileUrl in the backend model
        private String visibility;   // "publish" or "draft"

        // Standard Getters and Setters (IntelliJ or Lombok can generate these)
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getResourceType() { return resourceType; }
        public void setResourceType(String resourceType) { this.resourceType = resourceType; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getClassLevel() { return classLevel; }
        public void setClassLevel(String classLevel) { this.classLevel = classLevel; }
        public String getExamType() { return examType; }
        public void setExamType(String examType) { this.examType = examType; }
        public String getFileLink() { return fileLink; }
        public void setFileLink(String fileLink) { this.fileLink = fileLink; }
        public String getVisibility() { return visibility; }
        public void setVisibility(String visibility) { this.visibility = visibility; }
    }
}