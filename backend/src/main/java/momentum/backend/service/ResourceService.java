package momentum.backend.service;

import momentum.backend.controller.ResourceController.ResourceUploadRequest; // Import the DTO
import momentum.backend.model.Resource;
import momentum.backend.model.User;
import momentum.backend.repository.ResourceRepository;
import momentum.backend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Date;
import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final UsersRepository usersRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ResourceService(ResourceRepository resourceRepository, UsersRepository usersRepository) {
        this.resourceRepository = resourceRepository;
        this.usersRepository = usersRepository;
    }

    /**
     * Handles resource upload.
     */
    public Resource uploadResource(ResourceUploadRequest request, String userEmail) {

        // 1. User Lookup
        User teacher = usersRepository.findByEmail(userEmail);
        if (teacher == null) {
            throw new RuntimeException("User not found");
        }

        // 2. Role Check
        if (teacher.getRole() != User.Role.teacher && teacher.getRole() != User.Role.admin) {
            throw new RuntimeException("Unauthorized: Only teachers or admins can upload resources");
        }

        // 3. Map DTO to Entity
        boolean isPublished = "publish".equalsIgnoreCase(request.getVisibility());

        Resource resource = new Resource();
        resource.setTitle(request.getTitle());
        resource.setDescription(request.getDescription());

        // Handle Enum conversion safely (assuming frontend sends valid lowercase
        // matching enum)
        if (request.getResourceType() != null) {
            resource.setType(Resource.ResourceType.valueOf(request.getResourceType().toLowerCase()));
        }

        resource.setSubject(request.getSubject());
        resource.setTargetClass(request.getTargetClass());
        resource.setExam(request.getExamType());
        resource.setFileUrl(request.getFileLink());
        resource.setUploadedBy(teacher);
        resource.setIsPublished(isPublished);

        // Defaults
        resource.setDownloads(0L);
        resource.setViews(0L);
        resource.setRating(0.0);
        resource.setCreatedAt(new Date());

        Resource savedResource = resourceRepository.save(resource);

        // Convert targetClass int to String to match User accessTags
        String classTag = String.valueOf(savedResource.getTargetClass());
        String examTag = savedResource.getExam();

        // Find students who have access to this class or exam
        List<User> studentsToNotify = usersRepository.findStudentsByResourceCriteria(classTag, examTag);

        // Send notification to each student
        for (User student : studentsToNotify) {
            messagingTemplate.convertAndSendToUser(
                    student.getEmail(),
                    "/queue/notifications",
                    "New " + savedResource.getType() + " added for " + savedResource.getSubject() + " (Class " + classTag + ")"
            );
        }
        return savedResource;
    }

    /**
     * NEW: Updates an existing resource.
     * Includes security check to ensure only the owner (uploader) can edit.
     */
    public Resource updateResource(Long id, ResourceUploadRequest request, String userEmail) {
        // 1. Find existing resource
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + id));

        // 2. Security Check: Ensure the logged-in user is the owner
        // (You can also allow ADMIN role here if needed)
        if (!resource.getUploadedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: You can only edit your own resources.");
        }

        // 3. Update Fields (Only if provided in request)
        if (request.getTitle() != null)
            resource.setTitle(request.getTitle());
        if (request.getDescription() != null)
            resource.setDescription(request.getDescription());
        if (request.getSubject() != null)
            resource.setSubject(request.getSubject());
        if (request.getTargetClass() != null)
            resource.setTargetClass(request.getTargetClass());
        if (request.getExamType() != null)
            resource.setExam(request.getExamType());
        if (request.getFileLink() != null)
            resource.setFileUrl(request.getFileLink());

        // Update Type (Enum conversion)
        if (request.getResourceType() != null) {
            try {
                resource.setType(Resource.ResourceType.valueOf(request.getResourceType().toLowerCase()));
            } catch (IllegalArgumentException e) {
                // Keep old type or throw specific error if enum is invalid
                System.err.println("Invalid resource type: " + request.getResourceType());
            }
        }

        // Update Visibility status
        if (request.getVisibility() != null) {
            resource.setIsPublished("publish".equalsIgnoreCase(request.getVisibility()));
        }

        // 4. Save Updates
        return resourceRepository.save(resource);
    }

    @Cacheable("resources")
    public List<Resource> getAllResources() {
        List<Resource> list = resourceRepository.findAll();
        // System.out.println(list.get(0).getExam());
        // System.out.println(list.get(0).getTargetClass());
        // System.out.println(list.get(0).getSubject());
        return list;
    }

    public List<Resource> getMyUploads(String email) {
        User teacher = usersRepository.findByEmail(email);
        if (teacher == null) {
            throw new RuntimeException("User not found");
        }
        return resourceRepository.findByUploadedBy(teacher);
    }

    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found");
        }
        resourceRepository.deleteById(id);
    }
}