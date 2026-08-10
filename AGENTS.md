# TechPath — AGENTS.md

## 1. Project Definition

Build **TechPath**, a technology learning platform.

TechPath allows users to learn technical subjects through structured learning content, practical exercises, assessments, and progress tracking.

The platform must support different technology domains without being tied to a specific programming language, framework, or technology.

Examples of possible domains:

* Software Engineering
* Web Development
* Mobile Development
* Programming
* Databases
* Cybersecurity
* Networking
* Cloud Computing
* DevOps
* Artificial Intelligence
* Machine Learning
* Data Science
* Computer Science
* Operating Systems
* System Administration
* Software Architecture
* IT Infrastructure

The architecture must allow new domains, technologies, and courses to be added without changing the core application.

---

# 2. Core Learning Structure

Use this hierarchy:

```text
Domain
  ↓
Technology / Subject
  ↓
Course
  ↓
Module
  ↓
Lesson
  ↓
Content Blocks
  ↓
Exercise / Assessment
```

Example:

```text
Software Engineering
  ↓
Software Testing
  ↓
Automated Testing
  ↓
Unit Testing
  ↓
Assertions
```

Another example:

```text
Cybersecurity
  ↓
Network Security
  ↓
Network Security Fundamentals
  ↓
Firewalls
  ↓
Firewall Rules
```

Another:

```text
Cloud Computing
  ↓
AWS
  ↓
AWS Fundamentals
  ↓
Compute
  ↓
Virtual Machines
```

Do not assume every course follows the same subject structure.

---

# 3. MVP

Implement these systems first.

### Public

* Landing page
* Domain browsing
* Technology browsing
* Course catalog
* Course details
* Module navigation
* Lesson viewer
* Search

### Authentication

* Register
* Login
* Logout
* Current user
* Protected routes

### Learning

* Lessons
* Examples
* Exercises
* Assessments
* Lesson completion
* Course progress
* Continue learning

### User

* Dashboard
* Learning progress
* Enrolled/started courses
* Recently completed lessons

### Admin

* Admin dashboard
* Domain management
* Technology/subject management
* Course management
* Module management
* Lesson management
* Content block management
* Exercise management
* Assessment management
* Draft/publish workflow

Do not implement secondary features before the core learning system works.

---

# 4. Technology Stack

Use the following stack.

## Frontend

* React
* TypeScript
* Vite
* React Router
* TanStack Query
* Tailwind CSS
* Lucide React
* React Hook Form
* Zod

## Backend

* Node.js
* Express
* TypeScript
* Mongoose
* MongoDB
* Zod
* bcrypt

## Authentication

Use secure HTTP-only cookie authentication or JWT-based authentication.

Prefer secure HTTP-only cookies for browser authentication.

## Database

* MongoDB
* MongoDB Atlas

## Testing

* Vitest
* React Testing Library
* Supertest
* Playwright

## Development Tools

* Git
* GitHub
* npm
* ESLint
* Prettier

---

# 5. Architecture

Use a separate frontend and backend.

```text
TechPath
├── client
└── server
```

Application flow:

```text
React
  ↓
REST API
  ↓
Express
  ↓
Services
  ↓
Mongoose
  ↓
MongoDB
```

Keep the architecture simple.

Do not introduce microservices.

Do not introduce Redis, queues, message brokers, Kubernetes, or other infrastructure unless explicitly required.

---

# 6. Frontend Architecture

Use feature-based organization.

```text
client/src/
├── components/
├── layouts/
├── pages/
├── features/
│   ├── auth/
│   ├── domains/
│   ├── technologies/
│   ├── courses/
│   ├── lessons/
│   ├── exercises/
│   ├── assessments/
│   ├── progress/
│   └── admin/
├── hooks/
├── services/
├── routes/
├── types/
├── utils/
├── lib/
├── App.tsx
└── main.tsx
```

Use:

* `components/` for reusable UI
* `features/` for feature-specific logic
* `services/` for API communication
* `hooks/` for reusable React logic
* `types/` for shared frontend types

Do not place business logic directly inside UI components.

---

# 7. Backend Architecture

Use:

```text
server/src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── validators/
├── utils/
├── types/
├── app.ts
└── server.ts
```

Responsibilities:

```text
routes
→ API route definitions

controllers
→ Request and response handling

services
→ Business logic

models
→ Database schemas

validators
→ Input validation

middleware
→ Authentication, authorization, errors
```

Do not put business logic directly inside routes.

---

# 8. Content Must Be Data-Driven

Never hard-code lessons into React pages.

Do not create:

```text
PythonVariables.tsx
DockerNetworking.tsx
CybersecurityBasics.tsx
AWSCompute.tsx
```

for individual lessons.

Lessons must come from the database.

The frontend must render lessons dynamically based on their stored content.

