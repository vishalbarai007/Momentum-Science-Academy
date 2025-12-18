package momentum.backend.repository;

import momentum.backend.model.Assignment;
import momentum.backend.model.Submission;
import momentum.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    // Find a specific submission by a student for a specific assignment
    Optional<Submission> findByAssignmentAndStudent(Assignment assignment, User student);

    // Find all submissions by a student
    List<Submission> findByStudent(User student);
}