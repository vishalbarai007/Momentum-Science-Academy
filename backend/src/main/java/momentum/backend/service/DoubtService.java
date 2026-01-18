package momentum.backend.service;

import momentum.backend.model.Assignment;
import momentum.backend.model.Resource;
import momentum.backend.model.Doubt;
import momentum.backend.model.User;
import momentum.backend.repository.AssignmentRepository;
import momentum.backend.repository.ResourceRepository;
import momentum.backend.repository.DoubtRepository;
import momentum.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class DoubtService {

    private final DoubtRepository doubtRepository;
    private final UsersRepository usersRepository;
    private final AssignmentRepository assignmentRepository;
    private final ResourceRepository resourceRepository;

    public DoubtService(DoubtRepository doubtRepository, UsersRepository usersRepository,
                        AssignmentRepository assignmentRepository, ResourceRepository resourceRepository) {
        this.doubtRepository = doubtRepository;
        this.usersRepository = usersRepository;
        this.assignmentRepository = assignmentRepository;
        this.resourceRepository = resourceRepository;
    }

    /**
     * Creates a new doubt and associates it with the correct teacher and subject
     * based on the context (Resource or Assignment).
     */
    public Doubt createDoubt(String studentEmail, String contextType, Long contextId, String question) {
        User student = usersRepository.findByEmail(studentEmail);
        User teacher = null;
        String title = "";
        String subject = "";

        // 1. Find the Teacher, Title, and Subject based on Context
        if ("ASSIGNMENT".equalsIgnoreCase(contextType)) {
            // Fetching full entity to avoid Hibernate Proxy serialization issues in the controller response
            Assignment a = assignmentRepository.findById(contextId)
                    .orElseThrow(() -> new RuntimeException("Assignment not found"));
            teacher = a.getTeacher();
            title = a.getTitle();
            subject = a.getSubject();
        }
        else if ("RESOURCE".equalsIgnoreCase(contextType)) {
            Resource r = resourceRepository.findById(contextId)
                    .orElseThrow(() -> new RuntimeException("Resource not found"));
            teacher = r.getUploadedBy();
            title = r.getTitle();
            subject = r.getSubject();
        }
        else {
            throw new RuntimeException("Invalid context type: " + contextType);
        }

        // 2. Map fields to new Doubt entity
        Doubt doubt = new Doubt();
        doubt.setStudent(student);
        doubt.setTeacher(teacher);
        doubt.setContextType(contextType.toUpperCase());
        doubt.setContextId(contextId);
        doubt.setContextTitle(title);
        doubt.setSubject(subject); // Population of the new subject field
        doubt.setQuestion(question);
        doubt.setCreatedAt(new Date());

        return doubtRepository.save(doubt);
    }

    /**
     * Updates a doubt with a teacher's answer.
     */
    public Doubt replyToDoubt(Long doubtId, String answer, String teacherEmail) {
        Doubt doubt = doubtRepository.findById(doubtId)
                .orElseThrow(() -> new RuntimeException("Doubt not found"));

        // Basic security check to ensure the replying teacher owns the context
        if (!doubt.getTeacher().getEmail().equalsIgnoreCase(teacherEmail)) {
            throw new RuntimeException("Unauthorized: You are not the assigned teacher for this doubt.");
        }

        doubt.setAnswer(answer);
        return doubtRepository.save(doubt);
    }

    public List<Doubt> getStudentDoubts(String email) {
        User student = usersRepository.findByEmail(email);
        return doubtRepository.findByStudentOrderByCreatedAtDesc(student);
    }

    public List<Doubt> getTeacherDoubts(String email) {
        User teacher = usersRepository.findByEmail(email);
        return doubtRepository.findByTeacherOrderByCreatedAtDesc(teacher);
    }
}