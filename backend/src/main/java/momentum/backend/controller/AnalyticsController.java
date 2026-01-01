package momentum.backend.controller;

import momentum.backend.model.Lead;
import momentum.backend.model.Resource;
import momentum.backend.model.User;
import momentum.backend.repository.LeadRepository;
import momentum.backend.repository.ResourceRepository;
import momentum.backend.repository.UsersRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/analytics")
@CrossOrigin(origins = {"http://localhost:3000", "http://172.31.44.212:8080", "http://localhost:8080"})
public class AnalyticsController {

    private final UsersRepository usersRepository;
    private final ResourceRepository resourceRepository;
    private final LeadRepository leadRepository; // 1. Inject LeadRepo

    public AnalyticsController(UsersRepository usersRepository,
                               ResourceRepository resourceRepository,
                               LeadRepository leadRepository) {
        this.usersRepository = usersRepository;
        this.resourceRepository = resourceRepository;
        this.leadRepository = leadRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = new DashboardStats();

        // --- Existing Data Fetch ---
        List<User> students = usersRepository.findByRole(User.Role.student);
        List<User> teachers = usersRepository.findByRole(User.Role.teacher);
        List<Resource> resources = resourceRepository.findAll();

        // --- NEW: Lead Data Fetch ---
        List<Lead> dbLeads = leadRepository.findAll();

        // 2. Basic Counts
        stats.setTotalStudents((long) students.size());
        stats.setTotalTeachers((long) teachers.size());
        stats.setTotalResources((long) resources.size());

        // 3. Total Downloads
        long downloads = resources.stream()
                .mapToLong(r -> r.getDownloads() == null ? 0 : r.getDownloads())
                .sum();
        stats.setTotalDownloads(downloads);

        // 4. Program Distribution
        Map<String, Long> programs = students.stream()
                .filter(u -> u.getProgram() != null && !u.getProgram().isEmpty())
                .collect(Collectors.groupingBy(User::getProgram, Collectors.counting()));
        stats.setProgramDistribution(programs);

        // 5. Registration Trends
        Map<String, Long> trends = students.stream()
                .filter(u -> u.getCreatedAt() != null)
                .collect(Collectors.groupingBy(u ->
                                u.getCreatedAt().toInstant()
                                        .atZone(ZoneId.systemDefault())
                                        .getMonth().toString().substring(0, 3),
                        Collectors.counting()
                ));
        stats.setRegistrationTrends(trends);

        // 6. Top Resources
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

        // --- NEW: Lead Analytics Logic (Database Only) ---

        // A. Total DB Leads
        stats.setTotalDbLeads((long) dbLeads.size());

        // B. Conversion Rate (Enrolled / Total)
        long enrolledCount = dbLeads.stream()
                .filter(l -> "ENROLLED".equalsIgnoreCase(l.getStatus()))
                .count();

        double conversionRate = dbLeads.isEmpty() ? 0.0 : ((double) enrolledCount / dbLeads.size()) * 100;
        stats.setDbLeadConversionRate(Math.round(conversionRate * 10.0) / 10.0); // Round to 1 decimal

        // C. Leads by Status (For Pie/Bar Chart)
        Map<String, Long> statusDist = dbLeads.stream()
                .collect(Collectors.groupingBy(
                        lead -> lead.getStatus().toUpperCase(),
                        Collectors.counting()
                ));
        stats.setDbLeadsByStatus(statusDist);

        return ResponseEntity.ok(stats);
    }

    // --- DTO Classes ---

    public static class DashboardStats {
        private Long totalStudents;
        private Long totalTeachers;
        private Long totalDownloads;
        private Long totalResources;

        // New Lead Fields
        private Long totalDbLeads;
        private Double dbLeadConversionRate;
        private Map<String, Long> dbLeadsByStatus;

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

        // New Lead Getters/Setters
        public Long getTotalDbLeads() { return totalDbLeads; }
        public void setTotalDbLeads(Long totalDbLeads) { this.totalDbLeads = totalDbLeads; }
        public Double getDbLeadConversionRate() { return dbLeadConversionRate; }
        public void setDbLeadConversionRate(Double dbLeadConversionRate) { this.dbLeadConversionRate = dbLeadConversionRate; }
        public Map<String, Long> getDbLeadsByStatus() { return dbLeadsByStatus; }
        public void setDbLeadsByStatus(Map<String, Long> dbLeadsByStatus) { this.dbLeadsByStatus = dbLeadsByStatus; }
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