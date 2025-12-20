package momentum.backend.repository;

import momentum.backend.model.Assignment;
import momentum.backend.model.Submission;
import momentum.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    // Existing method used in AssignmentService
    Optional<Submission> findByAssignmentAndStudent(Assignment assignment, User student);

    // --- NEW METHODS REQUIRED FOR PERFORMANCE SERVICE ---

    // 1. To calculate overall stats and list student's results
    List<Submission> findByStudent(User student);

    // 2. To calculate rank and leaderboard for a specific test
    List<Submission> findByAssignment(Assignment assignment);
}