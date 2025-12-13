package momentum.backend.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String phone;

    private String profileImageUrl;

    private Boolean isActive = true;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

    // ---------- Access Control ----------
    // This allows admins to define specific tags (e.g., "11", "JEE", "Physics")
    // that this user is allowed to access.
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_access_tags", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "access_tag")
    private Set<String> accessTags = new HashSet<>();

    // ---------- Student Specific Fields ----------
    private String studentClass;
    private String program;

    @Temporal(TemporalType.DATE)
    private Date enrollmentDate;

    // ---------- Teacher Specific Fields ----------
    @ElementCollection
    private List<String> qualifications;

    private Integer experience;

    @ElementCollection
    private List<String> expertise;

    // ---------- Role Enum ----------
    public enum Role {
        student,
        teacher,
        admin
    }

    // ---------- Constructors ----------

    public User() {
    }

    // Constructor with all fields
    public User(Long id, String email, String passwordHash, String fullName, Role role, String phone, String profileImageUrl, Boolean isActive, Date createdAt, Set<String> accessTags, String studentClass, String program, Date enrollmentDate, List<String> qualifications, Integer experience, List<String> expertise) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
        this.phone = phone;
        this.profileImageUrl = profileImageUrl;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.accessTags = accessTags;
        this.studentClass = studentClass;
        this.program = program;
        this.enrollmentDate = enrollmentDate;
        this.qualifications = qualifications;
        this.experience = experience;
        this.expertise = expertise;
    }

    // ---------- Getters and Setters ----------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Set<String> getAccessTags() {
        return accessTags;
    }

    public void setAccessTags(Set<String> accessTags) {
        this.accessTags = accessTags;
    }

    public String getStudentClass() {
        return studentClass;
    }

    public void setStudentClass(String studentClass) {
        this.studentClass = studentClass;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public Date getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(Date enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public List<String> getQualifications() {
        return qualifications;
    }

    public void setQualifications(List<String> qualifications) {
        this.qualifications = qualifications;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public List<String> getExpertise() {
        return expertise;
    }

    public void setExpertise(List<String> expertise) {
        this.expertise = expertise;
    }
}