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

    /**
     * Checks if a specific student has submitted a specific assignment.
     * Used to determine status (Pending vs Submitted) on the Student Dashboard.
     */
    Optional<Submission> findByAssignmentAndStudent(Assignment assignment, User student);

    /**
     * Fetches all submissions for a specific assignment.
     * Used for the Teacher's "View Submissions" modal.
     */
    List<Submission> findByAssignment(Assignment assignment);
}