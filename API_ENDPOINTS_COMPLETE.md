# Complete API Endpoints Reference

## Authentication

### POST /api/v1/auth/register
Register a new user (student, teacher, or admin)

**Request:**
\`\`\`json
{
  "email": "user@email.com",
  "password": "securePassword123",
  "fullName": "User Name",
  "phone": "+91 9876543210",
  "role": "student",
  "class": "12",
  "program": "JEE"
}
\`\`\`

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@email.com",
    "fullName": "User Name",
    "role": "student",
    "isVerified": false
  }
}
\`\`\`

**Error:** (400 Bad Request)
\`\`\`json
{
  "success": false,
  "error": "Email already registered"
}
\`\`\`

---

### POST /api/v1/auth/login
Authenticate user and receive JWT token

**Request:**
\`\`\`json
{
  "email": "user@email.com",
  "password": "securePassword123"
}
\`\`\`

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@email.com",
    "fullName": "User Name",
    "role": "student"
  }
}
\`\`\`

---

### POST /api/v1/auth/refresh-token
Refresh expired JWT token

**Request:**
\`\`\`json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
\`\`\`

**Response:** (200 OK)
\`\`\`json
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
\`\`\`

---

## Student Endpoints

### GET /api/v1/students/profile
Get logged-in student's profile
**Headers:** Authorization: Bearer {token}

**Response:** (200 OK)
\`\`\`json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "student@email.com",
  "fullName": "Aditya Sharma",
  "class": "12",
  "program": "JEE",
  "enrollmentDate": "2024-09-15T10:30:00Z",
  "phone": "+91 9876543210",
  "profileImage": "https://...",
  "isActive": true,
  "lastLogin": "2024-12-15T14:20:00Z"
}
\`\`\`

---

### PUT /api/v1/students/profile
Update student profile
**Headers:** Authorization: Bearer {token}

**Request:**
\`\`\`json
{
  "fullName": "Aditya Sharma Updated",
  "phone": "+91 9876543211",
  "class": "12",
  "program": "JEE"
}
\`\`\`

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "user": { ... }
}
\`\`\`

---

### GET /api/v1/resources
Get filtered resources for students

**Query Parameters:**
- `class`: "9|10|11|12"
- `subject`: "Math|Physics|Chemistry|Biology"
- `type`: "pq|notes|assignment|imp"
- `exam`: "JEE|NEET|MHT-CET"
- `search`: "search term"
- `page`: "1" (default)
- `limit`: "20" (default)

**Example:**
\`GET /api/v1/resources?class=12&subject=Math&type=pq&page=1\`

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "JEE Main 2024 Paper 1",
      "description": "Complete paper with solutions",
      "type": "pq",
      "subject": "Mathematics",
      "class": "12",
      "exam": "JEE",
      "fileUrl": "https://...",
      "fileSize": 5242880,
      "downloads": 342,
      "views": 1250,
      "uploadedBy": "507f1f77bcf86cd799439012",
      "uploadedDate": "2024-12-10T10:30:00Z",
      "rating": 4.8
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 234,
    "pages": 12
  }
}
\`\`\`

---

### GET /api/v1/resources/:id/download
Download a resource file
**Headers:** Authorization: Bearer {token}

**Response:** (200 OK)
- Returns file stream with Content-Disposition header
- Increments download count

---

### POST /api/v1/submissions
Submit assignment
**Headers:** Authorization: Bearer {token}

**Request:** (multipart/form-data)
\`\`\`
{
  "resourceId": "507f1f77bcf86cd799439011",
  "file": File,
  "notes": "My submission"
}
\`\`\`

**Response:** (201 Created)
\`\`\`json
{
  "success": true,
  "submissionId": "507f1f77bcf86cd799439015",
  "status": "submitted",
  "submittedAt": "2024-12-15T14:30:00Z"
}
\`\`\`

---

## Teacher Endpoints

### GET /api/v1/teachers/profile
Get logged-in teacher's profile
**Headers:** Authorization: Bearer {token}

**Response:** (200 OK)
\`\`\`json
{
  "id": "507f1f77bcf86cd799439012",
  "email": "teacher@email.com",
  "fullName": "Prof. R.P. Singh",
  "qualifications": ["B.Tech IIT-D", "GATE Qualified"],
  "experience": 18,
  "expertise": ["Algebra", "Calculus", "Trigonometry"],
  "totalUploads": 47,
  "totalDownloads": 3420,
  "avgRating": 4.8
}
\`\`\`

---

### POST /api/v1/resources/upload
Upload a new resource
**Headers:** Authorization: Bearer {token}, Content-Type: multipart/form-data

**Request:**
\`\`\`
{
  "title": "Algebra Equations Solutions",
  "description": "Complete solutions for algebra equations",
  "type": "notes",
  "subject": "Mathematics",
  "class": "12",
  "exam": "JEE",
  "file": File,
  "isPublished": true
}
\`\`\`

**Response:** (201 Created)
\`\`\`json
{
  "success": true,
  "resourceId": "507f1f77bcf86cd799439020",
  "title": "Algebra Equations Solutions",
  "fileUrl": "https://s3.amazonaws.com/...",
  "createdAt": "2024-12-15T14:30:00Z"
}
\`\`\`

---

### GET /api/v1/resources/my-uploads
Get teacher's uploaded resources
**Headers:** Authorization: Bearer {token}

**Query Parameters:**
- `page`: "1"
- `limit`: "20"
- `sortBy`: "recent|downloads|rating"

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "resources": [ ... ],
  "totalCount": 47
}
\`\`\`

---

### PUT /api/v1/resources/:id
Update resource details
**Headers:** Authorization: Bearer {token}

**Request:**
\`\`\`json
{
  "title": "Updated Title",
  "description": "Updated description",
  "isPublished": true
}
\`\`\`

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "resource": { ... }
}
\`\`\`

---

### DELETE /api/v1/resources/:id
Delete a resource
**Headers:** Authorization: Bearer {token}

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "message": "Resource deleted"
}
\`\`\`

---

## Admin Endpoints

### GET /api/v1/admin/dashboard
Get dashboard overview with all statistics
**Headers:** Authorization: Bearer {token}, Role: admin

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "overview": {
    "totalStudents": 2847,
    "totalTeachers": 156,
    "activeLeads": 423,
    "totalResources": 1203,
    "thisMonthRegistrations": 412,
    "conversionRate": 10.6,
    "monthlyData": [
      { "month": "Oct", "students": 240, "teachers": 12 },
      { "month": "Nov", "students": 325, "teachers": 15 },
      { "month": "Dec", "students": 289, "teachers": 18 }
    ]
  }
}
\`\`\`

---

### GET /api/v1/admin/users
List all users with filters
**Headers:** Authorization: Bearer {token}, Role: admin

**Query Parameters:**
- `role`: "student|teacher|admin"
- `search`: "name or email"
- `page`: "1"
- `limit": "20"
- `sortBy`: "recent|name|status"

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "Aditya Sharma",
      "email": "aditya@email.com",
      "role": "student",
      "class": "12",
      "program": "JEE",
      "joinDate": "2024-09-15T10:30:00Z",
      "lastLogin": "2024-12-15T14:20:00Z",
      "isActive": true
    }
  ],
  "total": 2847,
  "page": 1,
  "pages": 143
}
\`\`\`

---

### POST /api/v1/admin/users/:id/block
Block/unblock a user
**Headers:** Authorization: Bearer {token}, Role: admin

**Request:**
\`\`\`json
{
  "isActive": false,
  "reason": "Violation of terms"
}
\`\`\`

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "message": "User blocked successfully"
}
\`\`\`

---

### DELETE /api/v1/admin/users/:id
Delete a user account
**Headers:** Authorization: Bearer {token}, Role: admin

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "message": "User deleted"
}
\`\`\`

---

### GET /api/v1/admin/leads
Get all leads with status
**Headers:** Authorization: Bearer {token}, Role: admin

**Query Parameters:**
- `status`: "new|contacted|converted|rejected"
- `search`: "name or email"
- `page`: "1"

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "leads": [
    {
      "id": "507f1f77bcf86cd799439030",
      "fullName": "Arjun Singh",
      "email": "arjun@email.com",
      "phone": "+91 9876543210",
      "program": "NEET",
      "status": "new",
      "source": "website_form",
      "createdAt": "2024-12-15T10:30:00Z",
      "followUpDate": "2024-12-17T10:30:00Z"
    }
  ],
  "total": 423
}
\`\`\`

---

### POST /api/v1/admin/leads/:id/convert
Mark lead as converted (student enrolled)
**Headers:** Authorization: Bearer {token}, Role: admin

**Request:**
\`\`\`json
{
  "studentId": "507f1f77bcf86cd799439011",
  "notes": "Enrolled in JEE program"
}
\`\`\`

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "lead": {
    "id": "507f1f77bcf86cd799439030",
    "status": "converted",
    "convertedAt": "2024-12-15T14:30:00Z"
  }
}
\`\`\`

---

### POST /api/v1/admin/referrals/generate
Generate referral code for teacher
**Headers:** Authorization: Bearer {token}, Role: admin

**Request:**
\`\`\`json
{
  "teacherId": "507f1f77bcf86cd799439012",
  "reward": "₹500 per referral",
  "expiryDays": 90
}
\`\`\`

**Response:** (201 Created)
\`\`\`json
{
  "success": true,
  "referral": {
    "code": "RPSING2024",
    "referralLink": "https://momentum.edu/?ref=RPSING2024",
    "reward": "₹500 per referral",
    "expiryDate": "2025-03-15T10:30:00Z"
  }
}
\`\`\`

---

### GET /api/v1/admin/referrals
Get all referral codes and statistics
**Headers:** Authorization: Bearer {token}, Role: admin

**Response:** (200 OK)
\`\`\`json
{
  "success": true,
  "referrals": [
    {
      "code": "RPSING2024",
      "referredBy": "Prof. R.P. Singh",
      "referredCount": 23,
      "conversions": 6,
      "conversionRate": 26.1,
      "reward": "₹500 per referral",
      "rewardPaid": "₹3000",
      "createdAt": "2024-10-01T10:30:00Z",
      "expiryDate": "2025-03-15T10:30:00Z"
    }
  ]
}
\`\`\`

---

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "success": false,
  "error": "Invalid input data",
  "details": { "email": "Email is required" }
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "success": false,
  "error": "Unauthorized - Invalid or expired token"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "success": false,
  "error": "Access denied - Admin role required"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "success": false,
  "error": "Resource not found"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "success": false,
  "error": "Internal server error",
  "timestamp": "2024-12-15T14:30:00Z"
}
\`\`\`

---

## Response Headers

All API responses include:
- `Content-Type: application/json`
- `X-Request-ID: unique-id`
- `X-Rate-Limit-Limit: 100`
- `X-Rate-Limit-Remaining: 95`
- `Cache-Control: no-cache, no-store`

---

## Rate Limiting

- **Free Tier**: 100 requests/min per IP
- **Authenticated**: 500 requests/min per user
- **Admin**: Unlimited

---

## Authentication

All protected endpoints require JWT token in header:
\`\`\`
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

Token expires in 7 days. Use refresh-token endpoint to get new token.

\`\`\`
