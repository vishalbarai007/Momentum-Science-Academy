package momentum.backend.service;

import momentum.backend.model.Resource;
import momentum.backend.model.User;
import momentum.backend.repository.ResourceRepository;
import momentum.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import momentum.backend.controller.ResourceController.ResourceUploadRequest; // Import the DTO

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final UsersRepository usersRepository;

    public ResourceService(ResourceRepository resourceRepository, UsersRepository usersRepository) {
        this.resourceRepository = resourceRepository;
        this.usersRepository = usersRepository;
    }

    /**
     * Handles resource upload using data from the ResourceUploadRequest DTO.
     * The file link is passed directly, replacing MultipartFile logic.
     */
    public Resource uploadResource(ResourceUploadRequest request, String userEmail) { // Updated signature

        // 1. User Lookup (Direct null check as per your requirement)
        User teacher = usersRepository.findByEmail(userEmail);

        if (teacher == null) {
            throw new RuntimeException("User not found");
        }

        // 2. Role Check
        if (teacher.getRole() != User.Role.teacher && teacher.getRole() != User.Role.admin) {
            throw new RuntimeException("Unauthorized: Only teachers or admins can upload resources");
        }

        // 3. Data Mapping and Creation
        // Maps 'publish'/'draft' string to boolean
        boolean isPublished = "publish".equalsIgnoreCase(request.getVisibility());

        Resource resource = new Resource();
        resource.setTitle(request.getTitle());
        resource.setDescription(request.getDescription());
        resource.setType(Resource.ResourceType.valueOf(request.getResourceType().toLowerCase()));
        resource.setSubject(request.getSubject());
        resource.setTargetClass(request.getClassLevel()); // Maps frontend 'classLevel'
        resource.setExam(request.getExamType());         // Maps frontend 'examType'
        resource.setFileUrl(request.getFileLink());
        resource.setUploadedBy(teacher);
        resource.setIsPublished(isPublished);

        // Use default/explicit values for other fields
        resource.setDownloads(0L);
        resource.setViews(0L);
        resource.setRating(0.0);
        resource.setCreatedAt(new Date());

        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<Resource> getMyUploads(String email) {
        User teacher = usersRepository.findByEmail(email);

        if (teacher == null) {
            throw new RuntimeException("User not found");
        }

        return resourceRepository.findByUploadedBy(teacher);
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}