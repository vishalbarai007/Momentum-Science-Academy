package momentum.backend.repository;

import momentum.backend.model.Doubt;
import momentum.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoubtRepository extends JpaRepository<Doubt, Long> {
    // For Students: See my doubts
    List<Doubt> findByStudentOrderByCreatedAtDesc(User student);

    // For Teachers: See doubts assigned to me
    List<Doubt> findByTeacherOrderByCreatedAtDesc(User teacher);
}