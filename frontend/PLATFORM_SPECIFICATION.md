# Momentum Science Academy - Complete Platform Specification

## Executive Summary

This is a full-featured educational platform for Momentum Science Academy with:
- Professional public website with landing, about, programs, faculty, blog, contact pages
- Student portal for accessing resources and tracking progress
- Teacher portal for uploading resources and managing content
- Admin dashboard for user management, leads, and analytics
- Role-based access control with JWT authentication
- Production-ready folder structure for Next.js and Spring Boot

---

## Public Website Pages

### 1. Landing Page (/)
**Key Sections:**
- Sticky navbar with logo, navigation, login buttons
- Hero section with academy intro and CTA buttons
- Programs showcase (3 cards)
- Why Choose Us section (4 stats)
- Faculty preview (3 cards)
- Student achievements section
- Inquiry form modal

**Components Used:** Navbar, Footer, Button, Card
**SEO:** Title, description, structured data

### 2. About Page (/about)
**Content:**
- Mission and vision cards
- Teaching philosophy (4 pillars)
- Timeline of academy journey

**Key Features:** Responsive layout, engaging typography

### 3. Programs Page (/programs)
**Content:**
- 6 program cards (9-10, JEE, NEET, MHT-CET, Foundation 7-8, ICSE)
- Detailed features per program
- FAQ section
- Enrollment CTAs

**Functionality:** Filterable, expandable details

### 4. Faculty Page (/faculty)
**Display:**
- 6 faculty cards with:
  - Photo/avatar
  - Name and subject
  - Experience and qualifications
  - Specialization
  - Number of toppers mentored

### 5. Blog Page (/blog)
**Features:**
- Blog card grid (6 sample blogs)
- Category filters
- Search functionality
- Newsletter subscription CTA
- Individual blog viewing

**SEO:** Category pages, author pages, related posts

### 6. Contact Page (/contact)
**Sections:**
- Contact information cards
- Contact form
- Office hours
- Social media links
- Special offers promotion

---

## Student Portal

### Student Login Page (/student/login)
**Features:**
- Toggle between login and registration
- Email/password fields
- Class selection (for new students)
- Remember me checkbox
- Google OAuth option
- Demo credentials display
- Success/error handling

### Student Dashboard (/student/dashboard)
**Widgets:**
- Welcome message with student name
- Current program display
- Quick stats (resources accessed, tests taken)
- Recent resources section
- Upcoming assignments
- Performance summary

### Resources Page (/student/resources)
**Filters:**
- By Class (9-12)
- By Exam (JEE/NEET/MHT-CET)
- By Type (PYQs, Notes, Assignments, IMPs)
- By Subject
- Search bar

**Display:** Resource cards with download buttons, metadata

### Student Profile (/student/profile)
**Fields:**
- Name, email, phone
- Current class/program
- Enrollment date
- Performance summary
- Edit and logout options

---

## Teacher Portal

### Teacher Login Page (/teacher/login)
**Features:**
- Email/password authentication
- Educational background display
- Qualifications section
- Classes teaching
- Recent uploads

### Teacher Dashboard (/teacher/dashboard)
**Widgets:**
- Upload status
- Total resources uploaded
- Downloads count
- Student feedback summary
- Quick upload button

### Upload Resource Form (/teacher/upload)
**Fields:**
- Resource title
- Description
- Resource type (PYQ/Notes/Assignment/IMP)
- Subject selector
- Class selector
- File upload (drag-drop support)
- Publish checkbox
- Submit button

**Validation:** File size limits, format checks

### View Uploads (/teacher/resources)
**Display:**
- Table of uploaded resources
- Edit/delete options
- Download count
- Status indicator
- Date uploaded

---

## Admin Dashboard

### Admin Login (/admin/login)
**Features:**
- Email/password for admin
- Two-factor authentication (optional)
- Admin verification flow

### Dashboard Overview (/admin/dashboard)
**Key Metrics:**
- Total leads (with trend)
- Total students (with trend)
- Total teachers (with trend)
- Resource count
- Charts: Monthly enrollments, lead conversion rate

### User Management (/admin/users)
**Functionality:**
- Search and filter users
- View user details
- Block/unblock user
- Delete user
- Export user list
- Send notifications

**Data Displayed:**
- Name, email, role, join date
- Last login, status
- Actions column

### Resource Management (/admin/resources)
**Features:**
- Browse all resources
- Filter by teacher, subject, type
- Preview resource
- Delete resource
- Approve/reject submissions
- Analytics (downloads, views)

### Lead Management (/admin/leads)
**Features:**
- View all inquiries
- Filter by status (new, contacted, converted, rejected)
- Contact details display
- Mark as converted
- Add notes
- Schedule follow-up
- Export leads

### Referral System (/admin/referrals)
**Features:**
- Generate referral codes
- Track referral performance
- View conversions per code
- Set rewards
- Analytics dashboard

### Analytics & Reports (/admin/analytics)
**Dashboards:**
- Student growth chart
- Lead source analysis
- Program popularity
- Teacher performance
- Resource usage stats
- Revenue tracking

---

## API Contract Definitions

