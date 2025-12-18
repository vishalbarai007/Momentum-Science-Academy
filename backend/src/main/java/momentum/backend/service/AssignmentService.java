package momentum.backend.service;

import momentum.backend.controller.AssignmentController.AssignmentUploadRequest; // Import DTO
import momentum.backend.controller.AssignmentController.StudentAssignmentDTO;
import momentum.backend.model.Assignment;
import momentum.backend.model.Submission;
import momentum.backend.model.User;
import momentum.backend.repository.AssignmentRepository;
import momentum.backend.repository.SubmissionRepository;
import momentum.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final UsersRepository usersRepository;

    public AssignmentService(AssignmentRepository assignmentRepository, SubmissionRepository submissionRepository, UsersRepository usersRepository) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.usersRepository = usersRepository;
    }

    /**
     * NEW: Logic to create an assignment from the teacher's upload request
     */
    public Assignment createAssignment(AssignmentUploadRequest req, String teacherEmail) {
        User teacher = usersRepository.findByEmail(teacherEmail);

        if (teacher == null) throw new RuntimeException("Teacher not found");
        if (teacher.getRole() != User.Role.teacher && teacher.getRole() != User.Role.admin) {
            throw new RuntimeException("Unauthorized: Only teachers can create assignments");
        }

        Assignment assignment = new Assignment();
        assignment.setTitle(req.getTitle());
        assignment.setDescription(req.getDescription());
        assignment.setSubject(req.getSubject());
        assignment.setTargetClass(String.valueOf(req.getTargetClass()));
        assignment.setDifficulty(req.getDifficulty());
        assignment.setFileUrl(req.getFileLink());
        assignment.setTeacher(teacher);
        assignment.setCreatedAt(new Date());

        // Parse Due Date (Frontend sends YYYY-MM-DD string)
        if (req.getDueDate() != null && !req.getDueDate().isEmpty()) {
            assignment.setDueDate(LocalDate.parse(req.getDueDate()));
        }

        // Handle Visibility?
        // Currently Assignment entity doesn't have isPublished,
        // but you can add it if you want drafts.

        return assignmentRepository.save(assignment);
    }

    public List<StudentAssignmentDTO> getAssignmentsWithStatus(String email) {
        User student = usersRepository.findByEmail(email);
        Set<String> accessTags = student.getAccessTags();
        List<Assignment> allAssignments = assignmentRepository.findAll();

        List<StudentAssignmentDTO> result = new ArrayList<>();

        for (Assignment a : allAssignments) {
            if (accessTags.contains(a.getTargetClass()) || accessTags.contains(a.getSubject())) {
                Optional<Submission> subOpt = submissionRepository.findByAssignmentAndStudent(a, student);

                String status = "Pending";
                String myFile = null;
                String score = null;

                if (subOpt.isPresent()) {
                    Submission sub = subOpt.get();
                    status = sub.getStatus();
                    myFile = sub.getFileUrl();
                    score = sub.getGrade();
                } else {
                    if (a.getDueDate() != null && LocalDate.now().isAfter(a.getDueDate())) {
                        status = "Missing";
                    }
                }

                result.add(new StudentAssignmentDTO(
                        a.getId(),
                        a.getTitle(),
                        a.getSubject(),
                        a.getTeacher().getFullName(),
                        a.getDueDate() != null ? a.getDueDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "No Due Date",
                        status,
                        a.getDifficulty(),
                        a.getFileUrl(),
                        myFile,
                        score
                ));
            }
        }
        return result;
    }

    public void submitAssignment(Long assignmentId, String fileUrl, String email) {
        User student = usersRepository.findByEmail(email);
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        Submission submission = submissionRepository.findByAssignmentAndStudent(assignment, student)
                .orElse(new Submission());

        submission.setStudent(student);
        submission.setAssignment(assignment);
        submission.setFileUrl(fileUrl);
        submission.setSubmittedAt(java.time.LocalDateTime.now());

        if (assignment.getDueDate() != null && java.time.LocalDate.now().isAfter(assignment.getDueDate())) {
            submission.setStatus("Late");
        } else {
            submission.setStatus("Submitted");
        }

        submissionRepository.save(submission);
    }
}