package momentum.backend.controller;

import momentum.backend.model.User;
import momentum.backend.repository.UsersRepository;
import momentum.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/super-admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://172.31.44.212:8080", "http://localhost:8080", "https://momentumscienceacademy.com" })
public class SuperAdminController {

    private final UserService userService;
    private final UsersRepository usersRepository;

    public SuperAdminController(UserService userService, UsersRepository usersRepository) {
        this.userService = userService;
        this.usersRepository = usersRepository;
    }

    // --- 1. CREATE ---
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody CreateAdminRequest request) {
        if (request.getEmail() == null || request.getPassword() == null || request.getFullName() == null) {
            return ResponseEntity.badRequest().body("Email, Password, and Name are required.");
        }
        try {
            userService.register(
                    request.getEmail(),
                    request.getPassword(),
                    request.getFullName(),
                    User.Role.admin,
                    request.getPhone(),
                    null, null, null, null, null
            );
            return ResponseEntity.ok("{\"message\": \"New Admin created successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating admin: " + e.getMessage());
        }
    }

    // --- 2. READ (View All) ---
    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAllAdmins() {
        return ResponseEntity.ok(usersRepository.findByRole(User.Role.admin));
    }

    // --- 3. UPDATE (New Feature) ---
    @PutMapping("/admins/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody UpdateAdminRequest req) {
        try {
            User targetUser = usersRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            if (targetUser.getRole() != User.Role.admin) {
                return ResponseEntity.badRequest().body("User is not an admin.");
            }

            // Reuse the generic updateUser service
            userService.updateUser(
                    id,
                    req.getFullName(),
                    req.getEmail(),
                    req.getPhone(),
                    req.getPassword(), // Optional: only updates if not null/empty
                    null, null, null, null, null, null // Null for student/teacher fields
            );

            return ResponseEntity.ok("{\"message\": \"Admin updated successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 4. DELETE ---
    @DeleteMapping("/admins/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        return usersRepository.findById(id).map(admin -> {
            if (admin.getRole() != User.Role.admin) {
                return ResponseEntity.badRequest().body("Target user is not an admin.");
            }
            usersRepository.delete(admin);
            return ResponseEntity.ok("{\"message\": \"Admin deleted successfully\"}");
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- DTOs ---
    public static class CreateAdminRequest {
        private String email; private String password; private String fullName; private String phone;
        // Getters/Setters
        public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; } public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; } public void setPhone(String phone) { this.phone = phone; }
    }

    public static class UpdateAdminRequest {
        private String email; private String password; private String fullName; private String phone;
        // Getters/Setters
        public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; } public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; } public void setPhone(String phone) { this.phone = phone; }
    }
}