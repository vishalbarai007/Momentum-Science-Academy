package momentum.backend.controller;

import momentum.backend.model.Resource;
import momentum.backend.model.User;
import momentum.backend.repository.ResourceRepository;
import momentum.backend.repository.UsersRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    private final UsersRepository usersRepository;
    private final ResourceRepository resourceRepository;

    public AnalyticsController(UsersRepository usersRepository, ResourceRepository resourceRepository) {
        this.usersRepository = usersRepository;
        this.resourceRepository = resourceRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = new DashboardStats();

        // 1. Fetch Data
        List<User> students = usersRepository.findByRole(User.Role.student);
        List<User> teachers = usersRepository.findByRole(User.Role.teacher);
        List<Resource> resources = resourceRepository.findAll();

        // 2. Basic Counts
        stats.setTotalStudents((long) students.size());
        stats.setTotalTeachers((long) teachers.size());
        stats.setTotalResources((long) resources.size());

        // 3. Total Downloads
        long downloads = resources.stream()
                .mapToLong(r -> r.getDownloads() == null ? 0 : r.getDownloads())
                .sum();
        stats.setTotalDownloads(downloads);

        // 4. Program Distribution (Pie Chart Data)
        Map<String, Long> programs = students.stream()
                .filter(u -> u.getProgram() != null && !u.getProgram().isEmpty())
                .collect(Collectors.groupingBy(User::getProgram, Collectors.counting()));
        stats.setProgramDistribution(programs);

        // 5. Registration Trends (Line Chart Data - Last 12 Months)
        // Grouping by Month Name (e.g., "JANUARY")
        Map<String, Long> trends = students.stream()
                .filter(u -> u.getCreatedAt() != null)
                .collect(Collectors.groupingBy(u ->
                                u.getCreatedAt().toInstant()
                                        .atZone(ZoneId.systemDefault())
                                        .getMonth().toString().substring(0, 3), // "JAN", "FEB"
                        Collectors.counting()
                ));
        stats.setRegistrationTrends(trends);

        // 6. Top Resources (Table Data)
        List<ResourceStats> topResources = resources.stream()
                .sorted((r1, r2) -> Long.compare(
                        r2.getDownloads() == null ? 0 : r2.getDownloads(),
                        r1.getDownloads() == null ? 0 : r1.getDownloads()
                ))
                .limit(5)
                .map(r -> new ResourceStats(
                        r.getTitle(),
                        r.getType().toString(),
                        r.getDownloads() == null ? 0 : r.getDownloads()
                ))
                .collect(Collectors.toList());
        stats.setTopResources(topResources);

        return ResponseEntity.ok(stats);
    }

    // --- DTO Classes ---

    public static class DashboardStats {
        private Long totalStudents;
        private Long totalTeachers;
        private Long totalDownloads;
        private Long totalResources;
        private Map<String, Long> programDistribution;
        private Map<String, Long> registrationTrends;
        private List<ResourceStats> topResources;

        // Getters and Setters
        public Long getTotalStudents() { return totalStudents; }
        public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }
        public Long getTotalTeachers() { return totalTeachers; }
        public void setTotalTeachers(Long totalTeachers) { this.totalTeachers = totalTeachers; }
        public Long getTotalDownloads() { return totalDownloads; }
        public void setTotalDownloads(Long totalDownloads) { this.totalDownloads = totalDownloads; }
        public Long getTotalResources() { return totalResources; }
        public void setTotalResources(Long totalResources) { this.totalResources = totalResources; }
        public Map<String, Long> getProgramDistribution() { return programDistribution; }
        public void setProgramDistribution(Map<String, Long> programDistribution) { this.programDistribution = programDistribution; }
        public Map<String, Long> getRegistrationTrends() { return registrationTrends; }
        public void setRegistrationTrends(Map<String, Long> registrationTrends) { this.registrationTrends = registrationTrends; }
        public List<ResourceStats> getTopResources() { return topResources; }
        public void setTopResources(List<ResourceStats> topResources) { this.topResources = topResources; }
    }

    public static class ResourceStats {
        private String title;
        private String type;
        private Long downloads;

        public ResourceStats(String title, String type, Long downloads) {
            this.title = title;
            this.type = type;
            this.downloads = downloads;
        }

        public String getTitle() { return title; }
        public String getType() { return type; }
        public Long getDownloads() { return downloads; }
    }
}