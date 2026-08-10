import mongoose from 'mongoose';
import { env } from '../config/env';
import { Domain } from '../models/Domain';
import { Technology } from '../models/Technology';
import { Course } from '../models/Course';
import { Module } from '../models/Module';
import { Lesson } from '../models/Lesson';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('[Seed] Connected to MongoDB.');

    console.log('[Seed] Clearing previous curriculum data...');
    await Promise.all([
      Domain.deleteMany({}),
      Technology.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Lesson.deleteMany({}),
    ]);
    console.log('[Seed] Previous curriculum data cleared.');

    console.log('[Seed] Seeding 11 Complete Courses with 100% In-Depth Content & Working Diagrams...');

    // =========================================================================
    // DOMAIN 1: Web Development
    // =========================================================================
    const webDevDomain = await Domain.create({
      name: 'Web Development',
      slug: 'web-development',
      description:
        'Master modern frontend and full-stack web technologies, from core TypeScript to production React and Next.js architectures.',
      icon: 'Globe',
      status: 'published',
      order: 1,
    });

    // Tech 1.1: TypeScript
    const tsTech = await Technology.create({
      domainId: webDevDomain._id,
      name: 'TypeScript & Modern JavaScript',
      slug: 'typescript-javascript',
      description:
        'Typed JavaScript at any scale. Build resilient, type-safe web applications with advanced compile-time checks.',
      icon: 'Code2',
      status: 'published',
      order: 1,
    });

    // Course 1: TypeScript Mastery
    const tsCourse = await Course.create({
      technologyId: tsTech._id,
      title: 'TypeScript Mastery: Type Systems & Generics',
      slug: 'typescript-mastery-type-systems-generics',
      description:
        'Comprehensive guide to modern TypeScript: primitive types, discriminated unions, generic constraints, mapped types, and type guards.',
      thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc13c73335c?auto=format&fit=crop&q=80&w=800',
      difficulty: 'intermediate',
      status: 'published',
      order: 1,
    });

    const tsMod1 = await Module.create({
      courseId: tsCourse._id,
      title: '1. Foundations of TypeScript',
      description: 'Understanding strict typing, unions, and type aliases vs interfaces.',
      order: 1,
    });

    await Lesson.create({
      moduleId: tsMod1._id,
      title: 'Type Annotations, Unions & Discriminated Unions',
      slug: 'typescript-type-annotations-unions',
      description:
        'Master explicit type annotations, type inference, union types, and powerful pattern matching using discriminated unions.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Type Annotations & Discriminated Unions in TypeScript',
          order: 1,
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
          title: 'TypeScript Compilation & Static Analysis Architecture',
          alt: 'Code editor showing TypeScript static analysis and compilation',
          order: 2,
        },
        {
          type: 'text',
          content:
            '<p>TypeScript extends JavaScript by adding static type definitions. Types provide a way to describe the shape of an object, providing better documentation and allowing TypeScript to validate that your code is working correctly before it runs.</p>',
          order: 3,
        },
        {
          type: 'heading',
          level: 2,
          content: 'Primitives vs Union Types',
          order: 4,
        },
        {
          type: 'code',
          language: 'typescript',
          title: 'types-basics.ts',
          content: `// Explicit type annotations
const appName: string = "TechPath";
const currentVersion: number = 2.4;
const isProduction: boolean = true;

// Union Types: Allowing multiple possible types
type UserID = string | number;

function formatUserId(id: UserID): string {
  if (typeof id === "string") {
    return id.toUpperCase().trim();
  }
  return \`USR-#\${id.toString().padStart(6, "0")}\`;
}

console.log(formatUserId("auth0_98234")); // "AUTH0_98234"
console.log(formatUserId(42));            // "USR-#000042"`,
          order: 5,
        },
        {
          type: 'tip',
          title: 'Discriminated Unions Pattern',
          content:
            'A discriminated union combines a literal property tag (like <code>status</code> or <code>kind</code>) across multiple interfaces to guarantee exhaustive compile-time safety.',
          order: 6,
        },
        {
          type: 'code',
          language: 'typescript',
          title: 'discriminated-unions.ts',
          content: `// Discriminated Union for State Management
type NetworkState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: { courses: string[]; total: number } }
  | { status: "error"; error: string; code: number };

function renderNetworkUI(state: NetworkState): string {
  switch (state.status) {
    case "idle":
      return "Ready to load data.";
    case "loading":
      return "Fetching learning modules from API...";
    case "success":
      return \`Loaded \${state.data.total} courses successfully.\`;
    case "error":
      return \`Error (\${state.code}): \${state.error}\`;
  }
}`,
          order: 7,
        },
        {
          type: 'warning',
          title: 'Strict Mode Requirement',
          content:
            'Always enable <code>"strict": true</code> in your <code>tsconfig.json</code>. This turns on <code>noImplicitAny</code>, <code>strictNullChecks</code>, and ensures TypeScript catches undefined reference errors at compile time.',
          order: 8,
        },
      ],
    });

    await Lesson.create({
      moduleId: tsMod1._id,
      title: 'Generics & Utility Types in Practice',
      slug: 'typescript-generics-utility-types',
      description:
        'Write reusable, decoupled code using generic parameters, constraints, and built-in utility types like Partial, Omit, and Record.',
      status: 'published',
      order: 2,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Generic Functions and Type Constraints',
          order: 1,
        },
        {
          type: 'text',
          content:
            '<p>Generics allow you to create components and functions that work over a variety of types rather than a single one. This provides type safety without duplicating logic.</p>',
          order: 2,
        },
        {
          type: 'code',
          language: 'typescript',
          title: 'generics-constraints.ts',
          content: `// Generic interface with type constraint
interface HasId {
  _id: string;
}

// Generic API response parser
interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// Generic repository search function
function findById<T extends HasId>(items: T[], targetId: string): T | undefined {
  return items.find((item) => item._id === targetId);
}

// Built-in Utility Types: Partial, Pick, Omit, Record
interface CourseData {
  _id: string;
  title: string;
  slug: string;
  price: number;
  isPublished: boolean;
}

// Drafting course: all fields optional except title
type CourseDraft = Partial<CourseData> & Pick<CourseData, "title">;

// Payload for updating course without mutating _id
type UpdateCoursePayload = Omit<CourseData, "_id">;`,
          order: 3,
        },
        {
          type: 'note',
          title: 'Compiler Inlining',
          content:
            'TypeScript types are completely erased during compilation (type erasure), adding 0 bytes of overhead to your production JavaScript bundle.',
          order: 4,
        },
      ],
    });

    // Tech 1.2: React
    const reactTech = await Technology.create({
      domainId: webDevDomain._id,
      name: 'React 19 & Next.js',
      slug: 'react-nextjs',
      description:
        'The premier library for building component-driven interactive user interfaces and modern SSR applications.',
      icon: 'Code2',
      status: 'published',
      order: 2,
    });

    // Course 2: React Architecture
    const reactCourse = await Course.create({
      technologyId: reactTech._id,
      title: 'React 19 Architecture & State Patterns',
      slug: 'react-19-architecture-state-patterns',
      description:
        'Deep dive into modern React: component lifecycle, custom hooks, context optimization, useReducer state machines, and concurrency.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
      difficulty: 'intermediate',
      status: 'published',
      order: 2,
    });

    const reactMod1 = await Module.create({
      courseId: reactCourse._id,
      title: '1. Advanced Hooks & State Architecture',
      description: 'Building robust state workflows with reducers and context.',
      order: 1,
    });

    await Lesson.create({
      moduleId: reactMod1._id,
      title: 'useReducer & Context API State Machines',
      slug: 'react-usereducer-context-state-machines',
      description:
        'Scale state management without third-party libraries using useReducer and performant React Context providers.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Predictable State Management with useReducer',
          order: 1,
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&q=80&w=1200',
          title: 'React Unidirectional Data Flow & State Machine Transitions',
          alt: 'Diagram representing unidirectional data flow and state transitions in React',
          order: 2,
        },
        {
          type: 'text',
          content:
            '<p>When component state logic grows complex with multiple sub-values or dependent state transitions, <code>useReducer</code> is preferable to multiple <code>useState</code> calls because it centralizes state transitions in a pure reducer function.</p>',
          order: 3,
        },
        {
          type: 'code',
          language: 'typescript',
          title: 'QuizReducer.ts',
          content: `type QuizAction =
  | { type: "SUBMIT_ANSWER"; questionIndex: number; selectedOption: number }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET_QUIZ" };

interface QuizState {
  currentQuestion: number;
  answers: Record<number, number>;
  score: number;
  isComplete: boolean;
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SUBMIT_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionIndex]: action.selectedOption },
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
      };
    case "RESET_QUIZ":
      return {
        currentQuestion: 0,
        answers: {},
        score: 0,
        isComplete: false,
      };
    default:
      return state;
  }
}`,
          order: 4,
        },
        {
          type: 'tip',
          title: 'Context Performance Optimization',
          content:
            'Split state and dispatch into two separate contexts: <code>StateContext</code> and <code>DispatchContext</code>. Components that only dispatch actions will never re-render when state changes!',
          order: 5,
        },
      ],
    });

    // =========================================================================
    // DOMAIN 2: Programming & Software Engineering
    // =========================================================================
    const progDomain = await Domain.create({
      name: 'Programming & Software Engineering',
      slug: 'programming',
      description:
        'Core computer science principles, algorithms, data structures, and idiomatic programming across high-performance languages.',
      icon: 'Code2',
      status: 'published',
      order: 2,
    });

    // Tech 2.1: Python
    const pythonTech = await Technology.create({
      domainId: progDomain._id,
      name: 'Python',
      slug: 'python',
      description:
        'Versatile, high-level language widely used in web development, automation, data engineering, and machine learning.',
      icon: 'Code2',
      status: 'published',
      order: 1,
    });

    // Course 3: Python Deep Dive
    const pythonCourse = await Course.create({
      technologyId: pythonTech._id,
      title: 'Python Engineering: OOP, Data Structures & Concurrency',
      slug: 'python-engineering-oop-data-structures',
      description:
        'Master idiomatic Python 3: collections, generators, decorators, object-oriented design, context managers, and asyncio.',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800',
      difficulty: 'beginner',
      status: 'published',
      order: 1,
    });

    const pyMod1 = await Module.create({
      courseId: pythonCourse._id,
      title: '1. Python Data Structures & Idiomatic Syntax',
      description: 'Mastering lists, dictionaries, sets, and comprehension patterns.',
      order: 1,
    });

    await Lesson.create({
      moduleId: pyMod1._id,
      title: 'Generators, List Comprehensions & Memory Efficiency',
      slug: 'python-generators-comprehensions',
      description:
        'Write concise, memory-efficient Python using list comprehensions, dictionary mappings, and lazy generator pipelines.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Memory-Efficient Data Processing with Generators',
          order: 1,
        },
        {
          type: 'text',
          content:
            '<p>In Python, list comprehensions create the entire list in memory immediately. <strong>Generators</strong> use the <code>yield</code> keyword to produce items on demand (lazy evaluation), allowing you to process datasets that exceed available RAM.</p>',
          order: 2,
        },
        {
          type: 'code',
          language: 'python',
          title: 'generators_pipeline.py',
          content: `# Memory-efficient stream processing with Python generators
import sys

def stream_log_records(file_path: str):
    """Yield log lines one by one without reading whole file to memory."""
    with open(file_path, "r", encoding="utf-8") as file:
        for line in file:
            yield line.strip()

def filter_error_events(log_stream):
    """Filter records matching ERROR status."""
    for record in log_stream:
        if "ERROR" in record:
            yield record

# Generator comprehension: (O(1) memory footprint)
large_range = (x ** 2 for x in range(10_000_000))
print(f"Generator memory: {sys.getsizeof(large_range)} bytes")`,
          order: 3,
        },
        {
          type: 'example',
          title: 'Comprehensions Syntax',
          content:
            'Use dictionary comprehensions <code>{k: v for k, v in iterable}</code> to transform key-value pairs cleanly in one line.',
          order: 4,
        },
      ],
    });

    // Tech 2.2: Go (Golang)
    const goTech = await Technology.create({
      domainId: progDomain._id,
      name: 'Go (Golang)',
      slug: 'golang',
      description:
        'Statically typed, compiled language engineered by Google for building scalable, cloud-native backend systems and microservices.',
      icon: 'Cpu',
      status: 'published',
      order: 2,
    });

    // Course 4: Go Systems
    const goCourse = await Course.create({
      technologyId: goTech._id,
      title: 'Go Systems Programming & Concurrency Patterns',
      slug: 'go-systems-programming-concurrency',
      description:
        'Build blazingly fast backend systems with Go: structs, interfaces, memory allocation, goroutines, channels, and worker pools.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      difficulty: 'intermediate',
      status: 'published',
      order: 2,
    });

    const goMod1 = await Module.create({
      courseId: goCourse._id,
      title: '1. Concurrency with Goroutines & Channels',
      description: 'Master CSP concurrency, buffered channels, and select multiplexing.',
      order: 1,
    });

    await Lesson.create({
      moduleId: goMod1._id,
      title: 'Goroutines, Buffered Channels & Worker Pools',
      slug: 'golang-goroutines-worker-pools',
      description:
        'Implement resilient concurrent worker pool architectures in Go using channels and sync.WaitGroup.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Communicating Sequential Processes (CSP) in Go',
          order: 1,
        },
        {
          type: 'text',
          content:
            '<p>Go motto: <em>"Do not communicate by sharing memory; instead, share memory by communicating."</em> Goroutines are extremely lightweight green threads managed by the Go runtime scheduler, starting with just 2KB of stack memory.</p>',
          order: 2,
        },
        {
          type: 'code',
          language: 'go',
          title: 'worker_pool.go',
          content: `package main

import (
	"fmt"
	"sync"
	"time"
)

// Worker function consuming tasks from jobs channel
func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for j := range jobs {
		fmt.Printf("Worker %d processing task %d\\n", id, j)
		time.Sleep(50 * time.Millisecond) // Simulate I/O
		results <- j * 2
	}
}

func main() {
	const numJobs = 10
	const numWorkers = 3

	jobs := make(chan int, numJobs)
	results := make(chan int, numJobs)
	var wg sync.WaitGroup

	// Launch worker pool
	for w := 1; w <= numWorkers; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	// Dispatch tasks
	for j := 1; j <= numJobs; j++ {
		jobs <- j
	}
	close(jobs)

	// Wait for workers in separate goroutine
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect results
	for res := range results {
		fmt.Println("Result received:", res)
	}
}`,
          order: 3,
        },
        {
          type: 'tip',
          title: 'Prevent Goroutine Leaks',
          content:
            'Always ensure channel senders close channels when done, or utilize <code>context.Context</code> with timeouts and cancellation tokens to avoid hung goroutines.',
          order: 4,
        },
      ],
    });

    // =========================================================================
    // DOMAIN 3: Cloud Computing & Infrastructure
    // =========================================================================
    const cloudDomain = await Domain.create({
      name: 'Cloud Computing & DevOps',
      slug: 'cloud-computing',
      description:
        'Architect resilient, automated cloud infrastructure with AWS, Docker containerization, Kubernetes, and CI/CD pipelines.',
      icon: 'Cloud',
      status: 'published',
      order: 3,
    });

    // Tech 3.1: AWS
    const awsTech = await Technology.create({
      domainId: cloudDomain._id,
      name: 'Amazon Web Services (AWS)',
      slug: 'aws',
      description:
        'The leading cloud platform offering scalable compute, object storage, serverless lambdas, VPC networking, and managed databases.',
      icon: 'Cloud',
      status: 'published',
      order: 1,
    });

    // Course 5: AWS Architecture
    const awsCourse = await Course.create({
      technologyId: awsTech._id,
      title: 'AWS Cloud Architecture: Compute, S3 & Serverless',
      slug: 'aws-cloud-architecture-compute-storage',
      description:
        'Design fault-tolerant cloud solutions using Amazon EC2, S3 bucket security, IAM policies, and serverless AWS Lambda microservices.',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      difficulty: 'beginner',
      status: 'published',
      order: 1,
    });

    const awsMod1 = await Module.create({
      courseId: awsCourse._id,
      title: '1. Cloud Storage & Serverless Execution',
      description: 'Architecting with Amazon S3 storage classes and Lambda functions.',
      order: 1,
    });

    await Lesson.create({
      moduleId: awsMod1._id,
      title: 'Serverless Event-Driven Architectures with AWS Lambda',
      slug: 'aws-lambda-serverless-architecture',
      description:
        'Build scalable microservices with event-driven AWS Lambda execution, API Gateway triggers, and DynamoDB integration.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Serverless Computing with AWS Lambda',
          order: 1,
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
          title: 'Global Cloud Network & Serverless Execution Data Centers',
          alt: 'Data center fiber optics and cloud infrastructure servers',
          order: 2,
        },
        {
          type: 'text',
          content:
            '<p>AWS Lambda runs code without provisioning or managing servers. You pay only for the compute time you consume, scaled automatically from a few requests per day to hundreds of thousands per second.</p>',
          order: 3,
        },
        {
          type: 'code',
          language: 'typescript',
          title: 'lambda-handler.ts',
          content: `import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { courseId, userId } = body;

    console.log(\`Enrolling user \${userId} in course \${courseId}\`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        message: "Enrollment confirmed",
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};`,
          order: 4,
        },
        {
          type: 'tip',
          title: 'Minimizing Cold Starts',
          content:
            'Keep your Lambda deployment packages small, initialize database connections outside the handler function to reuse connections across warm invocations, and use Provisioned Concurrency for latency-critical APIs.',
          order: 5,
        },
      ],
    });

    // Tech 3.2: Docker
    const dockerTech = await Technology.create({
      domainId: cloudDomain._id,
      name: 'Docker & Containers',
      slug: 'docker',
      description:
        'Standardize environments, package dependencies, and build immutable container images for frictionless deployments.',
      icon: 'Layers',
      status: 'published',
      order: 2,
    });

    // Course 6: Docker Production
    const dockerCourse = await Course.create({
      technologyId: dockerTech._id,
      title: 'Docker Containerization & Production Microservices',
      slug: 'docker-containerization-production-microservices',
      description:
        'Master Dockerfile optimization, multi-stage builds, rootless container security, Docker Compose orchestrations, and volume persistence.',
      thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=800',
      difficulty: 'beginner',
      status: 'published',
      order: 2,
    });

    const dockerMod1 = await Module.create({
      courseId: dockerCourse._id,
      title: '1. Production Dockerfile Optimization',
      description: 'Writing minimal, secure, multi-stage container builds.',
      order: 1,
    });

    await Lesson.create({
      moduleId: dockerMod1._id,
      title: 'Multi-Stage Builds & Minimal Distroless Containers',
      slug: 'docker-multi-stage-builds',
      description:
        'Reduce container attack surfaces and shrink image sizes from 1GB to under 50MB using multi-stage builds and non-root users.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Multi-Stage Docker Builds for Node & React',
          order: 1,
        },
        {
          type: 'text',
          content:
            '<p>Multi-stage builds allow you to use intermediate images to compile code and install dev dependencies, then copy only the final compiled artifacts into a lightweight, secure production base image.</p>',
          order: 2,
        },
        {
          type: 'code',
          language: 'dockerfile',
          title: 'Dockerfile',
          content: `# Stage 1: Build & Compile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Never run containers as root!
USER node

COPY --chown=node:node package*.json ./
RUN npm ci --only=production
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/server.js"]`,
          order: 3,
        },
        {
          type: 'warning',
          title: 'Container Security Rule',
          content:
            'Never mount the host Docker socket (<code>/var/run/docker.sock</code>) inside untrusted user containers, as it gives container processes root access to the host machine.',
          order: 4,
        },
      ],
    });

    // =========================================================================
    // DOMAIN 4: Cybersecurity & Defense
    // =========================================================================
    const secDomain = await Domain.create({
      name: 'Cybersecurity & Systems Defense',
      slug: 'cybersecurity',
      description:
        'Defend infrastructure against modern cyber threats, implement OWASP secure coding standards, and configure network firewalls.',
      icon: 'Shield',
      status: 'published',
      order: 4,
    });

    // Tech 4.1: Network Security
    const netSecTech = await Technology.create({
      domainId: secDomain._id,
      name: 'Network Security & Firewalls',
      slug: 'network-security',
      description:
        'Stateful packet inspection, intrusion prevention systems, zero-trust architectures, and cryptographic transport security.',
      icon: 'Shield',
      status: 'published',
      order: 1,
    });

    // Course 7: Network Defense
    const netSecCourse = await Course.create({
      technologyId: netSecTech._id,
      title: 'Network Defense, Packet Filtering & TLS Security',
      slug: 'network-defense-packet-filtering-tls',
      description:
        'Master Linux firewall engineering, stateful iptables/nftables packet filtering, DDoS mitigation, and TLS 1.3 cryptographic handshakes.',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      difficulty: 'intermediate',
      status: 'published',
      order: 1,
    });

    const netSecMod1 = await Module.create({
      courseId: netSecCourse._id,
      title: '1. Firewall Engineering & Traffic Control',
      description: 'Implementing stateful packet filtering and default-deny policies.',
      order: 1,
    });

    await Lesson.create({
      moduleId: netSecMod1._id,
      title: 'Stateful Packet Filtering & Linux iptables Rules',
      slug: 'stateful-packet-filtering-iptables',
      description:
        'Learn how packet filtering works at Layer 3/Layer 4 of the OSI model and configure hardened firewall policies.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Stateful Packet Inspection (SPI)',
          order: 1,
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
          title: 'Network Security Architecture & Ingress Traffic Inspection',
          alt: 'Network security firewall hardware and perimeter inspection',
          order: 2,
        },
        {
          type: 'text',
          content:
            '<p>Unlike stateless packet filters that evaluate packets in isolation, stateful firewalls track the connection state (NEW, ESTABLISHED, RELATED, INVALID) using kernel connection tracking tables (conntrack).</p>',
          order: 3,
        },
        {
          type: 'code',
          language: 'bash',
          title: 'firewall-hardening.sh',
          content: `#!/bin/bash
# Hardened Linux Firewall Script

# 1. Flush existing rules
iptables -F
iptables -X

# 2. Set Default Policies to DROP (Default Deny)
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 3. Allow loopback traffic
iptables -A INPUT -i lo -j ACCEPT

# 4. Allow Established and Related inbound packets
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# 5. Drop Invalid Packets immediately
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

# 6. Allow HTTPS and Rate-Limited SSH
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP
iptables -A INPUT -p tcp --dport 22 -j ACCEPT`,
          order: 4,
        },
        {
          type: 'note',
          title: 'Principle of Default Deny',
          content:
            'A secure firewall architecture must always drop all incoming traffic by default, explicitly opening only the specific destination ports and IP ranges required for application functionality.',
          order: 5,
        },
      ],
    });

    // Tech 4.2: Application Security
    const appSecTech = await Technology.create({
      domainId: secDomain._id,
      name: 'Application Security (AppSec)',
      slug: 'application-security',
      description:
        'Secure coding practices, vulnerability discovery, authentication hardening, and defense against the OWASP Top 10.',
      icon: 'Shield',
      status: 'published',
      order: 2,
    });

    // Course 8: OWASP Security
    const appSecCourse = await Course.create({
      technologyId: appSecTech._id,
      title: 'Web Application Security & OWASP Top 10 Defense',
      slug: 'web-app-security-owasp-top-10',
      description:
        'Protect web applications from SQL injection, Cross-Site Scripting (XSS), CSRF, broken access control, and credential stuffing.',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
      difficulty: 'advanced',
      status: 'published',
      order: 2,
    });

    const appSecMod1 = await Module.create({
      courseId: appSecCourse._id,
      title: '1. Mitigating Injection & XSS Vulnerabilities',
      description: 'Understanding attack vectors and implementing defense-in-depth sanitization.',
      order: 1,
    });

    await Lesson.create({
      moduleId: appSecMod1._id,
      title: 'SQL Injection Prevention & Parameterized Queries',
      slug: 'sql-injection-prevention-parameterized-queries',
      description:
        'Understand how attackers exploit dynamic string concatenation and implement guaranteed parameterized query defenses.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Preventing SQL Injection with Parameterized Queries',
          order: 1,
        },
        {
          type: 'text',
          content:
            '<p>SQL Injection (SQLi) occurs when untrusted user input is directly concatenated into a SQL statement, allowing attackers to manipulate the database query execution and bypass authentication or dump database contents.</p>',
          order: 2,
        },
        {
          type: 'warning',
          title: 'Vulnerable Code Example',
          content:
            'Never format SQL queries with string interpolation: <code>`SELECT * FROM users WHERE email = \'${userInput}\'`</code>',
          order: 3,
        },
        {
          type: 'code',
          language: 'typescript',
          title: 'secure-queries.ts',
          content: `import { Pool } from "pg";
const pool = new Pool();

// SECURE: Parameterized Query using positional placeholders ($1, $2)
async function authenticateUser(email: string, passwordHash: string) {
  const query = \`
    SELECT id, email, role 
    FROM users 
    WHERE email = $1 AND password_hash = $2
    LIMIT 1;
  \`;
  
  // Database engine compiles query structure BEFORE binding values
  const { rows } = await pool.query(query, [email, passwordHash]);
  return rows[0] || null;
}`,
          order: 4,
        },
        {
          type: 'tip',
          title: 'Defense in Depth',
          content:
            'In addition to parameterized queries, enforce strict database user permissions (least privilege) and deploy Web Application Firewalls (WAF) to detect anomalous payload signatures.',
          order: 5,
        },
      ],
    });

    // =========================================================================
    // DOMAIN 5: Databases & Data Systems
    // =========================================================================
    const dbDomain = await Domain.create({
      name: 'Databases & Data Systems',
      slug: 'databases',
      description:
        'Relational data modeling, SQL indexing strategies, query plan optimization, and document database architectures.',
      icon: 'Database',
      status: 'published',
      order: 5,
    });

    // Tech 5.1: PostgreSQL
    const pgTech = await Technology.create({
      domainId: dbDomain._id,
      name: 'PostgreSQL & SQL',
      slug: 'postgresql',
      description:
        'The advanced open-source object-relational database with strong ACID guarantees, JSONB support, and robust indexing.',
      icon: 'Database',
      status: 'published',
      order: 1,
    });

    // Course 9: PostgreSQL Optimization
    const pgCourse = await Course.create({
      technologyId: pgTech._id,
      title: 'PostgreSQL Design, Indexing & Query Tuning',
      slug: 'postgresql-design-indexing-query-tuning',
      description:
        'Master schema design, B-tree vs GIN indexes, EXPLAIN ANALYZE interpretation, common table expressions (CTEs), and transaction isolation.',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800',
      difficulty: 'intermediate',
      status: 'published',
      order: 1,
    });

    const pgMod1 = await Module.create({
      courseId: pgCourse._id,
      title: '1. Indexing Strategies & Query Planner',
      description: 'Understanding sequential scans vs index scans with EXPLAIN ANALYZE.',
      order: 1,
    });

    await Lesson.create({
      moduleId: pgMod1._id,
      title: 'B-Tree Indexes & EXPLAIN ANALYZE Optimization',
      slug: 'postgresql-indexes-explain-analyze',
      description:
        'Diagnose slow database queries, eliminate full table scans, and build high-performance composite and partial indexes in PostgreSQL.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Diagnosing Query Performance with EXPLAIN ANALYZE',
          order: 1,
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1200',
          title: 'Database Schema Architecture & Relational Index B-Trees',
          alt: 'Relational database schema structure and execution tree',
          order: 2,
        },
        {
          type: 'text',
          content:
            '<p>In PostgreSQL, <code>EXPLAIN ANALYZE</code> executes the SQL query and displays the real execution plan, showing node types (Sequential Scan, Index Scan, Bitmap Heap Scan), actual execution time, and memory usage.</p>',
          order: 3,
        },
        {
          type: 'code',
          language: 'sql',
          title: 'indexes.sql',
          content: `-- 1. Analyze query execution plan
EXPLAIN ANALYZE
SELECT c.id, c.title, COUNT(l.id) AS total_lessons
FROM courses c
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
WHERE c.status = 'published'
GROUP BY c.id, c.title;

-- 2. Create high-efficiency composite index
CREATE INDEX idx_lessons_module_status ON lessons (module_id, status);

-- 3. Partial Index: Index only published rows to save disk and memory!
CREATE INDEX idx_courses_published ON courses (slug) WHERE status = 'published';`,
          order: 4,
        },
        {
          type: 'tip',
          title: 'Partial Indexes Save Memory',
          content:
            'If you frequently filter by a specific status (such as <code>status = \'published\'</code>), a partial index indices only matching rows, keeping the index cache footprint minimal.',
          order: 5,
        },
      ],
    });

    // Tech 5.2: MongoDB
    const mongoTech = await Technology.create({
      domainId: dbDomain._id,
      name: 'MongoDB & NoSQL',
      slug: 'mongodb',
      description:
        'Scalable document database providing flexible JSON schemas, high-throughput writes, and comprehensive aggregation pipelines.',
      icon: 'Database',
      status: 'published',
      order: 2,
    });

    // Course 10: MongoDB Modeling
    const mongoCourse = await Course.create({
      technologyId: mongoTech._id,
      title: 'MongoDB Architecture & Document Data Modeling',
      slug: 'mongodb-architecture-document-modeling',
      description:
        'Design scalable NoSQL schemas: embedding vs referencing patterns, aggregation framework pipelines, and compound index strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
      difficulty: 'beginner',
      status: 'published',
      order: 2,
    });

    const mongoMod1 = await Module.create({
      courseId: mongoCourse._id,
      title: '1. Document Modeling & Aggregation Pipelines',
      description: 'Building multi-stage aggregations with $match, $lookup, and $group.',
      order: 1,
    });

    await Lesson.create({
      moduleId: mongoMod1._id,
      title: 'Aggregation Framework: Pipelines & Analytics',
      slug: 'mongodb-aggregation-pipelines',
      description:
        'Transform, group, and calculate complex real-time metrics across document collections using the MongoDB Aggregation Framework.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Multi-Stage MongoDB Aggregation Pipelines',
          order: 1,
        },
        {
          type: 'text',
          content:
            '<p>The MongoDB Aggregation Framework processes documents through an ordered multi-stage pipeline. Documents pass through stages like <code>$match</code>, <code>$group</code>, <code>$sort</code>, and <code>$project</code> to produce computed summary results.</p>',
          order: 2,
        },
        {
          type: 'code',
          language: 'javascript',
          title: 'aggregation-pipeline.js',
          content: `// Aggregation query: Calculate completion rates per course
db.progress.aggregate([
  // Stage 1: Filter only completed lessons
  { $match: { completed: true } },

  // Stage 2: Join with lessons collection
  {
    $lookup: {
      from: "lessons",
      localField: "lessonId",
      foreignField: "_id",
      as: "lessonDetails",
    },
  },
  { $unwind: "$lessonDetails" },

  // Stage 3: Group by module and count completions
  {
    $group: {
      _id: "$lessonDetails.moduleId",
      totalCompletions: { $sum: 1 },
      uniqueUsers: { $addToSet: "$userId" },
    },
  },

  // Stage 4: Add computed fields
  {
    $project: {
      moduleId: "$_id",
      totalCompletions: 1,
      distinctLearnerCount: { $size: "$uniqueUsers" },
    },
  },

  // Stage 5: Sort by most active modules
  { $sort: { totalCompletions: -1 } },
]);`,
          order: 3,
        },
        {
          type: 'note',
          title: 'Index Utilization in Aggregations',
          content:
            'When placing <code>$match</code> and <code>$sort</code> at the very start of your aggregation pipeline, MongoDB can utilize indexes to filter and sort before memory processing.',
          order: 4,
        },
      ],
    });

    // =========================================================================
    // DOMAIN 6: Artificial Intelligence & Machine Learning
    // =========================================================================
    const aiDomain = await Domain.create({
      name: 'Artificial Intelligence & Machine Learning',
      slug: 'artificial-intelligence',
      description:
        'From foundational statistical machine learning models to deep neural networks and modern Large Language Model architectures.',
      icon: 'Brain',
      status: 'published',
      order: 6,
    });

    // Tech 6.1: Machine Learning
    const mlTech = await Technology.create({
      domainId: aiDomain._id,
      name: 'Machine Learning & Python AI',
      slug: 'machine-learning-python',
      description:
        'Scikit-learn, PyTorch, feature engineering, classification models, cross-validation, and production ML pipelines.',
      icon: 'Brain',
      status: 'published',
      order: 1,
    });

    // Course 11: Machine Learning from Scratch
    const mlCourse = await Course.create({
      technologyId: mlTech._id,
      title: 'Machine Learning from Scratch: Regression to Ensembles',
      slug: 'machine-learning-from-scratch-algorithms',
      description:
        'Hands-on machine learning: gradient descent, linear regression, random forests, hyperparameter tuning, and ROC-AUC evaluation metrics.',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      difficulty: 'advanced',
      status: 'published',
      order: 1,
    });

    const mlMod1 = await Module.create({
      courseId: mlCourse._id,
      title: '1. Supervised Learning & Model Evaluation',
      description: 'Training classifiers and measuring accuracy with precision, recall, and ROC-AUC.',
      order: 1,
    });

    await Lesson.create({
      moduleId: mlMod1._id,
      title: 'Classification, Confusion Matrices & ROC-AUC Evaluation',
      slug: 'ml-classification-confusion-matrices',
      description:
        'Train classification models with scikit-learn, evaluate performance using confusion matrices, and balance precision vs recall.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Model Evaluation Beyond Raw Accuracy',
          order: 1,
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
          title: 'Neural Network Weights & Multidimensional Feature Space',
          alt: 'Visual representation of neural network weights and decision boundaries',
          order: 2,
        },
        {
          type: 'text',
          content:
            '<p>In imbalanced datasets (e.g., fraud detection or medical diagnosis), raw accuracy is misleading. A model predicting 99% negative class might have 99% accuracy while completely failing to detect positives. We must evaluate with <strong>Precision</strong>, <strong>Recall</strong>, <strong>F1-Score</strong>, and <strong>ROC-AUC</strong>.</p>',
          order: 3,
        },
        {
          type: 'code',
          language: 'python',
          title: 'classifier_evaluation.py',
          content: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

# 1. Generate synthetic dataset
X, y = make_classification(n_samples=5000, n_features=20, weights=[0.9, 0.1], random_state=42)

# 2. Split dataset with stratification
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

# 3. Train Random Forest Classifier
clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
clf.fit(X_train, y_train)

# 4. Predict probabilities for ROC-AUC
y_pred = clf.predict(X_test)
y_prob = clf.predict_proba(X_test)[:, 1]

print("=== Confusion Matrix ===")
print(confusion_matrix(y_test, y_pred))

print("\\n=== Detailed Classification Metrics ===")
print(classification_report(y_test, y_pred, target_names=["Benign", "Anomaly"]))

print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.4f}")`,
          order: 4,
        },
        {
          type: 'tip',
          title: 'Precision vs Recall Trade-off',
          content:
            'Increase classification threshold when false positives are expensive (e.g., email spam filter). Decrease threshold when false negatives are critical (e.g., disease detection or security intrusion).',
          order: 5,
        },
      ],
    });

    console.log('====================================================');
    console.log('[Seed] Database seeding completed successfully!');
    console.log('Seeded:');
    console.log('- 6 Complete Domains with Valid Metadata');
    console.log('- 11 Technologies');
    console.log('- 11 Production Courses with Verified Image Thumbnails');
    console.log('- Modules & In-Depth Lessons with High-Res Architecture Diagrams');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