Adding a new lesson must not require changing frontend source code.

---

# 9. Content Block System

Lessons consist of ordered content blocks.

The block system must be technology-independent.

MVP block types:

```text
heading
text
code
image
video
tip
warning
note
example
exercise
assessment
```

Future block types may be added without changing the lesson architecture.

Example:

```json
{
  "type": "text",
  "content": "A database index improves query performance."
}
```

Example:

```json
{
  "type": "code",
  "language": "sql",
  "content": "SELECT * FROM users;"
}
```

Example:

```json
{
  "type": "example",
  "title": "Example",
  "content": "..."
}
```

The `language` field must not be restricted to a specific set of programming languages.

---

# 10. Lesson Renderer

Create a reusable lesson renderer.

```text
LessonRenderer
├── HeadingBlock
├── TextBlock
├── CodeBlock
├── ImageBlock
├── VideoBlock
├── TipBlock
├── WarningBlock
├── NoteBlock
├── ExampleBlock
├── ExerciseBlock
└── AssessmentBlock
```

The renderer determines which component to display based on the block type.

Do not create separate lesson components for individual courses.

---

# 11. Admin CMS

Admins create and manage educational content through the Admin Dashboard.

Admins must not need to edit source code to create lessons.

Workflow:

```text
Admin
 ↓
Domain
 ↓
Technology / Subject
 ↓
Course
 ↓
Module
 ↓
Lesson
 ↓
Content Editor
 ↓
Save Draft
 ↓
Preview
 ↓
Publish
```

The CMS must support:

* Create
* Edit
* Delete
* Reorder
* Draft
* Preview
* Publish
* Unpublish

for applicable content.

---

# 12. Domain Management

A domain represents a broad technology field.

Examples:

```text
Software Engineering
Cybersecurity
Cloud Computing
Artificial Intelligence
Networking
Data Science
```

Domain fields:

```text
name
slug
description
icon
status
order
createdAt
updatedAt
```

Admin operations:

```text
Create
Edit
Delete
Reorder
Publish
Unpublish
```

---

# 13. Technology / Subject Management

A domain can contain multiple technologies or subjects.

Example:

```text
Cloud Computing
├── AWS
├── Azure
└── Google Cloud
```

Example:

```text
Programming
├── Python
├── Java
├── C#
└── Go
```

Fields:

```text
domainId
name
slug
description
icon
status
order
createdAt
updatedAt
```

Do not assume every subject is a programming language.

---

# 14. Course Management

Course fields:

```text
technologyId
title
slug
description
thumbnail
difficulty
status
order
createdAt
updatedAt
```

Admin operations:

```text
Create
Edit
Delete
Reorder
Publish
Unpublish
```

Courses must reference their parent technology/subject.

---

# 15. Module Management

Module fields:

```text
courseId
title
description
order
```

Admin operations:

```text
Create
Edit
Delete
Reorder
```

Modules contain lessons.

---

# 16. Lesson Management

Lesson fields:

```text
moduleId
title
slug
description
sections
order
status
createdAt
updatedAt
```

Status:

```text
draft
published
```

Only published lessons are publicly accessible.

Admin operations:

```text
Create
Edit
Delete
Reorder
Preview
Publish
Unpublish
```

---

# 17. Content Editor

The admin lesson editor must support block-based content creation.

Example:

```text
Lesson Editor

Title
[ Introduction to Network Security ]

Description
[ Learn the fundamentals of... ]

Content

[ Heading ]
[ Text ]
[ Example ]
[ Code ]
[ Image ]
[ Tip ]
[ Exercise ]
[ Assessment ]

+ Add Block

[ Save Draft ] [ Preview ] [ Publish ]
```

Admins must be able to reorder blocks.

Do not use a single giant text field as the only lesson editor.

---

# 18. Exercises

Exercises must be generic enough to support different technology domains.

Possible exercise types:

```text
multiple-choice
true-false
text-answer
code
configuration
scenario
```

Do not assume every exercise requires programming.

Example:

```text
Cybersecurity:
Identify the vulnerability.
```

Example:

```text
Networking:
Identify the correct subnet configuration.
```

Example:

```text
Programming:
Write a function that...
```

The exercise architecture must support all of these.

---

# 19. Assessments

Assessments must support different question types.

MVP:

```text
multiple-choice
true-false
```

Future:

```text
multiple-select
short-answer
code
scenario
matching
```

Assessment structure:

```text
Assessment
 └── Questions
      ├── Question
      ├── Options
      ├── Correct Answer
      └── Explanation
```

Calculate results on the backend.

Never trust scores submitted by the frontend.

---

# 20. Practical Content

TechPath should support practical learning, not only reading.

Depending on the subject, practical content may include:

```text
Code
Configuration
Command examples
Diagrams
Terminal commands
Architecture examples
Case studies
Scenarios
Exercises
Simulations
```

