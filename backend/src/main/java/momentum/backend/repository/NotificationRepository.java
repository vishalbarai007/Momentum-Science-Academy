package momentum.backend.repository;

import momentum.backend.model.Notification;
import momentum.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(User recipient);
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);
}