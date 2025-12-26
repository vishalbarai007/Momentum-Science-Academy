package momentum.backend.controller;

import momentum.backend.model.User;
import momentum.backend.repository.UsersRepository;
import momentum.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UsersRepository usersRepository;
    private final UserService userService;

    public AdminController(UsersRepository usersRepository, UserService userService) {
        this.usersRepository = usersRepository;
        this.userService = userService;
    }

    // ---------- Access Tags Management ----------
    @GetMapping("/users/{id}/access-tags")
    public ResponseEntity<Set<String>> getUserAccessTags(@PathVariable Long id) {
        return usersRepository.findById(id)
                .map(user -> ResponseEntity.ok(user.getAccessTags())) // Explicitly use user object
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users/{id}/access-tags")
    public ResponseEntity<?> updateUserAccessTags(@PathVariable Long id, @RequestBody Set<String> tags) {
        return usersRepository.findById(id).map(user -> {
            user.setAccessTags(tags);
            usersRepository.save(user);
            return ResponseEntity.ok("Tags updated");
        }).orElse(ResponseEntity.notFound().build());
    }

    // ---------- User Update Management ----------

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest req) {
        try {
            // Pass accessTags to the service
            User updatedUser = userService.updateUser(
                    id,
                    req.getFullName(),
                    req.getEmail(),
                    req.getPhone(),
                    req.getPassword(),
                    req.getStudentClass(),
                    req.getProgram(),
                    req.getExperience(),
                    req.getExpertise(),
                    req.getQualifications(),
                    req.getAccessTags() // <--- NEW: Passed accessTags
            );
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!usersRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        usersRepository.deleteById(id);
        return ResponseEntity.ok("{\"message\": \"User deleted successfully\"}");
    }

    // ---------- DTO for Update Request ----------

    public static class UserUpdateRequest {
        private String fullName;
        private String email;
        private String phone;
        private String password;
        private String studentClass;
        private String program;
        private Integer experience;
        private List<String> expertise;
        private List<String> qualifications;
        private Set<String> accessTags; // <--- NEW FIELD

        // Getters
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public String getPassword() { return password; }
        public String getStudentClass() { return studentClass; }
        public String getProgram() { return program; }
        public Integer getExperience() { return experience; }
        public List<String> getExpertise() { return expertise; }
        public List<String> getQualifications() { return qualifications; }
        public Set<String> getAccessTags() { return accessTags; } // <--- NEW GETTER

        // Setters
        public void setFullName(String fullName) { this.fullName = fullName; }
        public void setEmail(String email) { this.email = email; }
        public void setPhone(String phone) { this.phone = phone; }
        public void setPassword(String password) { this.password = password; }
        public void setStudentClass(String studentClass) { this.studentClass = studentClass; }
        public void setProgram(String program) { this.program = program; }
        public void setExperience(Integer experience) { this.experience = experience; }
        public void setExpertise(List<String> expertise) { this.expertise = expertise; }
        public void setQualifications(List<String> qualifications) { this.qualifications = qualifications; }
        public void setAccessTags(Set<String> accessTags) { this.accessTags = accessTags; } // <--- NEW SETTER
    }
}