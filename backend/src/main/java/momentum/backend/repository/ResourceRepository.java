package momentum.backend.repository;

import momentum.backend.model.Resource;
import momentum.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // Find resources uploaded by a specific teacher
    List<Resource> findByUploadedBy(User user);

    // Find resources with filters (basic example)
    List<Resource> findByTargetClassAndSubject(String targetClass, String subject);

    // Find by type
    List<Resource> findByType(Resource.ResourceType type);
}