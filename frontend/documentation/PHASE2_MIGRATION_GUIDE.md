# Phase 2 Migration Guide

## Mock Test Engine Integration

### New Collections (MongoDB)
\`\`\`javascript
// Questions Collection
{
  "_id": ObjectId,
  "subject": String,
  "chapter": String,
  "difficulty": "easy|medium|hard",
  "questionText": String,
  "options": [String],
  "correctAnswer": Number,
  "explanation": String,
  "imageUrl": String,
  "category": String,
  "marks": Number
}

// Tests Collection
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "totalQuestions": Number,
  "totalMarks": Number,
  "duration": Number, // in minutes
  "instructions": String,
  "questionIds": [ObjectId],
  "difficulty": String,
  "subject": String,
  "createdBy": ObjectId,
  "published": Boolean,
  "createdAt": Timestamp,
  "resultsVisible": Boolean,
  "shuffleQuestions": Boolean,
  "shuffleOptions": Boolean
}

// Test Attempts Collection
{
  "_id": ObjectId,
  "studentId": ObjectId,
  "testId": ObjectId,
  "startTime": Timestamp,
  "endTime": Timestamp,
  "timeSpent": Number,
  "answers": [{
    "questionId": ObjectId,
    "selectedAnswer": Number,
    "isCorrect": Boolean,
    "marksObtained": Number,
    "timeSpent": Number
  }],
  "totalMarks": Number,
  "marksObtained": Number,
  "percentage": Number,
  "rank": Number,
  "submitted": Boolean
}
\`\`\`

### Frontend Routes to Add
- `/student/tests` - List of available tests
- `/student/tests/:id/attempt` - Test taking interface
- `/student/tests/:id/results` - Test results view
- `/teacher/tests` - Teacher test management
- `/admin/tests` - Admin test analytics

### API Routes to Add
- POST /api/tests - Create test
- GET /api/tests - List tests
- GET /api/tests/:id - Get test details
- POST /api/attempts - Start test attempt
- PUT /api/attempts/:id - Save/Submit attempt
- GET /api/attempts/:id - Get attempt results
- GET /api/analytics/test-performance - Analytics

### Components to Add
- TestList.tsx
- TestAttempt.tsx
- QuestionRenderer.tsx
- TestResults.tsx
- TestAnalytics.tsx
- QuestionTimerWidget.tsx

### No Breaking Changes Required
- Existing student dashboard can include new "Take Test" section
- Existing resources page unaffected
- New routes are isolated
- Database changes are additive only

## Attendance System Integration

### New Collection
\`\`\`javascript
{
  "_id": ObjectId,
  "studentId": ObjectId,
  "classId": String,
  "date": Date,
  "status": "present|absent|leave",
  "markedBy": ObjectId,
  "markedAt": Timestamp,
  "remarks": String
}
\`\`\`

### New Routes
- POST /api/attendance/mark - Mark attendance
- GET /api/attendance/:studentId - Get attendance
- GET /api/attendance/report - Attendance reports
- PUT /api/attendance/:id - Update attendance

### Components
- AttendanceMarker.tsx
- AttendanceReport.tsx
- StudentAttendanceView.tsx

## AI Analytics Integration

### New Collection
\`\`\`javascript
{
  "_id": ObjectId,
  "studentId": ObjectId,
  "subjectId": String,
  "strengths": [String],
  "weaknesses": [String],
  "learningPace": "slow|average|fast",
  "averageScore": Number,
  "progressTrend": Number,
  "recommendedTopics": [String],
  "nextLessonSuggestion": String,
  "generatedAt": Timestamp
}
\`\`\`

### Analytics Endpoints
- GET /api/analytics/student/:id - Student analytics
- GET /api/analytics/performance - Performance metrics
- GET /api/analytics/recommendations - AI recommendations
- GET /api/analytics/progress-trend - Progress visualization

### Dashboard Widgets
- PerformanceSummary.tsx
- ProgressChart.tsx
- RecommendationWidget.tsx
- StrengthsWeaknesses.tsx
- PaceLearning.tsx

## Migration Notes
- All Phase 2 features use new, isolated routes
- Existing APIs remain unchanged
- Database is backward compatible (additive collections)
- No frontend page restructuring needed
- Can be deployed independently
