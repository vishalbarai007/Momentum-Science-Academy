// ALTER TABLE users MODIFY COLUMN role ENUM('student', 'teacher', 'admin', 'super_admin'); -- Guys, ye mysql pe run kar lena, super-admin add karne ke liye

package momentum.backend;

import momentum.backend.model.User;
import momentum.backend.repository.UsersRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner createSuperAdmin(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			String mail = "owner@momentum.edu";
			String password = "owner123";
			User superAdmin = usersRepository.findByEmail(mail);

			if (superAdmin == null) {
				superAdmin = new User();
				superAdmin.setEmail(mail);
				superAdmin.setCreatedAt(new Date());
			}

			superAdmin.setFullName("System Owner");
			superAdmin.setRole(User.Role.super_admin);
			superAdmin.setActive(true);
			superAdmin.setPasswordHash(passwordEncoder.encode(password));

			usersRepository.save(superAdmin);
			System.out.println("SUPER ADMIN UPDATED: " + mail + " with password " + password);
		};
	}
}