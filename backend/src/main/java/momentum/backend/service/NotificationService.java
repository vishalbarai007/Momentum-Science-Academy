package momentum.backend.service;

import jakarta.annotation.PostConstruct;
import momentum.backend.model.Notification;
import momentum.backend.model.PushSubscription;
import momentum.backend.model.User;
import momentum.backend.repository.NotificationRepository;
import momentum.backend.repository.PushSubscriptionRepository;
import nl.martijndwars.webpush.PushService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    @Value("${vapid.public.key}") private String publicKey;
    @Value("${vapid.private.key}") private String privateKey;
    @Value("${vapid.subject}") private String subject;

    private PushService pushService;
    private final NotificationRepository notificationRepo;
    private final PushSubscriptionRepository subscriptionRepo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public NotificationService(NotificationRepository notificationRepo, PushSubscriptionRepository subscriptionRepo) {
        this.notificationRepo = notificationRepo;
        this.subscriptionRepo = subscriptionRepo;
    }

    @PostConstruct
    public void init() throws Exception {
        if (publicKey != null && !publicKey.isEmpty()) {
            this.pushService = new PushService(publicKey, privateKey, subject);
        }
    }

    public void sendNotification(User recipient, String message, String url) {
        // 1. Save to Database (For In-App Bell Icon)
        Notification note = new Notification();
        note.setRecipient(recipient);
        note.setMessage(message);
        note.setRedirectUrl(url);
        notificationRepo.save(note);

        // 2. Send to Browser (Chrome/Edge Notification)
        List<PushSubscription> subs = subscriptionRepo.findByUser(recipient);
        for (PushSubscription sub : subs) {
            try {
                // Construct JSON payload for the browser
                Map<String, String> payload = new HashMap<>();
                payload.put("title", "Momentum Academy");
                payload.put("body", message);
                payload.put("url", url);

                // ✅ FIX: Use fully qualified name to avoid conflict with model.Notification
                nl.martijndwars.webpush.Notification push = new nl.martijndwars.webpush.Notification(
                        sub.getEndpoint(),
                        sub.getP256dh(),
                        sub.getAuth(),
                        objectMapper.writeValueAsBytes(payload)
                );
                pushService.send(push);
            } catch (Exception e) {
                System.err.println("Failed to send push: " + e.getMessage());
                // Optional: Delete invalid subscription here
            }
        }
    }

    public void subscribe(User user, String endpoint, String p256dh, String auth) {
        PushSubscription sub = new PushSubscription();
        sub.setUser(user);
        sub.setEndpoint(endpoint);
        sub.setP256dh(p256dh);
        sub.setAuth(auth);
        subscriptionRepo.save(sub);
    }
}