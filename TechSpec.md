# BK Environmental Platform - Technical Specification

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Animation**: GSAP (ScrollTrigger, Flip), Framer Motion, Lenis
- **State Management**: Zustand + React Query
- **3D/WebGL**: React-Three-Fiber (Three.js)

### Backend Architecture
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js + JWT
- **File Storage**: AWS S3 compatible
- **AI Integration**: OpenAI API (GPT-4)

### Database Schema (Prisma)

```prisma
// User & Authentication
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  company       String?
  phone         String?
  role          UserRole  @default(CLIENT)
  password      String?   // Hashed
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  projects      Project[]
  consultations Consultation[]
  documents     Document[]
  messages      Message[]
}

enum UserRole {
  ADMIN
  CONSULTANT
  CLIENT
}

// Projects
model Project {
  id              String        @id @default(cuid())
  title           String
  description     String
  type            ProjectType
  status          ProjectStatus @default(PENDING)
  location        String
  clientId        String
  consultantId    String?
  startDate       DateTime?
  endDate         DateTime?
  progress        Int           @default(0)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // Relations
  client          User          @relation(fields: [clientId], references: [id])
  documents       Document[]
  reports         Report[]
  complianceItems ComplianceItem[]
  messages        Message[]
}

enum ProjectType {
  EIA
  ENVIRONMENTAL_AUDIT
  PROTECTION_PLAN
  AIR_QUALITY
  CLEANING
  FUMIGATION
  CONSULTING
}

enum ProjectStatus {
  PENDING
  IN_PROGRESS
  UNDER_REVIEW
  COMPLETED
  CANCELLED
}

// Documents
model Document {
  id          String       @id @default(cuid())
  name        String
  type        DocumentType
  url         String
  size        Int
  projectId   String?
  uploadedBy  String
  createdAt   DateTime     @default(now())
  
  // Relations
  project     Project?     @relation(fields: [projectId], references: [id])
  uploader    User         @relation(fields: [uploadedBy], references: [id])
}

enum DocumentType {
  EIA_REPORT
  AUDIT_REPORT
  PERMIT
  CERTIFICATE
  CONTRACT
  INVOICE
  OTHER
}

// AI Reports
model Report {
  id          String      @id @default(cuid())
  title       String
  type        ReportType
  content     String      @db.Text
  projectId   String
  generatedBy String      // AI or Consultant
  status      ReportStatus @default(DRAFT)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // Relations
  project     Project     @relation(fields: [projectId], references: [id])
}

enum ReportType {
  EIA_SUMMARY
  AUDIT_REPORT
  PROTECTION_PLAN
  COMPLIANCE_REPORT
}

enum ReportStatus {
  DRAFT
  REVIEW
  APPROVED
  ARCHIVED
}

// Compliance Tracking
model ComplianceItem {
  id          String           @id @default(cuid())
  title       String
  description String
  type        ComplianceType
  status      ComplianceStatus @default(PENDING)
  deadline    DateTime?
  projectId   String
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  
  // Relations
  project     Project          @relation(fields: [projectId], references: [id])
}

enum ComplianceType {
  PERMIT
  INSPECTION
  CERTIFICATION
  RENEWAL
  SUBMISSION
}

enum ComplianceStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  OVERDUE
}

// Consultation Requests
model Consultation {
  id          String   @id @default(cuid())
  name        String
  company     String
  email       String
  phone       String
  serviceType String
  description String   @db.Text
  location    String
  status      String   @default("PENDING")
  createdAt   DateTime @default(now())
  
  // Relations
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
}

// Messages
model Message {
  id        String   @id @default(cuid())
  content   String
  senderId  String
  projectId String
  createdAt DateTime @default(now())
  
  // Relations
  sender    User     @relation(fields: [senderId], references: [id])
  project   Project  @relation(fields: [projectId], references: [id])
}

// Blog Posts
model BlogPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   @db.Text
  image       String?
  category    String
  tags        String[]
  published   Boolean  @default(false)
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // SEO
  metaTitle       String?
  metaDescription String?
}

// Air Quality Data
model AirQualityReading {
  id          String   @id @default(cuid())
  location    String
  pm25        Float?
  pm10        Float?
  no2         Float?
  so2         Float?
  o3          Float?
  co          Float?
  aqi         Int?
  recordedAt  DateTime @default(now())
}
```