Do not force every course into a programming-only learning format.

---

# 21. Code Content

Code blocks must support multiple languages.

Examples:

```text
JavaScript
Python
Java
C#
C++
Go
Rust
SQL
Bash
PowerShell
PHP
Ruby
etc.
```

Do not hard-code the application around any specific programming language.

Code blocks are primarily educational content.

Actual code execution is optional and must depend on the technology being taught.

---

# 22. Code Execution

Do not implement arbitrary server-side code execution in the MVP.

If interactive execution is required for a future feature:

* Isolate execution
* Use sandboxing
* Apply resource limits
* Apply execution time limits
* Restrict network access
* Never expose application secrets
* Never execute untrusted code directly on the main server

The platform must support lessons that do not require executable code.

---

# 23. Authentication

Implement:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Requirements:

* Hash passwords using bcrypt
* Never store plaintext passwords
* Validate authentication input
* Use secure authentication
* Protect authenticated routes

---

# 24. Authorization

MVP roles:

```text
USER
ADMIN
```

Backend must enforce roles.

Never trust frontend-provided:

```text
userId
role
permissions
```

Admin APIs must verify the authenticated user's role.

---

# 25. Progress

Track learning progress.

Minimum fields:

```text
userId
lessonId
completed
completedAt
```

API:

```text
GET  /api/progress
POST /api/progress/:lessonId/complete
```

Course progress is calculated from completed lessons.

The frontend must not directly determine or submit arbitrary progress percentages.

---

# 26. User Dashboard

Display:

```text
Continue Learning
Current Course
Current Lesson
Course Progress
Recently Completed
Started Courses
```

Use real API data.

Do not leave mock data in production features.

---

# 27. Search

Search must work across:

```text
Domains
Technologies
Courses
Lessons
```

Example:

```text
Search: Docker

Docker
Docker Fundamentals
Docker Images
Docker Containers
```

Use database/API search for MVP.

Do not introduce a dedicated search engine unless required by scale.

---

# 28. API Structure

Use REST APIs.

## Public

```text
GET /api/domains
GET /api/domains/:slug
GET /api/technologies
GET /api/technologies/:slug
GET /api/courses
GET /api/courses/:slug
GET /api/lessons/:slug
GET /api/search
```

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Progress

```text
GET  /api/progress
POST /api/progress/:lessonId/complete
```

## Assessments

```text
GET  /api/assessments/:lessonId
POST /api/assessments/:assessmentId/submit
```

## Admin

```text
POST   /api/admin/domains
PATCH  /api/admin/domains/:id
DELETE /api/admin/domains/:id

POST   /api/admin/technologies
PATCH  /api/admin/technologies/:id
DELETE /api/admin/technologies/:id

POST   /api/admin/courses
PATCH  /api/admin/courses/:id
DELETE /api/admin/courses/:id

POST   /api/admin/modules
PATCH  /api/admin/modules/:id
DELETE /api/admin/modules/:id

POST   /api/admin/lessons
PATCH  /api/admin/lessons/:id
DELETE /api/admin/lessons/:id

POST   /api/admin/assessments
PATCH  /api/admin/assessments/:id
DELETE /api/admin/assessments/:id
```

Keep API naming consistent.

---

# 29. Database Models

MVP models:

```text
User
Domain
Technology
Course
Module
Lesson
Assessment
AssessmentQuestion
Exercise
Progress
```

Relationships:

```text
Domain
 └── Technology
      └── Course
           └── Module
                └── Lesson
                     ├── Exercise
                     └── Assessment

User
 └── Progress
```

Use MongoDB references for relationships where appropriate.

Add indexes for frequently queried fields.

At minimum:

```text
User.email
Domain.slug
Technology.slug
Course.slug
Lesson.slug
Progress.userId + lessonId
```

---

# 30. UI Pages

Required MVP pages:

```text
/
Landing

/domains
Domain listing

/domains/:slug
Domain page

/technologies/:slug
Technology page

/courses
Course catalog

/courses/:slug
Course page

/learn/:course/:lesson
Lesson page

/login
/register
Authentication

/dashboard
User dashboard

/admin
Admin dashboard
```

Admin management pages:

```text
/admin/domains
/admin/technologies
/admin/courses
/admin/modules
/admin/lessons
/admin/assessments
```

---

# 31. Lesson UI

The lesson page must prioritize readability.

Recommended structure:

```text
Course Navigation
       ↓
Lesson Header
       ↓
Lesson Content
       ↓
Examples
       ↓
Exercises
       ↓
Assessment
       ↓
Complete Lesson
       ↓
Previous / Next Lesson
```

The navigation structure may change depending on screen size.

The lesson viewer must be responsive.

---

# 32. UI Components

Create reusable components for:

