package momentum.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import momentum.backend.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import momentum.backend.model.User.Role;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private SecretKey key;

    private final long EXPIRATION = 1000 * 60 * 60 * 24; // 24 hours

    // Secret key must be Base64-encoded string in properties
    @Value("${app.jwt.secret}")
    private String secret;

    @PostConstruct
    public void init() {
        // Decode and initialize the SecretKey once at startup
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate token with subject (user email) and expiration
    public String generateToken(String email, User.Role role) {
        return Jwts.builder()
                .setSubject(email)                  // user email as subject
                .claim("role", role.name())         // enum to string
                .setIssuedAt(new Date())            // issued time
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }


    // Validate token and return the subject (user email) if valid
    public String validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String extractUsername(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        } catch (JwtException e) {
            // token invalid, expired, or malformed
            return null;
        }
    }
}
