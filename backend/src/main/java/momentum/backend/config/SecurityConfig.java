package momentum.backend.config;

import momentum.backend.config.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(org.springframework.security.config.annotation.web.builders.HttpSecurity http) throws Exception {
        http
                // Disable CSRF since we are using JWT tokens (stateless)
                .csrf(csrf -> csrf.disable())
                // Configure CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Configure Endpoint Authorization
                .authorizeHttpRequests(auth -> auth
                        // 1. Public Endpoints (Login/Register)
                        .requestMatchers("/_next/**", "/static/**", "/*.html", "/*.ico", "/*.png").permitAll()

                        // 2. Public Routes
                        .requestMatchers("/", "/index.html", "/about", "/blog", "/contact", "/faculty", "/gallery", "/privacy", "/programs", "/rankers", "/terms", "/test-sheets").permitAll()

                        // 3. Auth & Error Routes
                        .requestMatchers("/api/auth/**", "/error", "/login", "/student/login", "/student/signup", "/admin/login").permitAll()

                        // 4. Student/Teacher/Admin Dashboards
                        // Note: If you want Spring Boot to secure these, use .authenticated() instead of .permitAll()
                        .requestMatchers("/student/**", "/teacher/**", "/admin/**").permitAll()

                        // 2. Super Admin Exclusive Routes
                        // Only the "super_admin" can access endpoints specifically for managing other admins
                        .requestMatchers("/api/v1/super-admin/**").hasAuthority("super_admin")

                        // 3. Admin Routes (Shared Access)
                        // Both "admin" AND "super_admin" can access general admin features (Dashboard, Users, Resources)
                        .requestMatchers("/api/v1/admin/**").hasAnyAuthority("admin", "super_admin")

                        // 4. Role-Specific Routes (Optional protection)
                        // You can add specific locks for student/teacher routes here if needed
                        // .requestMatchers("/api/v1/teacher/**").hasAuthority("teacher")

                        // 5. Default: All other requests require at least a valid token
                        .anyRequest().authenticated()
                )
                // Add JWT filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Define CORS configuration source
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allowed origins
        configuration.setAllowedOriginPatterns(List.of("*"));

        // Allowed HTTP methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Allowed headers
        configuration.setAllowedHeaders(List.of("*"));

        // Allow cookies / credentials
        configuration.setAllowCredentials(true);

        // Cache preflight response max age
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}