```text
Button
Input
Select
Modal
Dropdown
Card
Badge
Tabs
Progress
Alert
Toast
CodeBlock
LessonBlock
Exercise
Assessment
LoadingState
EmptyState
ErrorState
```

Avoid duplicated UI implementations.

---

# 33. Validation

Use Zod for backend validation.

Validate:

* Authentication
* Domain creation
* Technology creation
* Course creation
* Module creation
* Lesson creation
* Content blocks
* Exercises
* Assessments
* Assessment submissions
* Progress updates
* Search parameters

Frontend validation does not replace backend validation.

---

# 34. Security

Always:

* Hash passwords
* Validate input
* Sanitize rendered HTML
* Protect admin endpoints
* Protect authenticated endpoints
* Configure CORS
* Use secure cookies where applicable
* Apply rate limiting to authentication
* Prevent NoSQL injection
* Prevent XSS
* Use secure headers
* Never expose secrets to the client

Never commit secrets.

Use:

```text
.env
.env.example
```

---

# 35. Error Handling

Every API-driven UI must handle:

```text
Loading
Success
Empty
Error
```

Use consistent API responses.

Example:

```json
{
  "success": false,
  "message": "Course not found",
  "code": "COURSE_NOT_FOUND"
}
```

Never expose internal stack traces to users.

---

# 36. Testing

Use:

* Vitest
* React Testing Library
* Supertest
* Playwright

Test important functionality.

### Backend

* Authentication
* Authorization
* Domain APIs
* Course APIs
* Lesson APIs
* Progress APIs
* Assessment APIs

### Frontend

* Lesson renderer
* Course components
* Exercise components
* Assessment components
* Progress components

### E2E

User:

```text
Register
 ↓
Login
 ↓
Browse Domain
 ↓
Open Course
 ↓
Open Lesson
 ↓
Complete Lesson
 ↓
Take Assessment
 ↓
View Progress
```

Admin:

```text
Login
 ↓
Create Domain
 ↓
Create Technology
 ↓
Create Course
 ↓
Create Module
 ↓
Create Lesson
 ↓
Add Content
 ↓
Publish
 ↓
View Public Lesson
```

---

# 37. Code Quality

Use TypeScript throughout the application.

Rules:

* Avoid unnecessary `any`
* Use meaningful names
* Keep functions focused
* Keep components focused
* Separate business logic from UI
* Reuse existing utilities
* Avoid duplicated logic
* Handle errors explicitly
* Validate external input

Do not over-engineer.

---

# 38. Dependency Rules

Before adding a package:

1. Check existing dependencies.
2. Check whether native functionality is sufficient.
3. Add a dependency only when necessary.
4. Verify compatibility.
5. Keep dependencies minimal.

Do not add libraries without a clear purpose.

---

# 39. AI Agent Rules

Before modifying code:

1. Inspect the existing implementation.
2. Understand the current architecture.
3. Reuse existing code where possible.
4. Identify affected files.
5. Implement only the requested feature.
6. Run relevant tests.
7. Fix resulting errors.
8. Do not modify unrelated functionality.

Do not rewrite working code without a reason.

Do not replace the technology stack.

Do not introduce new architecture without explicit approval.

Do not generate the entire application in one step.

---

# 40. Development Order

Implement in this order:

```text
1. Project setup
2. Database connection
3. Database models
4. Authentication
5. Domain APIs
6. Technology APIs
7. Course APIs
8. Module APIs
9. Lesson APIs
10. Public learning UI
11. Lesson renderer
12. Exercises
13. Assessments
14. Progress
15. User dashboard
16. Admin CMS
17. Search
18. Testing
19. Security review
20. Deployment
```

Do not build advanced features before the core learning flow works.

---

# 41. MVP Completion

The MVP must support this complete flow:

```text
ADMIN
 ↓
Create Domain
 ↓
Create Technology
 ↓
Create Course
 ↓
Create Module
 ↓
Create Lesson
 ↓
Add Content
 ↓
Publish

USER
 ↓
Browse Domain
 ↓
Browse Technology
 ↓
Open Course
 ↓
Open Lesson
 ↓
Learn
 ↓
Complete Exercise
 ↓
Take Assessment
 ↓
Complete Lesson
 ↓
Track Progress
 ↓
Continue Learning
```

This flow has the highest priority.

---

# 42. Do Not Implement

Unless explicitly requested, do not implement:

* AI tutor
* AI-generated lessons
* AI code reviewer
* Payments
* Subscriptions
* Certificates
* Leaderboards
* Social profiles
* Forums
* Chat
* Community
* Real-time collaboration
* Mobile applications
* Microservices
* Kubernetes
* Redis
* Advanced analytics
* Recommendation engines
* Advanced gamification
* Arbitrary server-side code execution

Build the core TechPath learning platform first.

Don't expose secrets even in fallbacks, use .env variable instead.