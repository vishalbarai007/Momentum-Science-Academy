package momentum.backend.controller;

import momentum.backend.model.Assignment;
import momentum.backend.model.User;
import momentum.backend.repository.AssignmentRepository; // 1. Import
import momentum.backend.repository.UsersRepository;      // 1. Import
import momentum.backend.service.AssignmentService;
import momentum.backend.service.NotificationService;     // 1. Import
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

    // 2. Add Notification Dependencies
    private final NotificationService notificationService;
    private final UsersRepository usersRepository;
    private final AssignmentRepository assignmentRepository;

    // 3. Update Constructor
    public AssignmentController(AssignmentService assignmentService,
                                NotificationService notificationService,
                                UsersRepository usersRepository,
                                AssignmentRepository assignmentRepository) {
        this.assignmentService = assignmentService;
        this.notificationService = notificationService;
        this.usersRepository = usersRepository;
        this.assignmentRepository = assignmentRepository;
    }

    // ==========================================
    // TEACHER ENDPOINTS
    // ==========================================

    /**
     * 1. Create a new Assignment
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadAssignment(@RequestBody AssignmentUploadRequest request) {
        // Basic Validation
        if (request.getTitle() == null || request.getFileLink() == null || request.getDueDate() == null) {
            return ResponseEntity.badRequest().body("Missing required fields: Title, File Link, and Due Date.");
        }

        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Assignment createdAssignment = assignmentService.createAssignment(request, auth.getName());

            // --- 4. NOTIFICATION LOGIC (Teacher -> Students) ---
            try {
                // Convert class Integer to String (e.g. 11 -> "11")
                String targetClassStr = String.valueOf(createdAssignment.getTargetClass());

                // Find all students in this class
                List<User> students = usersRepository.findStudentsByClass(targetClassStr);

                for (User student : students) {
                    notificationService.sendNotification(
                            student,
                            "New Assignment: " + createdAssignment.getTitle(),
                            "/student/assignments" // Redirect link for student
                    );
                }
            } catch (Exception e) {
                System.err.println("Failed to send assignment notifications: " + e.getMessage());
            }
            // ---------------------------------------------------

            return ResponseEntity.ok(createdAssignment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 2. Edit an existing Assignment
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody AssignmentUploadRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Assignment updatedAssignment = assignmentService.updateAssignment(id, request, auth.getName());
            return ResponseEntity.ok(updatedAssignment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 3. Get all assignments created by the logged-in Teacher
     */
    @GetMapping("/created")
    public ResponseEntity<List<Assignment>> getTeacherAssignments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(assignmentService.getAssignmentsByTeacher(auth.getName()));
    }

    /**
     * 4. View Submissions for a specific Assignment (Teacher Only)
     */
    @GetMapping("/{id}/submissions")
    public ResponseEntity<?> getAssignmentSubmissions(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            List<SubmissionDTO> submissions = assignmentService.getSubmissionsForAssignment(id, auth.getName());
            return ResponseEntity.ok(submissions);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // ==========================================
    // STUDENT ENDPOINTS
    // ==========================================

    /**
     * 5. Get Assignments for the Logged-in Student
     */
    @GetMapping
    public ResponseEntity<List<StudentAssignmentDTO>> getStudentAssignments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(assignmentService.getAssignmentsWithStatus(auth.getName()));
    }

    /**
     * 6. Submit an Assignment
     */
    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitAssignment(@PathVariable Long id, @RequestBody SubmissionRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assignmentService.submitAssignment(id, req.getFileUrl(), auth.getName());

        // --- 5. NOTIFICATION LOGIC (Student -> Teacher) ---
        try {
            // Find the assignment to know WHICH teacher created it
            Assignment assignment = assignmentRepository.findById(id).orElse(null);

            if (assignment != null && assignment.getTeacher() != null) {
                User teacher = assignment.getTeacher();
                String studentName = auth.getName(); // Currently returns email, but sufficient for now

                notificationService.sendNotification(
                        teacher,
                        "New Submission: " + assignment.getTitle(),
                        "/teacher/submissions" // Redirect link for teacher
                );
            }
        } catch (Exception e) {
            System.err.println("Failed to notify teacher of submission: " + e.getMessage());
        }
        // --------------------------------------------------

        return ResponseEntity.ok("Assignment submitted successfully");
    }

    // --- 7. TEACHER: Grade a specific submission ---
    @PostMapping("/submissions/{id}/grade")
    public ResponseEntity<?> gradeSubmission(@PathVariable Long id, @RequestBody GradeRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assignmentService.gradeSubmission(id, req.getGrade(), req.getFeedback(), auth.getName());
        return ResponseEntity.ok("Submission graded successfully");
    }

    // --- 8. TEACHER: Delete an Assignment ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        try {
            assignmentService.deleteAssignment(id, auth.getName());
            return ResponseEntity.ok("Assignment deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // --- 9. STUDENT: Revoke Submission ---
    @DeleteMapping("/{id}/submit")
    public ResponseEntity<?> unsubmitAssignment(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        try {
            assignmentService.deleteSubmission(id, auth.getName());
            return ResponseEntity.ok("Submission revoked successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==========================================
    // DTOs
    // ==========================================

    public static class GradeRequest {
        private String grade;
        private String feedback;
        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }
        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }
    }

    public static class AssignmentUploadRequest {
        private String title;
        private String description;
        private String subject;
        private Integer targetClass;
        private String examType;
        private String fileLink;
        private String dueDate;
        private String difficulty;
        private String visibility;

        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getSubject() { return subject; }
        public Integer getTargetClass() { return targetClass; }
        public String getExamType() { return examType; }
        public String getFileLink() { return fileLink; }
        public String getDueDate() { return dueDate; }
        public String getDifficulty() { return difficulty; }
        public String getVisibility() { return visibility; }
    }

    public static class StudentAssignmentDTO {
        public Long id;
        public String title;
        public String description;
        public String subject;
        public String teacher;
        public String dueDate;
        public String status;
        public String difficulty;
        public String questionFileUrl;
        public String submissionFileUrl;
        public String score;

        public StudentAssignmentDTO(Long id, String title, String description, String subject, String teacher, String dueDate, String status, String difficulty, String questionFileUrl, String submissionFileUrl, String score) {
            this.id = id;
            this.title = title;
            this.description = description;
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

    public static class SubmissionDTO {
        private Long id;
        private String studentName;
        private String studentEmail;
        private String submittedAt;
        private String fileUrl;
        private String status;
        private String grade;
        private String feedback;

        public SubmissionDTO(Long id, String studentName, String studentEmail, String submittedAt,
                             String fileUrl, String status, String grade, String feedback) {
            this.id = id;
            this.studentName = studentName;
            this.studentEmail = studentEmail;
            this.submittedAt = submittedAt;
            this.fileUrl = fileUrl;
            this.status = status;
            this.grade = grade;
            this.feedback = feedback;
        }

        public Long getId() { return id; }
        public String getStudentName() { return studentName; }
        public String getStudentEmail() { return studentEmail; }
        public String getSubmittedAt() { return submittedAt; }
        public String getFileUrl() { return fileUrl; }
        public String getStatus() { return status; }
        public String getGrade() { return grade; }
        public String getFeedback() { return feedback; }
    }

    public static class SubmissionRequest {
        private String fileUrl;
        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    }
}