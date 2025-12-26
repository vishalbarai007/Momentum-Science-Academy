package momentum.backend.controller;

import momentum.backend.model.Notification;
import momentum.backend.model.PushSubscription;
import momentum.backend.model.User;
import momentum.backend.repository.NotificationRepository;
import momentum.backend.repository.UsersRepository;
import momentum.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final UsersRepository usersRepository;

    public NotificationController(NotificationService notificationService, NotificationRepository notificationRepository, UsersRepository usersRepository) {
        this.notificationService = notificationService;
        this.notificationRepository = notificationRepository;
        this.usersRepository = usersRepository;
    }

    // 1. Subscribe (Existing)
    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody PushSubscription subscription) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = usersRepository.findByEmail(auth.getName());
        if (user == null) throw new RuntimeException("User not found");

        notificationService.subscribe(user, subscription.getEndpoint(), subscription.getP256dh(), subscription.getAuth());
        return ResponseEntity.ok(Map.of("message", "Subscribed"));
    }

    // 2. Unread Count (Existing - Keep this)
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = usersRepository.findByEmail(auth.getName());
        if (user == null) return ResponseEntity.status(404).body("User not found");

        List<Notification> unread = notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(Map.of("count", unread.size()));
    }

    // --- NEW ENDPOINT: Get All Notifications (For the Bell Dropdown) ---
    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = usersRepository.findByEmail(auth.getName());

        // Fetch last 20 notifications (read or unread)
        List<Notification> notes = notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
        // Limit to 20 to prevent overload (optional logic)
        return ResponseEntity.ok(notes);
    }

    // --- NEW ENDPOINT: Mark as Read (To clear the Red Dot) ---
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id).map(note -> {
            note.setRead(true);
            notificationRepository.save(note);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}