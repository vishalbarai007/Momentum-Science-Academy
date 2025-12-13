package momentum.backend.service;

import momentum.backend.model.User;
import momentum.backend.repository.UsersRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String email, String rawPassword, String fullName, User.Role role,
                         String studentClass, String program, Set<String> accessTags,
                         List<String> expertise, Integer experience) {

        // FIX: Check for null instead of .isPresent()
        if (usersRepository.findByEmail(email) != null) {
            throw new RuntimeException("Email already registered!");
        }

        // Default Access Tags logic
        if (role == User.Role.student && (accessTags == null || accessTags.isEmpty())) {
            accessTags = new HashSet<>();
            if (studentClass != null && !studentClass.isEmpty()) accessTags.add(studentClass);
            if (program != null && !program.isEmpty()) accessTags.add(program);
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName);
        user.setRole(role);

        // Student Fields
        user.setStudentClass(studentClass);
        user.setProgram(program);
        user.setAccessTags(accessTags);

        // Teacher Fields
        user.setExpertise(expertise);
        user.setExperience(experience);

        // Common Fields
        user.setActive(true);
        user.setCreatedAt(new Date());

        return usersRepository.save(user);
    }

    public User login(String email, String rawPassword) {
        // FIX: Direct assignment + null check
        User user = usersRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Incorrect password");
        }

        if (!user.getActive()) {
            throw new RuntimeException("Account disabled");
        }

        return user;
    }

    public User updateUserProfile(String email, String newName) {
        User user = usersRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        user.setFullName(newName);
        return usersRepository.save(user);
    }

    // New Update Method for Admin
    public User updateUser(Long userId, String fullName, String email, String phone,
                           String newPassword, String studentClass, String program,
                           Integer experience, List<String> expertise, List<String> qualifications) {

        User user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Handle Email Update (Check unique)
        if (email != null && !email.isEmpty() && !email.equals(user.getEmail())) {
            if (usersRepository.findByEmail(email) != null) {
                throw new RuntimeException("Email already in use by another account");
            }
            user.setEmail(email);
        }

        // 2. Handle Password Update
        if (newPassword != null && !newPassword.isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(newPassword));
        }

        // 3. Update Basic Info
        if (fullName != null) user.setFullName(fullName);
        if (phone != null) user.setPhone(phone);

        // 4. Update Role Specifics
        if (user.getRole() == User.Role.student) {
            if (studentClass != null) user.setStudentClass(studentClass);
            if (program != null) user.setProgram(program);
        } else if (user.getRole() == User.Role.teacher) {
            if (experience != null) user.setExperience(experience);
            if (expertise != null) user.setExpertise(expertise);
            if (qualifications != null) user.setQualifications(qualifications);
        }

        return usersRepository.save(user);
    }

    public User findByEmail(String email) {
        return usersRepository.findByEmail(email);
    }

    public List<User> getUsersByRole(User.Role role) {
        return usersRepository.findByRole(role);
    }

    public String getNameByEmail(String email) {
        User user = usersRepository.findByEmail(email);
        return user != null ? user.getFullName() : null;
    }
}