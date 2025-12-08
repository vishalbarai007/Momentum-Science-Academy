package momentum.backend.controller;

import momentum.backend.config.JwtUtil;
import momentum.backend.model.User;
import momentum.backend.repository.UsersRepository;
import momentum.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        // Validate request
        if (req == null ||
                req.getEmail() == null ||
                req.getPassword() == null ||
                req.getFullName() == null ||
                req.getRole() == null)
        {
            return ResponseEntity.badRequest().body("All fields are required: email, password, fullName, role");
        }

        try {
            userService.register(
                    req.getEmail(),
                    req.getPassword(),
                    req.getFullName(),
                    User.Role.valueOf(req.getRole().toLowerCase())
            );
            return ResponseEntity.ok("Registration successful");
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role value. Allowed: student, teacher, admin");
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {

        if (req == null || req.getEmail() == null || req.getPassword() == null)
            return ResponseEntity.badRequest().body("Email & password are required");

        try {
            User user = userService.login(req.getEmail(), req.getPassword());
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

            AuthResponse response = new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getRole()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getStudents() {
        List<User> students = repo.findByRole(User.Role.student);
        return ResponseEntity.ok(students);
    }

    // ⬇️ Fetch Teachers
    @GetMapping("/teachers")
    public ResponseEntity<List<User>> getTeachers() {
        List<User> teachers = repo.findByRole(User.Role.teacher);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/name")
    public ResponseEntity<?> getName(@RequestParam String email) {
        String name = userService.getNameByEmail(email);
        if (name == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }
        return ResponseEntity.ok(name);
    }


    // You can extend with Google OAuth endpoints here in the future!

    public static class AuthRequest {
        private String email;
        private String password;
        private String fullName;
        private String role;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getFullName() { return fullName; }
        public void setFullName(String name) { this.fullName = name; }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
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

        public User.Role getRole() {
            return role;
        }

        public void setRole(User.Role role) {
            this.role = role;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
