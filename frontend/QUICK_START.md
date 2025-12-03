# Quick Start Guide

## Frontend Setup (Next.js)

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
\`\`\`bash
# Clone repository
git clone <repo-url>
cd momentum-academy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add these variables:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
# JWT_SECRET=your_secret_key_here
\`\`\`

### Running Locally
\`\`\`bash
npm run dev
# Navigate to http://localhost:3000
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm run start
\`\`\`

## Backend Setup (Spring Boot)

### Prerequisites
- JDK 17+
- Maven
- MongoDB
- Redis

### Installation
\`\`\`bash
# Clone repository
cd momentum-academy-backend

# Build project
mvn clean install

# Configure application.properties
server.port=8080
spring.data.mongodb.uri=mongodb://localhost:27017/momentum
redis.host=localhost
redis.port=6379
jwt.secret=your_secret_key_here
jwt.expiration=604800000 # 7 days
\`\`\`

### Running the Server
\`\`\`bash
mvn spring-boot:run
# API available at http://localhost:8080/api/v1
\`\`\`

## Key Directories

### Frontend
- `app/` - Next.js App Router pages
- `components/` - React components
- `lib/` - Utility functions
- `public/` - Static assets

### Backend
- `src/main/java/com/momentum/` - Source code
  - `controller/` - API endpoints
  - `service/` - Business logic
  - `repository/` - Data access
  - `model/` - Entity models
  - `security/` - JWT and auth
- `src/main/resources/` - Configuration files

## Testing

### Frontend
\`\`\`bash
npm run test
npm run test:coverage
\`\`\`

### Backend
\`\`\`bash
mvn test
mvn test -Dtest=UserServiceTest
\`\`\`

## Deployment

### Frontend (Vercel)
\`\`\`bash
npm install -g vercel
vercel login
vercel --prod
\`\`\`

### Backend (AWS EC2)
\`\`\`bash
# Build JAR
mvn package

# Deploy JAR to EC2
scp target/momentum-academy-1.0.jar user@ec2-instance:/app/

# On EC2, run:
java -jar /app/momentum-academy-1.0.jar
\`\`\`

## Common Issues

### MongoDB Connection Failed
- Ensure MongoDB is running: `brew services start mongodb-community`
- Check connection string in `application.properties`

### CORS Errors
- Verify `NEXT_PUBLIC_API_URL` matches backend URL
- Check Spring Boot CORS configuration

### JWT Token Expired
- Clear localStorage: `localStorage.clear()`
- Refresh token implemented automatically
- Check JWT expiry in backend config

## API Testing

### Using Postman
- Import Postman collection from `/docs/postman-collection.json`
- Set environment variables
- Run requests with authentication

### Using curl
\`\`\`bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@momentum.edu","password":"123456","fullName":"John","role":"student"}'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@momentum.edu","password":"123456"}'
\`\`\`

## Next Steps

1. Customize branding (logo, colors, text)
2. Configure email service for notifications
3. Set up payment gateway (if monetizing)
4. Configure AWS S3 for file uploads
5. Set up monitoring and logging
6. Create admin user account
7. Import sample data
8. Launch Phase 2 features

\`\`\`

Perfect! I've created a comprehensive Phase 1 platform. Let me now create the Student and Teacher portals:
