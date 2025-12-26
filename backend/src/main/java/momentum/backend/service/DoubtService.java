package momentum.backend.service;

import momentum.backend.model.Assignment;
import momentum.backend.model.Resource; // Assuming you have this model
import momentum.backend.model.Doubt;
import momentum.backend.model.User;
import momentum.backend.repository.AssignmentRepository;
import momentum.backend.repository.ResourceRepository; // You need this
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

    public DoubtService(DoubtRepository doubtRepository, UsersRepository usersRepository, AssignmentRepository assignmentRepository, ResourceRepository resourceRepository) {
        this.doubtRepository = doubtRepository;
        this.usersRepository = usersRepository;
        this.assignmentRepository = assignmentRepository;
        this.resourceRepository = resourceRepository;
    }

    public Doubt createDoubt(String studentEmail, String contextType, Long contextId, String question) {
        User student = usersRepository.findByEmail(studentEmail);
        User teacher = null;
        String title = "";

        // 1. Find the Teacher & Title based on Context
        if ("ASSIGNMENT".equalsIgnoreCase(contextType)) {
            Assignment a = assignmentRepository.findById(contextId)
                    .orElseThrow(() -> new RuntimeException("Assignment not found"));
            teacher = a.getTeacher();
            title = a.getTitle();
        }
        else if ("RESOURCE".equalsIgnoreCase(contextType)) {
            Resource r = resourceRepository.findById(contextId)
                    .orElseThrow(() -> new RuntimeException("Resource not found"));
            // Assuming Resource entity has a 'teacher' field
            teacher = r.getUploadedBy();
            title = r.getTitle();
        }
        else {
            throw new RuntimeException("Invalid context type");
        }

        // 2. Save Doubt
        Doubt doubt = new Doubt();
        doubt.setStudent(student);
        doubt.setTeacher(teacher);
        doubt.setContextType(contextType.toUpperCase());
        doubt.setContextId(contextId);
        doubt.setContextTitle(title);
        doubt.setQuestion(question);
        doubt.setCreatedAt(new Date());

        doubtRepository.save(doubt);
    }

    public Doubt replyToDoubt(Long doubtId, String answer, String teacherEmail) {
        Doubt doubt = doubtRepository.findById(doubtId)
                .orElseThrow(() -> new RuntimeException("Doubt not found"));

        if (!doubt.getTeacher().getEmail().equals(teacherEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        doubt.setAnswer(answer);
        doubtRepository.save(doubt);
    }

    public List<Doubt> getStudentDoubts(String email) {
        return doubtRepository.findByStudentOrderByCreatedAtDesc(usersRepository.findByEmail(email));
    }

    public List<Doubt> getTeacherDoubts(String email) {
        return doubtRepository.findByTeacherOrderByCreatedAtDesc(usersRepository.findByEmail(email));
    }
}