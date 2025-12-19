package momentum.backend.controller;

import momentum.backend.model.Doubt;
import momentum.backend.service.DoubtService;
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

    public DoubtController(DoubtService doubtService) {
        this.doubtService = doubtService;
    }

    // 1. STUDENT: Ask a doubt
    @PostMapping
    public ResponseEntity<?> askDoubt(@RequestBody DoubtRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        doubtService.createDoubt(auth.getName(), req.getContextType(), req.getContextId(), req.getQuestion());
        return ResponseEntity.ok("Doubt sent successfully");
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
        doubtService.replyToDoubt(id, req.getAnswer(), auth.getName());
        return ResponseEntity.ok("Reply sent");
    }

    // DTOs
    public static class DoubtRequest {
        private String contextType; // "ASSIGNMENT"
        private Long contextId;
        private String question;
        // getters/setters...
        public String getContextType() { return contextType; }
        public Long getContextId() { return contextId; }
        public String getQuestion() { return question; }
    }

    public static class ReplyRequest {
        private String answer;
        public String getAnswer() { return answer; }
    }
}