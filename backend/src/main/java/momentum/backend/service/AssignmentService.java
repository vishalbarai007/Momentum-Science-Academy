package momentum.backend.service;

import momentum.backend.controller.AssignmentController.AssignmentUploadRequest;
import momentum.backend.controller.AssignmentController.StudentAssignmentDTO;
import momentum.backend.controller.AssignmentController.SubmissionDTO;
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
import java.util.stream.Collectors;

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

    // --- 1. Create Assignment ---
    public Assignment createAssignment(AssignmentUploadRequest req, String teacherEmail) {
        User teacher = usersRepository.findByEmail(teacherEmail);

        if (teacher == null || (teacher.getRole() != User.Role.teacher && teacher.getRole() != User.Role.admin)) {
            throw new RuntimeException("Unauthorized: Only teachers can create assignments");
        }

        Assignment assignment = new Assignment();
        mapRequestToAssignment(assignment, req); // Helper to map DTO -> Entity
        assignment.setTeacher(teacher);
        assignment.setCreatedAt(new Date());

        return assignmentRepository.save(assignment);
    }

    // --- 2. Update Assignment ---
    public Assignment updateAssignment(Long id, AssignmentUploadRequest req, String teacherEmail) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Security: Ensure owner is editing
        if (!assignment.getTeacher().getEmail().equals(teacherEmail)) {
            throw new RuntimeException("Unauthorized: You can only edit your own assignments");
        }

        mapRequestToAssignment(assignment, req);
        return assignmentRepository.save(assignment);
    }

    // Helper: Maps DTO fields to Entity
    private void mapRequestToAssignment(Assignment assignment, AssignmentUploadRequest req) {
        if (req.getTitle() != null) assignment.setTitle(req.getTitle());
        if (req.getDescription() != null) assignment.setDescription(req.getDescription());
        if (req.getSubject() != null) assignment.setSubject(req.getSubject());
        if (req.getTargetClass() != null) assignment.setTargetClass(String.valueOf(req.getTargetClass()));
        if (req.getDifficulty() != null) assignment.setDifficulty(req.getDifficulty());
        if (req.getFileLink() != null) assignment.setFileUrl(req.getFileLink());
        if (req.getExamType() != null) assignment.setTargetExam(req.getExamType());

        // Map Due Date
        if (req.getDueDate() != null && !req.getDueDate().isEmpty()) {
            assignment.setDueDate(LocalDate.parse(req.getDueDate()));
        }

        // Map Visibility ("publish" -> true, "draft" -> false)
        if (req.getVisibility() != null) {
            assignment.setIsPublished("publish".equalsIgnoreCase(req.getVisibility()));
        }
    }

    // --- 3. Get Teacher's Assignments ---
    public List<Assignment> getAssignmentsByTeacher(String teacherEmail) {
        User teacher = usersRepository.findByEmail(teacherEmail);
        if (teacher == null) throw new RuntimeException("User not found");
        return assignmentRepository.findByTeacher(teacher);
    }

    // --- 4. Get Student Assignments (With Status Logic) ---
    public List<StudentAssignmentDTO> getAssignmentsWithStatus(String email) {
        User student = usersRepository.findByEmail(email);
        Set<String> accessTags = student.getAccessTags();

        // Fetch ALL assignments (Optimization: Could use a custom query to filter by published status in DB)
        List<Assignment> allAssignments = assignmentRepository.findAll();

        List<StudentAssignmentDTO> result = new ArrayList<>();

        for (Assignment a : allAssignments) {
            // FILTER 1: Must be Published
            if (!Boolean.TRUE.equals(a.getIsPublished())) {
                continue;
            }

            // FILTER 2: Must match Student Access Tags (Class, Subject, or Exam)
            boolean hasAccess = accessTags.contains(a.getTargetClass()) ||
                    accessTags.contains(a.getSubject()) ||
                    accessTags.contains(a.getTargetExam());

            if (hasAccess) {
                // Check Status
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
                        a.getDescription(),
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

    // --- 5. Submit Assignment ---
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

        // Logic: Late vs Submitted
        if (assignment.getDueDate() != null && java.time.LocalDate.now().isAfter(assignment.getDueDate())) {
            submission.setStatus("Late");
        } else {
            submission.setStatus("Submitted");
        }

        submissionRepository.save(submission);
    }

    // --- 6. View Submissions (Teacher) ---
    public List<SubmissionDTO> getSubmissionsForAssignment(Long assignmentId, String teacherEmail) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Security Check
        if (!assignment.getTeacher().getEmail().equals(teacherEmail)) {
            throw new RuntimeException("Unauthorized: You can only view submissions for your own assignments");
        }

        List<Submission> submissions = submissionRepository.findByAssignment(assignment);

        return submissions.stream().map(sub -> new SubmissionDTO(
                sub.getStudent().getFullName(),
                sub.getStudent().getEmail(),
                sub.getSubmittedAt().format(DateTimeFormatter.ofPattern("MMM dd, hh:mm a")),
                sub.getFileUrl(),
                sub.getStatus()
        )).collect(Collectors.toList());
    }

    public void gradeSubmission(Long submissionId, String grade, String feedback, String teacherEmail) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        // Security: Ensure the teacher grading it owns the assignment
        if (!submission.getAssignment().getTeacher().getEmail().equals(teacherEmail)) {
            throw new RuntimeException("Unauthorized: You can only grade submissions for your own assignments");
        }

        submission.setGrade(grade);
        submission.setFeedback(feedback);
        submission.setStatus("Graded");

        submissionRepository.save(submission);
    }

    // --- 8. NEW: Delete Assignment ---
    public void deleteAssignment(Long assignmentId, String teacherEmail) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (!assignment.getTeacher().getEmail().equals(teacherEmail)) {
            throw new RuntimeException("Unauthorized: You can only delete your own assignments");
        }

        // Optional: You might want to delete all related submissions first
        // depending on your database Cascade settings.
        // If you used CascadeType.ALL in the entity, this isn't needed.

        assignmentRepository.delete(assignment);
    }

    public void deleteSubmission(Long assignmentId, String studentEmail) {
        User student = usersRepository.findByEmail(studentEmail);
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        Submission submission = submissionRepository.findByAssignmentAndStudent(assignment, student)
                .orElseThrow(() -> new RuntimeException("No submission found to revoke"));

        // Validation: Cannot unsubmit if teacher has already graded it
        if ("Graded".equalsIgnoreCase(submission.getStatus())) {
            throw new RuntimeException("Cannot revoke submission: Assignment has already been graded.");
        }

        submissionRepository.delete(submission);
    }
}