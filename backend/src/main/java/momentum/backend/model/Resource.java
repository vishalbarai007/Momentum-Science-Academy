package momentum.backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type; // pq, notes, assignment, imp

    @Column(nullable = false)
    private String subject;

    @Column(name = "target_class")
    private int targetClass; // e.g., "11", "12"

    private String exam; // e.g., "JEE", "NEET"

    private String fileUrl; // URL from S3

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id", nullable = false)
    private User uploadedBy;

    // --- Analytics Fields (Updated with DB Defaults) ---
    @Column(columnDefinition = "bigint default 0")
    private Long downloads = 0L;

    @Column(columnDefinition = "bigint default 0")
    private Long views = 0L;

    @Column(columnDefinition = "double default 0.0")
    private Double rating = 0.0;
    // ----------------------------------------------------

    private Boolean isPublished;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // -----------------------------------------------------------------
    // Constructors
    // -----------------------------------------------------------------

    public Resource() {
    }

    public Resource(Long id, String title, String description, ResourceType type, String subject, int targetClass, String exam, String fileUrl, User uploadedBy, Long downloads, Long views, Double rating, Boolean isPublished, Date createdAt, Date updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.subject = subject;
        this.targetClass = targetClass;
        this.exam = exam;
        this.fileUrl = fileUrl;
        this.uploadedBy = uploadedBy;
        this.downloads = downloads;
        this.views = views;
        this.rating = rating;
        this.isPublished = isPublished;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // -----------------------------------------------------------------
    // Getters and Setters
    // -----------------------------------------------------------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ResourceType getType() { return type; }
    public void setType(ResourceType type) { this.type = type; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public int getTargetClass() { return targetClass; }
    public void setTargetClass(int targetClass) { this.targetClass = targetClass; }

    public String getExam() { return exam; }
    public void setExam(String exam) { this.exam = exam; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public User getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }

    public Long getDownloads() { return downloads; }
    public void setDownloads(Long downloads) { this.downloads = downloads; }

    public Long getViews() { return views; }
    public void setViews(Long views) { this.views = views; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }

    public enum ResourceType {
        pq, notes, assignment, imp
    }
}