package momentum.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
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
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                // Disable CSRF (JWT based)
                                .csrf(csrf -> csrf.disable())

                                // Enable CORS
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                // Stateless session
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                // Authorization rules
                                .authorizeHttpRequests(auth -> auth

                                        // 🔓 Public Endpoints
                                                .requestMatchers(
                                                                "/api/auth/**",
                                                        "/auth/**",
                                                                "/api/leads/contact",
                                                                "/api/leads/enroll",
                                                                "/ws/**",
                                                                "/error")
                                                .permitAll()

                                                // 👑 Super Admin
                                                .requestMatchers("/api/v1/super-admin/**")
                                                .hasAuthority("super_admin")

                                                // 🛠 Admin (admin + super_admin)
                                                .requestMatchers("/api/admin/**", "/api/users/**")
                                                .hasAnyAuthority("admin", "super_admin")

                                                // 👨‍🏫 Teacher
                                                .requestMatchers(
                                                                "/api/v1/assignments/created",
                                                                "/api/v1/assignments/upload")
                                                .hasAuthority("teacher")

                                                // 🎓 Student
                                                .requestMatchers("/api/v1/doubts/my-doubts")
                                                .hasAuthority("student")

                                                // 🔐 Shared (any authenticated user)
                                                .requestMatchers(
                                                                "/api/notifications/**",
                                                                "/api/v1/resources/**")
                                                .authenticated()

                                                // ❗ Everything else
                                                .anyRequest().authenticated())

                                // JWT Filter
                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        // CORS Configuration
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOriginPatterns(List.of(
                                "http://localhost:3000",
                                "https://momentumscienceacademy.com",
                                "https://www.momentumscienceacademy.com",
                                "http://momentumscienceacademy.com",
                                "http://www.momentumscienceacademy.com"));
                configuration.setAllowedMethods(List.of(
                                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);

                return source;
        }
}
