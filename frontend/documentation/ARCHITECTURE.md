# Momentum Science Academy - Phase 1 Architecture

## Project Overview
Complete digital platform for an educational coaching institute with public website, student portal, teacher portal, and admin dashboard.

## Technology Stack
- **Frontend**: Next.js 16 (App Router) + Tailwind CSS v4
- **Backend**: Spring Boot REST API (placeholder - to be implemented)
- **Database**: MongoDB (schema provided)
- **Caching**: Redis for session management
- **Hosting**: AWS (EC2, RDS, S3)

## Design System

### Color Palette
- **Primary**: Deep Navy Blue (#3B4B8F) - Trust, Education, Professionalism
- **Secondary**: Vibrant Blue (#5B7EC6) - Information, Clarity
- **Accent**: Bright Orange (#E67E22) - Call-to-Action, Highlights
- **Neutrals**: White, Light Gray, Dark Gray, Black

### Typography
- **Heading Font**: Geist (Sans-serif)
- **Body Font**: Geist (Sans-serif)
- **Font Sizes**: 14px (small), 16px (body), 20px (subheading), 24px+ (heading)

### Responsive Design
- Mobile First Approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## Project Structure

### Frontend (Next.js)
\`\`\`
app/
├── layout.tsx (Root layout)
├── globals.css (Design system)
├── page.tsx (Home)
├── about/
├── programs/
├── faculty/
├── blog/
├── contact/
├── student/
│   ├── login/
│   ├── dashboard/
│   ├── resources/
│   └── profile/
├── teacher/
│   ├── login/
│   ├── dashboard/
│   ├── upload-resource/
│   └── profile/
└── admin/
    ├── login/
    ├── dashboard/
    ├── users/
    ├── resources/
    ├── leads/
    └── referrals/

components/
├── ui/ (shadcn components)
├── public/
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── landing-page.tsx
├── student/
│   ├── student-dashboard.tsx
│   ├── resource-card.tsx
│   └── resource-filter.tsx
├── teacher/
│   ├── resource-upload.tsx
│   └── resource-list.tsx
└── admin/
    ├── admin-dashboard.tsx
    ├── user-management.tsx
    ├── leads-table.tsx
    └── analytics-charts.tsx

lib/
├── utils.ts
└── api-client.ts
\`\`\`

## API Endpoints Map

### Authentication
- POST /api/auth/register - Student/Teacher registration
- POST /api/auth/login - Login
- POST /api/auth/logout - Logout
- POST /api/auth/refresh-token - Refresh JWT

### Student Routes
- GET /api/students/profile - Get student profile
- PUT /api/students/profile - Update profile
- GET /api/resources - Get filtered resources
- GET /api/resources/download/:id - Download resource
- POST /api/submissions - Submit assignments

### Teacher Routes
- GET /api/teachers/profile - Get teacher profile
- POST /api/resources/upload - Upload resource
- GET /api/resources/my-uploads - Get uploaded resources
- DELETE /api/resources/:id - Delete resource
- GET /api/students - View enrolled students

### Admin Routes
- GET /api/admin/dashboard - Dashboard analytics
- GET /api/admin/users - List all users
- POST /api/admin/users/:id/block - Block user
- DELETE /api/admin/users/:id - Delete user
- GET /api/admin/leads - List all leads
- POST /api/admin/leads/:id/convert - Mark lead as converted
- GET /api/admin/resources - Manage resources
- POST /api/admin/referrals/generate - Generate referral code
- GET /api/admin/referrals - Track conversions

## Database Schema (MongoDB)

### Users Collection
\`\`\`json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password": "string (hashed)",
  "fullName": "string",
  "role": "student|teacher|admin",
  "phone": "string",
  "class": "string (for students)",
  "program": "string (for students)",
  "qualifications": "string[] (for teachers)",
  "experience": "number (for teachers)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "isActive": "boolean",
  "isVerified": "boolean"
}
\`\`\`

### Resources Collection
\`\`\`json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "type": "pq|notes|assignment|imp",
  "subject": "string",
  "class": "string",
  "exam": "string",
  "uploadedBy": "ObjectId (reference to users)",
  "fileUrl": "string",
  "fileSize": "number",
  "downloads": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "isPublished": "boolean"
}
\`\`\`

### Leads Collection
\`\`\`json
{
  "_id": "ObjectId",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "interestedProgram": "string",
  "inquiryType": "call|email|form",
  "status": "new|contacted|converted|rejected",
  "convertedStudent": "ObjectId|null",
  "notes": "string",
  "createdAt": "timestamp",
  "followUpDate": "timestamp"
}
\`\`\`

### Referrals Collection
\`\`\`json
{
  "_id": "ObjectId",
  "referralCode": "string (unique)",
  "referredBy": "ObjectId (reference to users)",
  "referralLink": "string",
  "referredStudents": ["ObjectId"],
  "conversions": "number",
  "reward": "string",
  "createdAt": "timestamp",
  "expiryDate": "timestamp"
}
\`\`\`

### Blog Collection
\`\`\`json
{
  "_id": "ObjectId",
  "title": "string",
  "slug": "string (unique)",
  "content": "string",
  "excerpt": "string",
  "author": "ObjectId (reference to users)",
  "category": "string",
  "tags": "string[]",
  "featured": "boolean",
  "views": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "published": "boolean"
}
\`\`\`

## RBAC (Role-Based Access Control)

### Student Role
- Can access only their own dashboard
- Can view and download resources
- Can submit assignments
- Can view profile and update personal info
- Cannot access teacher/admin panels

### Teacher Role
- Can upload resources
- Can view enrolled students
- Can grade submissions
- Can update own profile
- Cannot access admin panel or student data directly

### Admin Role
- Full access to all modules
- Can manage users (CRUD)
- Can manage resources
- Can view and manage leads
- Can generate referral codes
- Can access analytics

### Middleware Protection
- JWT token validation on every request
- Refresh token mechanism
- Session management via Redis
- Role-based route protection

## SEO Strategy

### Public Pages
- Meta titles and descriptions optimized for keywords
- Structured data (Schema.org) for organization
- Open Graph tags for social sharing
- Sitemap and robots.txt
- Mobile-first indexing ready

### Blog Section
- Keyword research for blog topics
- SEO-friendly URLs (slugs)
- Internal linking strategy
- Meta tags and canonical URLs
- Blog category pages for improved ranking

### Performance
- Image optimization
- Code splitting and lazy loading
- CSS minification
- Fast API response times

## Phase 2 Extensibility

### Mock Test Engine (Phase 2)
- New database collection for questions, tests, results
- API routes: /api/tests, /api/attempts, /api/results
- Student dashboard component: TestList, AttemptTest, ResultsAnalysis
- Separate test routing: /student/tests/*

### Attendance System (Phase 2)
- Attendance collection in MongoDB
- Attendance tracking APIs
- Teacher dashboard: MarkAttendance, AttendanceReport
- Admin analytics: AttendanceStats
- Minimal changes to existing structure

### AI Analytics (Phase 2)
- Analytics collection for performance data
- Student performance metrics component
- Personalized recommendations
- Progress tracking visualization
- No breaking changes to existing pages

## Deployment Checklist

### Backend
- [ ] Configure environment variables
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure Redis on AWS ElastiCache
- [ ] Set up AWS S3 for file uploads
- [ ] Configure JWT secret key
- [ ] Set up email service for notifications
- [ ] Deploy Spring Boot on EC2
- [ ] Configure API gateway

### Frontend
- [ ] Build optimized production bundle
- [ ] Configure environment variables
- [ ] Set up CDN for static assets
- [ ] Configure error logging (Sentry)
- [ ] Deploy on Vercel or AWS
- [ ] Set up custom domain
- [ ] Configure SSL certificate

### Security
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up WAF rules
- [ ] Enable database encryption
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerts
