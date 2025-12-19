package momentum.backend.repository;

import momentum.backend.model.Assignment;
import momentum.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    /**
     * Finds all assignments created by a specific teacher.
     * Used for the Teacher Dashboard.
     */
    List<Assignment> findByTeacher(User teacher);
}