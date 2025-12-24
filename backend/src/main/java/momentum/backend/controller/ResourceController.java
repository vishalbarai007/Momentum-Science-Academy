package momentum.backend.controller;

import momentum.backend.model.Resource;
import momentum.backend.model.User;
import momentum.backend.service.ResourceService;
import momentum.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/resources")
@CrossOrigin(origins = "http://localhost:3000")
public class ResourceController {

    private final ResourceService resourceService;
    private final UserService userService;

    public ResourceController(ResourceService resourceService, UserService userService) {
        this.resourceService = resourceService;
        this.userService = userService;
    }

    // ==========================================
    // 1. UPLOAD (Create)
    // ==========================================
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResource(@RequestBody ResourceUploadRequest request) {
        if (request.getTitle() == null || request.getFileLink() == null || request.getResourceType() == null || request.getSubject() == null || request.getTargetClass() == null) {
            return ResponseEntity.badRequest().body("Missing required fields.");
        }

        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Resource createdResource = resourceService.uploadResource(request, auth.getName());

            // Map Entity -> DTO (Fixes React Error)
            return ResponseEntity.status(201).body(mapToDTO(createdResource));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==========================================
    // 2. UPDATE
    // ==========================================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateResource(@PathVariable Long id, @RequestBody ResourceUploadRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Resource updatedResource = resourceService.updateResource(id, request, auth.getName());

            // Map Entity -> DTO
            return ResponseEntity.ok(mapToDTO(updatedResource));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==========================================
    // 3. TRACK DOWNLOAD (NEW ENDPOINT)
    // ==========================================
    @PostMapping("/{id}/track-download")
    public ResponseEntity<?> trackDownload(@PathVariable Long id) {
        try {
            // Calls the service method to increment the counter
            resourceService.incrementDownload(id);
            return ResponseEntity.ok().body("{\"success\": true}");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==========================================
    // 4. GET ALL (Filtered by Role & Tags)
    // ==========================================
    @GetMapping
    public ResponseEntity<List<ResourceResponseDTO>> getAllResources() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName());

        List<Resource> allResources = resourceService.getAllResources();
        List<Resource> filteredList;

        // Filter Logic
        if (user != null && user.getRole() == User.Role.student) {
            Set<String> accessTags = user.getAccessTags();

            if (accessTags == null || accessTags.isEmpty()) {
                return ResponseEntity.ok(List.of());
            }

            // Student: Only show published + matching tags
            filteredList = allResources.stream()
                    .filter(r -> Boolean.TRUE.equals(r.getIsPublished())) // Must be published
                    .filter(resource ->
                            // Your Access Tag Logic
                            accessTags.contains(String.valueOf(resource.getTargetClass())) &&
                                    accessTags.contains(resource.getExam()) &&
                                    accessTags.contains(resource.getSubject())
                    )
                    .collect(Collectors.toList());
        } else {
            // Teacher/Admin: See everything
            filteredList = allResources;
        }

        // Convert to DTOs for response
        List<ResourceResponseDTO> response = filteredList.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // 5. GET STUDENT ASSIGNMENTS (Filtered)
    // ==========================================
    @GetMapping("/assignments")
    public ResponseEntity<List<ResourceResponseDTO>> getStudentAssignments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User student = userService.findByEmail(auth.getName());

        if (student == null) return ResponseEntity.notFound().build();

        List<Resource> allResources = resourceService.getAllResources();
        Set<String> accessTags = student.getAccessTags();

        List<Resource> assignments = allResources.stream()
                // Type Check: Must be an Assignment
                .filter(r -> r.getType() == Resource.ResourceType.assignment)
                // Visibility Check: Must be Published
                .filter(r -> Boolean.TRUE.equals(r.getIsPublished()))
                // Access Check: Must match student's tags
                .filter(r -> accessTags != null && (
                        accessTags.contains(String.valueOf(r.getTargetClass())) &&
                                accessTags.contains(r.getExam()) &&
                                accessTags.contains(r.getSubject())
                ))
                .collect(Collectors.toList());

        // Convert to DTOs
        List<ResourceResponseDTO> response = assignments.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // 6. GET MY UPLOADS
    // ==========================================
    @GetMapping("/my-uploads")
    public ResponseEntity<List<ResourceResponseDTO>> getMyUploads() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<Resource> myResources = resourceService.getMyUploads(auth.getName());

        List<ResourceResponseDTO> response = myResources.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // 7. DELETE
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok().body("{\"success\": true, \"message\": \"Resource deleted\"}");
    }

    // ==========================================
    // HELPER: Map Entity to DTO
    // ==========================================
    private ResourceResponseDTO mapToDTO(Resource resource) {
        ResourceResponseDTO dto = new ResourceResponseDTO();
        dto.setId(resource.getId());
        dto.setTitle(resource.getTitle());
        dto.setDescription(resource.getDescription());
        dto.setType(resource.getType().toString());
        dto.setSubject(resource.getSubject());
        dto.setTargetClass(String.valueOf(resource.getTargetClass()));
        dto.setExam(resource.getExam());
        dto.setDownloads(resource.getDownloads());
        dto.setFileUrl(resource.getFileUrl());
        dto.setCreatedAt(resource.getCreatedAt());
        dto.setIsPublished(resource.getIsPublished());

        // CRITICAL FIX: Extract String Name to prevent React Error
        if (resource.getUploadedBy() != null) {
            dto.setUploadedBy(resource.getUploadedBy().getFullName());
        } else {
            dto.setUploadedBy("Unknown Teacher");
        }

        return dto;
    }

    // ==========================================
    // DTO CLASSES
    // ==========================================

    public static class ResourceUploadRequest {
        private String title;
        private String description;
        private String resourceType;
        private String subject;
        private Integer targetClass; // Kept as Integer per your code
        private String examType;
        private String fileLink;
        private String visibility;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getResourceType() { return resourceType; }
        public void setResourceType(String resourceType) { this.resourceType = resourceType; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public Integer getTargetClass() { return targetClass; }
        public void setTargetClass(Integer targetClass) { this.targetClass = targetClass; }
        public String getExamType() { return examType; }
        public void setExamType(String examType) { this.examType = examType; }
        public String getFileLink() { return fileLink; }
        public void setFileLink(String fileLink) { this.fileLink = fileLink; }
        public String getVisibility() { return visibility; }
        public void setVisibility(String visibility) { this.visibility = visibility; }
    }

    // The Safe Response Object
    public static class ResourceResponseDTO {
        private Long id;
        private String title;
        private String description;
        private String type;
        private String subject;
        private String targetClass;
        private String exam;
        private Long downloads;
        private String fileUrl;
        private Date createdAt;
        private String uploadedBy; // String only!
        private Boolean isPublished;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getTargetClass() { return targetClass; }
        public void setTargetClass(String targetClass) { this.targetClass = targetClass; }
        public String getExam() { return exam; }
        public void setExam(String exam) { this.exam = exam; }
        public Long getDownloads() { return downloads; }
        public void setDownloads(Long downloads) { this.downloads = downloads; }
        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
        public Date getCreatedAt() { return createdAt; }
        public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
        public String getUploadedBy() { return uploadedBy; }
        public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
        public Boolean getIsPublished() { return isPublished; }
        public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }
    }
}