### Base URL: /api/v1

### Authentication Endpoints

#### POST /auth/register
\`\`\`json
Request: {
  "email": "string",
  "password": "string",
  "fullName": "string",
  "phone": "string",
  "role": "student|teacher",
  "class": "string (students only)",
  "program": "string (students only)"
}

Response: {
  "success": true,
  "token": "jwt_token",
  "user": { "id", "email", "role", "fullName" }
}
\`\`\`

#### POST /auth/login
\`\`\`json
Request: {
  "email": "string",
  "password": "string"
}

Response: {
  "success": true,
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "user": { ... }
}
\`\`\`

#### POST /auth/refresh-token
\`\`\`json
Request: {
  "refreshToken": "string"
}

Response: {
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
\`\`\`

### Student Endpoints

#### GET /students/profile
\`\`\`json
Response: {
  "id": "string",
  "email": "string",
  "fullName": "string",
  "class": "string",
  "program": "string",
  "enrollmentDate": "timestamp",
  "phone": "string"
}
\`\`\`

#### PUT /students/profile
\`\`\`json
Request: {
  "fullName": "string",
  "phone": "string",
  "class": "string"
}

Response: { success: true, user: { ... } }
\`\`\`

#### GET /resources
\`\`\`json
Query Parameters:
- class: "9|10|11|12"
- exam: "JEE|NEET|MHT-CET"
- subject: "Math|Physics|Chemistry|Biology"
- type: "pq|notes|assignment|imp"
- page: "number"
- limit: "number"

Response: {
  "resources": [
    {
      "id": "string",
      "title": "string",
      "type": "string",
      "subject": "string",
      "class": "string",
      "fileUrl": "string",
      "downloadCount": "number",
      "uploadedDate": "timestamp"
    }
  ],
  "total": "number",
  "page": "number"
}
\`\`\`

#### GET /resources/:id/download
\`\`\`
Returns: File stream with metadata
\`\`\`

### Teacher Endpoints

#### POST /resources/upload
\`\`\`json
Request (multipart/form-data):
{
  "title": "string",
  "description": "string",
  "type": "pq|notes|assignment|imp",
  "subject": "string",
  "class": "string",
  "file": "File object",
  "publish": "boolean"
}

Response: {
  "success": true,
  "resourceId": "string",
  "fileUrl": "string"
}
\`\`\`

#### GET /resources/my-uploads
\`\`\`json
Response: {
  "resources": [ ... ],
  "totalCount": "number"
}
\`\`\`

#### DELETE /resources/:id
\`\`\`json
Response: { "success": true }
\`\`\`

### Admin Endpoints

#### GET /admin/dashboard
\`\`\`json
Response: {
  "totalLeads": "number",
  "totalStudents": "number",
  "totalTeachers": "number",
  "resourceCount": "number",
  "monthlyEnrollments": [ { month: "Jan", count: 10 }, ... ],
  "conversionRate": "number"
}
\`\`\`

#### GET /admin/users
\`\`\`json
Query: ?role=student&page=1&limit=20&search=term

Response: {
  "users": [ { id, name, email, role, joinDate, lastLogin, status } ],
  "total": "number"
}
\`\`\`

#### POST /admin/users/:id/block
\`\`\`json
Response: { "success": true, "user": { ..., "isActive": false } }
\`\`\`

#### GET /admin/leads
\`\`\`json
Query: ?status=new&page=1&limit=20

Response: {
  "leads": [
    {
      "id": "string",
      "fullName": "string",
      "email": "string",
      "phone": "string",
      "program": "string",
      "status": "new|contacted|converted|rejected",
      "createdAt": "timestamp"
    }
  ],
  "total": "number"
}
\`\`\`

#### POST /admin/leads/:id/convert
\`\`\`json
Request: { "notes": "string" }

Response: { "success": true, "lead": { ..., "status": "converted" } }
\`\`\`

#### POST /admin/referrals/generate
\`\`\`json
Request: {
  "teacherId": "string",
  "reward": "string"
}

Response: {
  "referralCode": "string",
  "referralLink": "string"
}
\`\`\`

#### GET /admin/referrals
\`\`\`json
Response: {
  "referrals": [
    {
      "code": "string",
      "referredBy": "name",
      "conversions": "number",
      "reward": "string",
      "link": "string"
    }
  ]
}
\`\`\`

---

## Database Schema Details

### Complete Collections Structure

#### Users (Students, Teachers, Admins)
\`\`\`javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  passwordHash: String (bcrypt hashed),
  fullName: String,
  role: Enum ["student", "teacher", "admin"],
  phone: String,
  
  // Student-specific
  class: String (9-12),
  program: String (JEE, NEET, MHT-CET, Board),
  enrollmentDate: Date,
  preferredSubjects: [String],
  
  // Teacher-specific
  qualifications: [String],
  experience: Number (years),
  expertise: [String],
  hourlyRate: Number (optional),
  
  // Common
  profileImageUrl: String,
  isActive: Boolean (default: true),
  isVerified: Boolean (default: false),
  emailVerificationToken: String,
  
  // Timestamps and Metadata
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  loginCount: Number
}
\`\`\`

#### Resources
\`\`\`javascript
{
  _id: ObjectId,
  title: String (indexed),
  description: String,
  type: Enum ["pq", "notes", "assignment", "imp"],
  subject: String (indexed),
  class: String (indexed),
  exam: String (indexed for competitive exams),
  
  uploadedBy: ObjectId (ref: Users),
  fileUrl: String,
  fileSize: Number,
  fileType: String (pdf, doc, etc),
  
  downloads: Number (default: 0),
  views: Number (default: 0),
  rating: Number (1-5, optional),
  
  isPublished: Boolean,
  publishedDate: Date,
  
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

#### Leads
\`\`\`javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (indexed),
  phone: String (indexed),
  
  inquiryType: Enum ["call", "email", "form", "social"],
  interestedProgram: String,
  message: String,
  
  status: Enum ["new", "contacted", "converted", "rejected"],
  convertedStudentId: ObjectId (ref: Users, nullable),
  
  source: String,
  notes: String,
  
  createdAt: Date,
  followUpDate: Date,
  contactedAt: Date,
  convertedAt: Date
}
\`\`\`

#### Referrals
\`\`\`javascript
{
  _id: ObjectId,
  referralCode: String (unique, indexed),
  referralLink: String,
  
  referredBy: ObjectId (ref: Users),
  referralType: Enum ["teacher", "student"],
  
  reward: String,
  rewardValue: Number,
  
  referredStudents: [ObjectId],
  conversions: Number (default: 0),
  conversionRate: Number,
  
  isActive: Boolean,
  createdAt: Date,
  expiryDate: Date
}
\`\`\`

#### Blog Posts
\`\`\`javascript
{
  _id: ObjectId,
  title: String (unique, indexed),
  slug: String (unique, indexed),
  
  content: String,
  excerpt: String,
  featuredImageUrl: String,
  
  author: ObjectId (ref: Users),
  category: String (indexed),
  tags: [String],
  
  views: Number (default: 0),
  likes: Number (default: 0),
  
  isPublished: Boolean,
  publishedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

---

## RBAC Implementation

### Route Protection Middleware
\`\`\`
All protected routes require:
1. Valid JWT token in Authorization header
2. Token not expired
3. User active (isActive: true)
4. Role matches required role
5. Session exists in Redis cache
\`\`\`

### Role Permissions Matrix

| Feature | Student | Teacher | Admin |
|---------|---------|---------|-------|
| View own resources | ✓ | - | ✓ |
| Download resources | ✓ | ✓ | ✓ |
| Upload resources | - | ✓ | ✓ |
| Manage users | - | - | ✓ |
| View analytics | - | Limited | ✓ |
| Manage leads | - | - | ✓ |
| Generate referrals | - | - | ✓ |
| Access dashboard | ✓ | ✓ | ✓ |
| Modify others' data | - | - | ✓ |

---

## Deployment Architecture

### AWS Infrastructure
- **EC2**: Spring Boot Backend
- **RDS**: Backup database (replicated from MongoDB)
- **S3**: File storage for resources
- **ElastiCache**: Redis for caching/sessions
- **CloudFront**: CDN for static assets
- **Route53**: DNS management
- **CloudWatch**: Monitoring and logs

### Vercel (Frontend)
- Next.js app deployment
- Automatic deployments from GitHub
- Environment variable management
- Edge caching
- Serverless functions for API routes

### Security Measures
- HTTPS/TLS encryption
- CORS configuration
- Rate limiting (100 req/min)
- SQL injection prevention (prepared statements)
- XSS protection
- CSRF tokens
- Helmet.js for headers
- Password hashing (bcrypt)
- JWT with 7-day expiry
- Refresh token rotation

---

## Performance Optimization

### Frontend
- Code splitting with Next.js dynamic imports
- Image optimization with next/image
- CSS minification
- Lazy loading for components
- Caching headers
- Gzip compression

### Backend
- Connection pooling for database
- Redis caching for frequent queries
- Pagination for large datasets
- Index optimization (MongoDB)
- Horizontal scaling ready

### Database
- Proper indexing on frequently queried fields
- TTL indexes for temporary data
- Query optimization
- Regular backup and archival

---

## Phase 2 & Beyond

### Phase 2 (Future)
- Mock test engine with AI-powered analytics
- Attendance management system
- AI-powered student recommendations
- Live video classes integration
- Adaptive learning paths

### Phase 3 (Future)
- Mobile app (React Native)
- Advanced AI analytics
- Payment gateway integration
- Certification system
- Community forum

### Extensibility
- Plugin architecture for teachers
- Custom assessment tools
- Integration with third-party tools
- API for partner institutes

---

## Support & Documentation

### Developer Resources
- API documentation (Postman collection provided)
- Code repository with examples
- Architecture diagrams
- Database schemas with indexes
- Deployment guides

### User Documentation
- Student handbook
- Teacher resources
- Admin guide
- FAQ section
- Video tutorials

---

## Version History
- **v1.0** (Dec 2024): Initial Phase 1 release
  - Public website
  - Student/Teacher/Admin portals
  - Resource management
  - Lead management
  - Referral system
