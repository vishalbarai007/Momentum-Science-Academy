package momentum.backend.controller;

import momentum.backend.model.Resource;
import momentum.backend.model.User;
import momentum.backend.service.ResourceService;
import momentum.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/resources")
@CrossOrigin(origins = "http://localhost:3000") // Adjust for production
public class ResourceController {

    private final ResourceService resourceService;
    private final UserService userService; // 1. Added UserService field

    // 2. Updated Constructor to inject UserService
    public ResourceController(ResourceService resourceService, UserService userService) {
        this.resourceService = resourceService;
        this.userService = userService;
    }

    /**
     * Handles resource upload via JSON body from the frontend.
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

    /**
     * Smart Endpoint: Returns resources based on User Role.
     * - Teachers/Admins: Get ALL resources.
     * - Students: Get ONLY resources matching their Access Tags.
     */
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        // 1. Identify the User
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.findByEmail(email);

        // 2. Fetch all resources from DB
        List<Resource> allResources = resourceService.getAllResources();

        // 3. Filter based on Role
        if (user != null && user.getRole() == User.Role.student) {
            Set<String> accessTags = user.getAccessTags();

            // If student has no tags, return empty list (Strict security)
            if (accessTags == null || accessTags.isEmpty()) {
                return ResponseEntity.ok(List.of());
            }

            // Filter: Keep resource if its Class OR Exam OR Subject matches user's tags
            List<Resource> filteredResources = allResources.stream()
                    .filter(resource ->
                            accessTags.contains(resource.getTargetClass()) ||
                                    accessTags.contains(resource.getExam()) ||
                                    accessTags.contains(resource.getSubject())
                    )
                    .collect(Collectors.toList());

            return ResponseEntity.ok(filteredResources);
        }

        // 4. Return all for Teachers/Admins
        return ResponseEntity.ok(allResources);
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

        // Standard Getters and Setters
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