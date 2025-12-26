package momentum.backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "doubts")
public class Doubt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher; // The teacher who owns the resource/assignment

    private String contextType; // "ASSIGNMENT" or "RESOURCE"
    private Long contextId;     // The ID of the specific assignment/resource
    private String contextTitle; // Store title for easy display

    @Column(length = 1000)
    private String question;

    @Column(length = 1000)
    private String answer; // Teacher's reply

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public User getTeacher() { return teacher; }
    public void setTeacher(User teacher) { this.teacher = teacher; }
    public String getContextType() { return contextType; }
    public void setContextType(String contextType) { this.contextType = contextType; }
    public Long getContextId() { return contextId; }
    public void setContextId(Long contextId) { this.contextId = contextId; }
    public String getContextTitle() { return contextTitle; }
    public void setContextTitle(String contextTitle) { this.contextTitle = contextTitle; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public String getSubject() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getSubject'");
    }
}