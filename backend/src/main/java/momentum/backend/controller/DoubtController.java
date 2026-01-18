package momentum.backend.controller;

import momentum.backend.model.Doubt;
import momentum.backend.model.User;
import momentum.backend.repository.UsersRepository;
import momentum.backend.service.DoubtService;
import momentum.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doubts")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
public class DoubtController {

    private final DoubtService doubtService;
    private final NotificationService notificationService;
    private final UsersRepository usersRepository;

    public DoubtController(DoubtService doubtService, NotificationService notificationService, UsersRepository usersRepository) {
        this.doubtService = doubtService;
        this.notificationService = notificationService;
        this.usersRepository = usersRepository;
    }

    // 1. STUDENT: Ask a doubt
    @PostMapping
    public ResponseEntity<?> askDoubt(@RequestBody DoubtRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Capture the saved doubt object
        Doubt savedDoubt = doubtService.createDoubt(
                auth.getName(),
                req.getContextType(),
                req.getContextId(),
                req.getQuestion()
        );

        // --- NOTIFICATION LOGIC (Student -> Teacher) ---
        try {
            // We use the contextTitle stored during creation for the notification body
            String notificationBody = "New Doubt from Student regarding: " + savedDoubt.getContextTitle();

            notificationService.sendNotification(
                    savedDoubt.getTeacher(),
                    notificationBody,
                    "/teacher/dashboard" // Redirect link for teacher to view their dashboard/doubts
            );
        } catch (Exception e) {
            // Log error but do not fail the request; the doubt is already saved
            System.err.println("Failed to notify teacher of doubt: " + e.getMessage());
        }

        return ResponseEntity.ok(savedDoubt);
    }

    // 2. STUDENT: Get my doubts
    @GetMapping("/my-doubts")
    public ResponseEntity<List<Doubt>> getMyDoubts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(doubtService.getStudentDoubts(auth.getName()));
    }

    // 3. TEACHER: Get incoming doubts
    @GetMapping("/incoming")
    public ResponseEntity<List<Doubt>> getIncomingDoubts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(doubtService.getTeacherDoubts(auth.getName()));
    }

    // 4. TEACHER: Reply to a doubt
    @PostMapping("/{id}/reply")
    public ResponseEntity<?> replyDoubt(@PathVariable Long id, @RequestBody ReplyRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Doubt updatedDoubt = doubtService.replyToDoubt(id, req.getAnswer(), auth.getName());

        // --- NOTIFICATION LOGIC (Teacher -> Student) ---
        try {
            notificationService.sendNotification(
                    updatedDoubt.getStudent(),
                    "Your doubt in '" + updatedDoubt.getContextTitle() + "' has been answered.",
                    "/student/resources" // Redirect link for student to check the resource/reply
            );
        } catch (Exception e) {
            System.err.println("Failed to notify student: " + e.getMessage());
        }

        return ResponseEntity.ok(updatedDoubt);
    }

    // --- DTOs ---
    public static class DoubtRequest {
        private String contextType; // "RESOURCE" or "ASSIGNMENT"
        private Long contextId;
        private String question;

        public String getContextType() { return contextType; }
        public void setContextType(String contextType) { this.contextType = contextType; }

        public Long getContextId() { return contextId; }
        public void setContextId(Long contextId) { this.contextId = contextId; }

        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }
    }

    public static class ReplyRequest {
        private String answer;

        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
    }
}