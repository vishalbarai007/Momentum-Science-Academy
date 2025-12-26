package momentum.backend.controller;

import momentum.backend.model.Doubt;
import momentum.backend.model.User;
import momentum.backend.repository.UsersRepository;      // 1. Import
import momentum.backend.service.DoubtService;
import momentum.backend.service.NotificationService;     // 1. Import
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doubts")
@CrossOrigin(origins = "http://localhost:3000")
public class DoubtController {

    private final DoubtService doubtService;
    
    // 2. Add Notification Dependencies
    private final NotificationService notificationService;
    private final UsersRepository usersRepository;

    // 3. Update Constructor
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
        Doubt savedDoubt = doubtService.createDoubt(auth.getName(), req.getContextType(), req.getContextId(), req.getQuestion());

        // --- 4. NOTIFICATION LOGIC (Student -> Subject Teachers) ---
        try {
            // Find teachers responsible for this subject (e.g., "Physics")
            List<User> teachers = usersRepository.findTeachersBySubject(savedDoubt.getSubject());
            
            for (User teacher : teachers) {
                notificationService.sendNotification(
                    teacher,
                    "New Doubt in " + savedDoubt.getSubject(),
                    "/teacher/doubts" // Redirect link for teacher
                );
            }
        } catch (Exception e) {
            System.err.println("Failed to notify teachers of doubt: " + e.getMessage());
        }
        // -----------------------------------------------------------

        return ResponseEntity.ok(savedDoubt); // Return object so frontend can update UI instantly
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

    // 4. TEACHER: Reply
    @PostMapping("/{id}/reply")
    public ResponseEntity<?> replyDoubt(@PathVariable Long id, @RequestBody ReplyRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Doubt updatedDoubt = doubtService.replyToDoubt(id, req.getAnswer(), auth.getName());
        
        // (Optional) You could also notify the Student back here that their doubt was answered!
        
        return ResponseEntity.ok(updatedDoubt);
    }

    // DTOs
    public static class DoubtRequest {
        private String contextType; // "ASSIGNMENT"
        private Long contextId;
        private String question;
        // getters/setters...
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