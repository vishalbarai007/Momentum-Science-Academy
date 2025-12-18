package momentum.backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String studentClass; // Specific to Enrollment

    private String program;      // Selected program or "General"

    @Column(length = 1000)
    private String message;

    @Column(nullable = false)
    private String source; // "CONTACT_US" or "ENROLLMENT"

    // FIX: Default status is now INTERESTED. Removed "NEW".
    // Available statuses: INTERESTED, CONTACTED, ENROLLED
    @Column(nullable = false)
    private String status = "INTERESTED";

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

    public Lead() {}

    public Lead(String name, String email, String phone, String studentClass, String program, String message, String source) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.studentClass = studentClass;
        this.program = program;
        this.message = message;
        this.source = source;
        this.status = "INTERESTED"; // Explicitly set default in constructor too
        this.createdAt = new Date();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStudentClass() { return studentClass; }
    public void setStudentClass(String studentClass) { this.studentClass = studentClass; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}