## API Routes Structure

```
/api/
├── auth/
│   ├── [...nextauth]/      # NextAuth configuration
│   ├── register/
│   └── reset-password/
├── users/
│   ├── route.ts            # GET, POST users
│   └── [id]/
│       └── route.ts        # GET, PUT, DELETE user
├── projects/
│   ├── route.ts            # GET, POST projects
│   └── [id]/
│       ├── route.ts        # GET, PUT, DELETE project
│       ├── documents/
│       ├── reports/
│       ├── compliance/
│       └── messages/
├── documents/
│   ├── route.ts
│   ├── upload/
│   └── [id]/
├── reports/
│   ├── route.ts
│   ├── generate/           # AI report generation
│   └── [id]/
├── consultations/
│   ├── route.ts
│   └── [id]/
├── blog/
│   ├── route.ts
│   ├── [slug]/
│   └── categories/
├── air-quality/
│   ├── route.ts
│   └── latest/
├── admin/
│   ├── dashboard/
│   ├── analytics/
│   └── users/
└── eia/
    ├── submit/
    ├── status/
    └── templates/
```

## Component Architecture

### Shared Components
```
/components/
├── ui/                     # shadcn/ui components
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Container.tsx
├── common/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Modal.tsx
│   └── Loading.tsx
├── animation/
│   ├── FadeIn.tsx
│   ├── SlideIn.tsx
│   ├── Parallax.tsx
│   ├── TextReveal.tsx
│   └── ParticleField.tsx
└── charts/
    ├── LineChart.tsx
    ├── BarChart.tsx
    ├── PieChart.tsx
    └── AirQualityGauge.tsx
```

### Section Components
```
/sections/
├── home/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── WhyChooseUs.tsx
│   ├── Projects.tsx
│   ├── Testimonials.tsx
│   ├── Blog.tsx
│   └── CTA.tsx
├── portal/
│   ├── Dashboard.tsx
│   ├── ProjectList.tsx
│   ├── DocumentManager.tsx
│   ├── ComplianceTracker.tsx
│   └── Messages.tsx
├── admin/
│   ├── AdminDashboard.tsx
│   ├── UserManagement.tsx
│   ├── ProjectManagement.tsx
│   ├── ContentManager.tsx
│   └── Analytics.tsx
└── ai/
    ├── ReportGenerator.tsx
    ├── EIAssistant.tsx
    └── TemplateSelector.tsx
```

## Animation Implementation Plan

### Global Animations
| Animation | Library | Implementation |
|-----------|---------|----------------|
| Smooth Scroll | Lenis | Global provider in layout |
| Page Transitions | Framer Motion | AnimatePresence wrapper |
| Scroll Progress | GSAP | ScrollTrigger scrub |

### Section Animations
| Section | Animation | Library | Details |
|---------|-----------|---------|---------|
| Hero | Text Reveal | GSAP SplitType | Word-by-word reveal with rotation |
| Hero | Parallax | GSAP ScrollTrigger | Background moves slower than content |
| Hero | Particles | React-Three-Fiber | Floating pollen/spores effect |
| About | Blob Morph | GSAP MorphSVG | Organic shape animation |
| About | Counter | GSAP | Number counting animation |
| Services | Accordion | Framer Motion | Horizontal expand on hover |
| Why Choose Us | SVG Draw | GSAP | Line drawing animation |
| Projects | 3D Carousel | React-Three-Fiber | Perspective rotation |
| Testimonials | Orbit | GSAP | Circular layout animation |
| Blog | Stagger | Framer Motion | Grid item entrance |
| CTA | Gradient | CSS | Rotating conic gradient |

### Interaction Animations
| Element | Effect | Implementation |
|---------|--------|----------------|
| Buttons | Magnetic | Custom hook with spring physics |
| Cards | Lift | Transform translateZ on hover |
| Images | Zoom | Scale transform with overflow hidden |
| Links | Underline | Width animation from left |
| Icons | Float | Subtle Y-axis oscillation |

