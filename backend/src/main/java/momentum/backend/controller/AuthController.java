package momentum.backend.controller;

import momentum.backend.config.JwtUtil;
import momentum.backend.model.User;
import momentum.backend.repository.UsersRepository;
import momentum.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    UsersRepository repo;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        if (req.getEmail() == null || req.getPassword() == null || req.getFullName() == null || req.getRole() == null) {
            return ResponseEntity.badRequest().body("Required fields: email, password, fullName, role");
        }

        try {
            userService.register(
                    req.getEmail(),
                    req.getPassword(),
                    req.getFullName(),
                    User.Role.valueOf(req.getRole().toLowerCase()),
                    req.getStudentClass(),
                    req.getProgram(),
                    req.getAccessTags(),
                    req.getExpertise(),
                    req.getExperience()
            );
            return ResponseEntity.ok("Registration successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        try {
            User user = userService.login(req.getEmail(), req.getPassword());
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getRole()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getStudents() {
        return ResponseEntity.ok(repo.findByRole(User.Role.student));
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<User>> getTeachers() {
        return ResponseEntity.ok(repo.findByRole(User.Role.teacher));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            // 1. Get the email from the Security Context (set by JwtAuthenticationFilter)
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            // 2. Fetch the full user object
            User user = userService.findByEmail(email);

            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // 3. Return the user (Password hash is hidden by @JsonIgnore if using DTOs,
            // but for now, we return the entity. In production, use a UserDTO).
            user.setPasswordHash(null); // Safety: Don't send the hash to frontend
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching profile");
        }
    }

    // DTOs
    public static class AuthRequest {
        private String email;
        private String password;
        private String fullName;
        private String role;
        // New Fields
        private String studentClass;
        private String program;
        private Set<String> accessTags;
        private List<String> expertise;
        private Integer experience;

        // Getters and Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getStudentClass() { return studentClass; }
        public void setStudentClass(String studentClass) { this.studentClass = studentClass; }
        public String getProgram() { return program; }
        public void setProgram(String program) { this.program = program; }
        public Set<String> getAccessTags() { return accessTags; }
        public void setAccessTags(Set<String> accessTags) { this.accessTags = accessTags; }
        public List<String> getExpertise() { return expertise; }
        public void setExpertise(List<String> expertise) { this.expertise = expertise; }
        public Integer getExperience() { return experience; }
        public void setExperience(Integer experience) { this.experience = experience; }
    }

    public static class AuthResponse {
        private String token;
        private String email;
        private User.Role role;

        public AuthResponse(String token, String email, User.Role role) {
            this.token = token;
            this.email = email;
            this.role = role;
        }
        // Getters/Setters...
        public String getToken() { return token; }
        public String getEmail() { return email; }
        public User.Role getRole() { return role; }
    }
}