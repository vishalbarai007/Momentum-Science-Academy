package momentum.backend.controller;

import momentum.backend.model.Assignment;
import momentum.backend.service.AssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assignments")
@CrossOrigin(origins = "http://localhost:3000")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // --- NEW: Upload Endpoint ---
    @PostMapping("/upload")
    public ResponseEntity<?> uploadAssignment(@RequestBody AssignmentUploadRequest request) {
        // Basic Validation
        if (request.getTitle() == null || request.getFileLink() == null || request.getDueDate() == null) {
            return ResponseEntity.badRequest().body("Missing required fields: Title, File Link, and Due Date are mandatory.");
        }

        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            // Call service to create assignment
            Assignment createdAssignment = assignmentService.createAssignment(request, email);

            return ResponseEntity.ok(createdAssignment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<StudentAssignmentDTO>> getMyAssignments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return ResponseEntity.ok(assignmentService.getAssignmentsWithStatus(email));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitAssignment(@PathVariable Long id, @RequestBody SubmissionRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assignmentService.submitAssignment(id, req.getFileUrl(), auth.getName());
        return ResponseEntity.ok("Assignment submitted successfully");
    }

    // --- DTOs ---

    // DTO for Uploading (Matches Frontend Form)
    public static class AssignmentUploadRequest {
        private String title;
        private String description;
        private String subject;
        private Integer targetClass;
        private String examType;
        private String fileLink;
        private String dueDate;    // String format YYYY-MM-DD from frontend
        private String difficulty; // Easy, Medium, Hard
        private String visibility; // publish/draft

        // Getters and Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public Integer getTargetClass() { return targetClass; }
        public void setTargetClass(Integer targetClass) { this.targetClass = targetClass; }
        public String getExamType() { return examType; }
        public void setExamType(String examType) { this.examType = examType; }
        public String getFileLink() { return fileLink; }
        public void setFileLink(String fileLink) { this.fileLink = fileLink; }
        public String getDueDate() { return dueDate; }
        public void setDueDate(String dueDate) { this.dueDate = dueDate; }
        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
        public String getVisibility() { return visibility; }
        public void setVisibility(String visibility) { this.visibility = visibility; }
    }

    // DTO for returning data to Student (Existing)
    public static class StudentAssignmentDTO {
        public Long id;
        public String title;
        public String subject;
        public String teacher;
        public String dueDate;
        public String status;
        public String difficulty;
        public String questionFileUrl;
        public String submissionFileUrl;
        public String score;

        public StudentAssignmentDTO(Long id, String title, String subject, String teacher, String dueDate, String status, String difficulty, String questionFileUrl, String submissionFileUrl, String score) {
            this.id = id;
            this.title = title;
            this.subject = subject;
            this.teacher = teacher;
            this.dueDate = dueDate;
            this.status = status;
            this.difficulty = difficulty;
            this.questionFileUrl = questionFileUrl;
            this.submissionFileUrl = submissionFileUrl;
            this.score = score;
        }
    }

    // DTO for submission (Existing)
    public static class SubmissionRequest {
        private String fileUrl;
        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    }
}