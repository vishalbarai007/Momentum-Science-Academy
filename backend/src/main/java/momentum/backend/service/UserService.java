package momentum.backend.service;

import momentum.backend.model.User;
import momentum.backend.repository.UsersRepository;
import jakarta.transaction.Transactional;
import momentum.backend.repository.UsersRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class UserService {
    private final momentum.backend.repository.UsersRepository repo;

    public UserService(UsersRepository repo) {
        this.repo = repo;
    }

    public User register(String email, String rawPassword, String fullName, User.Role role) {

        // Check if email already exists
        if (repo.findByEmail(email) != null)
            throw new RuntimeException("Email already registered!");

        // Hash password
        String hash = BCrypt.hashpw(rawPassword, BCrypt.gensalt());

        // Create User object
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(hash);
        user.setFullName(fullName);
        user.setRole(role);            // student | teacher | admin
        user.setActive(true);
        user.setCreatedAt(new Date());

        return repo.save(user);
    }


    public User login(String email, String rawPassword) {
        User user = repo.findByEmail(email);

        if (user == null)
            throw new RuntimeException("User not found");

        if (!BCrypt.checkpw(rawPassword, user.getPasswordHash()))
            throw new RuntimeException("Incorrect password");

        if (!user.getActive())
            throw new RuntimeException("Account disabled");

        return user;
    }


    public User updateUserProfile(String email, String newName) {
        User user = repo.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        user.setFullName(newName);
        return repo.save(user);
    }

    public User findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public User save(User user) {
        return repo.save(user);
    }

    public List<User> getUsersByRole(User.Role role) {
        return repo.findByRole(role);
    }



}