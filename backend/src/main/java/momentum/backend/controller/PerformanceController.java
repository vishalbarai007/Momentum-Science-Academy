package momentum.backend.controller;

import momentum.backend.service.PerformanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/performance")
@CrossOrigin(origins = "http://localhost:3000")
public class PerformanceController {

    private final PerformanceService performanceService;

    public PerformanceController(PerformanceService performanceService) {
        this.performanceService = performanceService;
    }

    // 1. Get Overall Stats (Avg Score, Best Rank, etc.)
    @GetMapping("/stats")
    public ResponseEntity<PerformanceService.PerformanceStatsDTO> getStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(performanceService.getStudentStats(auth.getName()));
    }

    // 2. Get List of Graded Assignments (Test Results)
    @GetMapping("/results")
    public ResponseEntity<List<PerformanceService.TestResultDTO>> getTestResults() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(performanceService.getStudentTestResults(auth.getName()));
    }

    // 3. Get Leaderboard for a Specific Assignment
    @GetMapping("/leaderboard/{assignmentId}")
    public ResponseEntity<List<PerformanceService.LeaderboardEntryDTO>> getLeaderboard(@PathVariable Long assignmentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(performanceService.getLeaderboard(assignmentId, auth.getName()));
    }
}