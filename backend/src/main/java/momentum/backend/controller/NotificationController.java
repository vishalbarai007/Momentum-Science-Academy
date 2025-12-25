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

    // 1. Subscribe Endpoint (Connects Browser to Backend)
    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody PushSubscription subscription) {
        // Get currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = usersRepository.findByEmail(email).setRole(() -> new RuntimeException("User not found"));

        notificationService.subscribe(user, subscription.getEndpoint(), subscription.getP256dh(), subscription.getAuth());
        return ResponseEntity.ok(Map.of("message", "Subscribed to notifications"));
    }

    // 2. Unread Count Endpoint (For the Bell Icon)
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = usersRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> unread = notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(Map.of("count", unread.size()));
    }
}