## Security Implementation

### Authentication Flow
1. NextAuth.js with Credentials + OAuth providers
2. JWT tokens with 24h expiry
3. Refresh token rotation
4. Role-based access control (RBAC)

### Security Headers
```typescript
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Content-Security-Policy', value: CSP_POLICY },
];
```

### Input Validation
- Zod schemas for all API inputs
- React Hook Form with validation
- Sanitize HTML content (DOMPurify)

### Rate Limiting
- Upstash Redis for rate limiting
- 100 requests per minute per IP
- Stricter limits for auth endpoints

## SEO Implementation

### Meta Tags
```typescript
// Default metadata
export const metadata = {
  title: 'BK Environmental Consultancy Services | NEMC Certified Experts in Tanzania',
  description: 'Leading environmental consultancy in Tanzania. EIA, Environmental Audits, Air Quality Monitoring. NEMC certified experts in Dodoma.',
  keywords: 'Environmental Company Tanzania, Environmental Consultant Dodoma, NEMC Certification, EIA Tanzania',
  openGraph: {
    title: 'BK Environmental Consultancy Services',
    description: 'Sustainable Solutions for a Greener Tomorrow',
    images: ['/og-image.jpg'],
  },
};
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "BK Environmental Consultancy Services",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dodoma",
    "addressCountry": "TZ"
  },
  "telephone": "+255714052096",
  "email": "barakamaleka4@gmail.com",
  "url": "https://bkenvironmental.co.tz"
}
```

## Performance Targets

### Lighthouse Scores
- Performance: 95+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

### Optimization Strategies
1. **Images**: Next.js Image component with WebP format
2. **Fonts**: next/font for optimal loading
3. **Code Splitting**: Dynamic imports for heavy components
4. **Caching**: ISR for blog posts, SWR for data
5. **Bundle Analysis**: @next/bundle-analyzer

## Deployment Configuration

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://bkenvironmental.co.tz"

# OAuth (Optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Storage
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
S3_BUCKET_NAME="..."

# AI
OPENAI_API_KEY="..."

# Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```

### Build Configuration
```javascript
// next.config.js
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['bkenvironmental.s3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverActions: true,
  },
};
```

## File Structure

```
/mnt/okcomputer/output/app/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public website
│   │   ├── page.tsx              # Home page
│   │   ├── about/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── blog/
│   │   ├── contact/
│   │   └── layout.tsx
│   ├── (portal)/                 # Client portal
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── documents/
│   │   ├── compliance/
│   │   └── layout.tsx
│   ├── (admin)/                  # Admin dashboard
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── projects/
│   │   ├── content/
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/                   # React components
├── lib/                          # Utilities
│   ├── prisma.ts                 # Database client
│   ├── auth.ts                   # Auth configuration
│   ├── utils.ts                  # Helper functions
│   └── ai/                       # AI integrations
├── hooks/                        # Custom hooks
├── types/                        # TypeScript types
├── public/                       # Static assets
├── styles/                       # Global styles
├── prisma/
│   └── schema.prisma
└── next.config.js
```

## Implementation Phases

### Phase 1: Foundation
- [ ] Project setup with Next.js + TypeScript
- [ ] Database schema and Prisma setup
- [ ] Authentication system
- [ ] Basic layout components

### Phase 2: Public Website
- [ ] All marketing sections
- [ ] Blog system
- [ ] Contact forms
- [ ] SEO optimization

### Phase 3: Client Portal
- [ ] Dashboard
- [ ] Project management
- [ ] Document upload
- [ ] Messaging system

### Phase 4: Advanced Features
- [ ] AI report generator
- [ ] EIA submission workflow
- [ ] Compliance tracker
- [ ] Air quality dashboard

### Phase 5: Admin System
- [ ] Admin dashboard
- [ ] User management
- [ ] Analytics
- [ ] Content management

### Phase 6: Polish & Deploy
- [ ] Performance optimization
- [ ] Security audit
- [ ] Testing
- [ ] Deployment
