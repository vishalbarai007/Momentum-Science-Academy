package momentum.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import momentum.backend.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private SecretKey key;

    private final long EXPIRATION = 1000 * 60 * 60 * 24; // 24 hours

    @Value("${app.jwt.secret}")
    private String secret;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email, User.Role role) {
        return Jwts.builder()
                .subject(email)                  // Changed from setSubject
                .claim("role", role.name())
                .issuedAt(new Date())            // Changed from setIssuedAt
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION)) // Changed from setExpiration
                .signWith(key, Jwts.SIG.HS512)   // Updated signing method
                .compact();
    }

    public String validateToken(String token) {
        return Jwts.parser()                     // Changed from parserBuilder()
                .verifyWith(key)                 // Changed from setSigningKey()
                .build()
                .parseSignedClaims(token)        // Changed from parseClaimsJws()
                .getPayload()                    // Changed from getBody()
                .getSubject();
    }

    public String extractUsername(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();
        } catch (JwtException e) {
            return null;
        }
    }
}