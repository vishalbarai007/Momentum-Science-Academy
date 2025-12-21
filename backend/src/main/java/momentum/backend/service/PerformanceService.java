package momentum.backend.service;

import momentum.backend.model.Assignment;
import momentum.backend.model.Submission;
import momentum.backend.model.User;
import momentum.backend.repository.AssignmentRepository;
import momentum.backend.repository.SubmissionRepository;
import momentum.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UsersRepository usersRepository;

    public PerformanceService(SubmissionRepository submissionRepository, AssignmentRepository assignmentRepository, UsersRepository usersRepository) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
        this.usersRepository = usersRepository;
    }

    // --- 1. Get Stats ---
    public PerformanceStatsDTO getStudentStats(String email) {
        User student = usersRepository.findByEmail(email);
        List<Submission> gradedSubmissions = submissionRepository.findByStudent(student).stream()
                .filter(s -> "Graded".equalsIgnoreCase(s.getStatus()))
                .collect(Collectors.toList());

        if (gradedSubmissions.isEmpty()) {
            return new PerformanceStatsDTO("0%", 0, "N/A", "0%");
        }

        double totalScore = 0;
        int count = 0;
        for (Submission s : gradedSubmissions) {
            try {
                // Assuming format "45/50" -> parse 45
                String[] parts = s.getGrade().split("/");
                double obtained = Double.parseDouble(parts[0].trim());
                double max = Double.parseDouble(parts[1].trim());
                totalScore += (obtained / max) * 100;
                count++;
            } catch (Exception e) { /* Ignore invalid formats */ }
        }

        int avg = count > 0 ? (int) (totalScore / count) : 0;

        return new PerformanceStatsDTO(avg + "%", count, "#1", "+5%"); // Best rank is placeholder for now
    }

    // --- 2. Get Test Results ---
    public List<TestResultDTO> getStudentTestResults(String email) {
        User student = usersRepository.findByEmail(email);

        // Fetch all graded submissions
        List<Submission> mySubmissions = submissionRepository.findByStudent(student).stream()
                .filter(s -> "Graded".equalsIgnoreCase(s.getStatus()))
                .collect(Collectors.toList());

        List<TestResultDTO> results = new ArrayList<>();

        for (Submission sub : mySubmissions) {
            Assignment assignment = sub.getAssignment();

            // Calculate Rank dynamically
            // 1. Fetch all submissions for this assignment that are Graded
            List<Submission> allSubmissions = submissionRepository.findByAssignment(assignment).stream()
                    .filter(s -> "Graded".equalsIgnoreCase(s.getStatus()))
                    .collect(Collectors.toList());

            // 2. Sort by Grade (Assuming "X/Y" string format logic)
            allSubmissions.sort((s1, s2) -> Double.compare(parseScore(s2.getGrade()), parseScore(s1.getGrade())));

            // 3. Find index
            int rank = 1;
            for (Submission s : allSubmissions) {
                if (s.getId().equals(sub.getId())) break;
                rank++;
            }

            results.add(new TestResultDTO(
                    assignment.getId(),
                    assignment.getTitle(),
                    assignment.getDueDate() != null ? assignment.getDueDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "N/A",
                    sub.getGrade(), // "45/50"
                    rank,
                    allSubmissions.size()
            ));
        }
        return results;
    }

    // --- 3. Get Leaderboard ---
    public List<LeaderboardEntryDTO> getLeaderboard(Long assignmentId, String currentUserEmail) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        List<Submission> submissions = submissionRepository.findByAssignment(assignment).stream()
                .filter(s -> "Graded".equalsIgnoreCase(s.getStatus()))
                .sorted((s1, s2) -> Double.compare(parseScore(s2.getGrade()), parseScore(s1.getGrade())))
                .collect(Collectors.toList());

        // Return Top 5 + Current User
        List<LeaderboardEntryDTO> leaderboard = new ArrayList<>();
        int rank = 1;
        boolean userFound = false;

        for (Submission s : submissions) {
            boolean isMe = s.getStudent().getEmail().equals(currentUserEmail);
            if (rank <= 5 || isMe) {
                leaderboard.add(new LeaderboardEntryDTO(
                        rank,
                        s.getStudent().getFullName(),
                        s.getGrade(),
                        s.getStudent().getFullName().substring(0, 1).toUpperCase(),
                        isMe
                ));
            }
            if (isMe) userFound = true;
            rank++;
        }
        return leaderboard;
    }

    // Helper to parse "45/50" to 45.0
    private double parseScore(String grade) {
        try {
            return Double.parseDouble(grade.split("/")[0].trim());
        } catch (Exception e) { return 0.0; }
    }

    // --- DTOs ---
    public static class PerformanceStatsDTO {
        public String averageScore;
        public int totalTests;
        public String bestRank;
        public String improvement;
        public PerformanceStatsDTO(String a, int t, String b, String i) { averageScore=a; totalTests=t; bestRank=b; improvement=i; }
    }
    public static class TestResultDTO {
        public Long id;
        public String name;
        public String date;
        public String marks; // "45/50"
        public int rank;
        public int totalStudents;
        public TestResultDTO(Long id, String n, String d, String m, int r, int t) { this.id=id; name=n; date=d; marks=m; rank=r; totalStudents=t; }
    }
    public static class LeaderboardEntryDTO {
        public int rank;
        public String name;
        public String score;
        public String avatar;
        public boolean isCurrentUser;
        public LeaderboardEntryDTO(int r, String n, String s, String a, boolean isMe) { rank=r; name=n; score=s; avatar=a; isCurrentUser=isMe; }
    }
}