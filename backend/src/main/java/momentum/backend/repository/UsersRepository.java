package momentum.backend.repository;

import momentum.backend.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface UsersRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    @Query("SELECT u.fullName FROM User u WHERE u.id = :id")
    String findNameById(@Param("id") Long id);

    List<User> findByRole(User.Role role);

    @Query("SELECT DISTINCT u FROM User u JOIN u.accessTags t WHERE u.role = momentum.backend.model.User.Role.student AND (t = :targetClass OR t = :exam)")
    List<User> findStudentsByResourceCriteria(@Param("targetClass") String targetClass, @Param("exam") String exam);
}
