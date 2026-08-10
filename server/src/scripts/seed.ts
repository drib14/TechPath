import mongoose from 'mongoose';
import { env } from '../config/env';
import { Domain } from '../models/Domain';
import { Technology } from '../models/Technology';
import { Course } from '../models/Course';
import { Module } from '../models/Module';
import { Lesson } from '../models/Lesson';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing existing curriculum data...');
    await Promise.all([
      Domain.deleteMany({}),
      Technology.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Lesson.deleteMany({}),
    ]);
    console.log('Cleared existing data.');

    // 1. Domain: Web Development
    const webDevDomain = await Domain.create({
      name: 'Web Development',
      slug: 'web-development',
      description:
        'Master the full web stack from foundational languages to modern frontend and backend frameworks.',
      icon: 'Globe',
      status: 'published',
      order: 1,
    });

    const jsTech = await Technology.create({
      domainId: webDevDomain._id,
      name: 'JavaScript & TypeScript',
      slug: 'javascript-typescript',
      description:
        'The core programming languages of the modern web, running in browsers, servers, and embedded systems.',
      icon: 'Code2',
      status: 'published',
      order: 1,
    });

    const jsCourse = await Course.create({
      technologyId: jsTech._id,
      title: 'Modern JavaScript Fundamentals',
      slug: 'modern-javascript-fundamentals',
      description:
        'Learn modern ES6+ JavaScript from the ground up, including variables, closures, async programming, and DOM manipulation.',
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
      difficulty: 'beginner',
      status: 'published',
      order: 1,
    });

    const jsModule1 = await Module.create({
      courseId: jsCourse._id,
      title: '1. JavaScript Essentials',
      description: 'Understand core syntax, data types, and functions.',
      order: 1,
    });

    await Lesson.create({
      moduleId: jsModule1._id,
      title: 'Variables, Constants & Data Types',
      slug: 'javascript-variables-data-types',
      description:
        'Learn how to declare variables using let, const, and var, and explore JavaScript primitive and reference types.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Variables, Constants & Data Types in JavaScript',
          order: 1,
        },
        {
          type: 'text',
          content:
            '<p>In JavaScript, variables are containers for storing data values. Modern JavaScript (ES6+) provides three ways to declare variables: <code>const</code>, <code>let</code>, and the legacy <code>var</code>.</p>',
          order: 2,
        },
        {
          type: 'heading',
          level: 2,
          content: 'Declaring Variables with let and const',
          order: 3,
        },
        {
          type: 'code',
          language: 'javascript',
          title: 'variable-declarations.js',
          content: `// Use 'const' by default for values that won't be reassigned
const platformName = "TechPath";
const maxScore = 100;

// Use 'let' when you need to reassign a value later
let currentLesson = 1;
currentLesson = 2; // Valid reassignment

// Data types in JavaScript
const isStudent = true;           // Boolean
const score = 98.5;               // Number
const greeting = "Hello, World!"; // String
const emptyValue = null;          // Null
let notAssigned;                  // Undefined
const uniqueId = Symbol("id");    // Symbol`,
          order: 4,
        },
        {
          type: 'tip',
          title: 'Best Practice',
          content:
            'Always prefer <code>const</code> by default. Only use <code>let</code> when you know the variable value will change over time. Avoid using <code>var</code> in modern code.',
          order: 5,
        },
        {
          type: 'heading',
          level: 2,
          content: 'Reference Types: Objects and Arrays',
          order: 6,
        },
        {
          type: 'text',
          content:
            '<p>Unlike primitive types, reference types (such as objects, arrays, and functions) store references to their memory locations.</p>',
          order: 7,
        },
        {
          type: 'example',
          title: 'Object Mutation with const',
          content:
            'Even when an object is declared with <code>const</code>, its properties can still be modified because the reference remains constant.',
          order: 8,
        },
        {
          type: 'code',
          language: 'javascript',
          title: 'objects.js',
          content: `const user = {
  name: "Alex Rivera",
  role: "Software Engineer",
  enrolledCourses: ["JavaScript", "Cloud Computing"]
};

// Modifying an internal property is allowed
user.role = "Lead Architect";
user.enrolledCourses.push("Cybersecurity");

console.log(user);`,
          order: 9,
        },
        {
          type: 'warning',
          title: 'Avoid Type Coercion Bugs',
          content:
            'JavaScript performs implicit type conversion when using loose equality (<code>==</code>). Always use strict equality (<code>===</code>) to prevent subtle logic errors.',
          order: 10,
        },
      ],
    });

    const jsModule2 = await Module.create({
      courseId: jsCourse._id,
      title: '2. Asynchronous JavaScript',
      description: 'Master Promises, async/await, and non-blocking I/O.',
      order: 2,
    });

    await Lesson.create({
      moduleId: jsModule2._id,
      title: 'Promises & Async/Await',
      slug: 'javascript-promises-async-await',
      description:
        'Master modern asynchronous programming in JavaScript with Promises, async functions, and robust error handling.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Asynchronous JavaScript with Promises & Async/Await',
          order: 1,
        },
        {
          type: 'text',
          content:
            '<p>JavaScript is single-threaded, meaning it executes code sequentially on a single call stack. The event loop and Promises allow long-running operations like API requests or file I/O to run without freezing the user interface.</p>',
          order: 2,
        },
        {
          type: 'code',
          language: 'javascript',
          title: 'async-fetch.js',
          content: `// Modern async/await with try/catch error handling
async function fetchCourseDetails(courseSlug) {
  try {
    const response = await fetch(\`/api/courses/\${courseSlug}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const { data } = await response.json();
    console.log("Course loaded:", data.title);
    return data;
  } catch (error) {
    console.error("Failed to load course details:", error.message);
    throw error;
  }
}`,
          order: 3,
        },
        {
          type: 'note',
          title: 'Event Loop & Microtasks',
          content:
            'Promise resolution callbacks are scheduled as microtasks, which execute immediately after the current synchronous script finishes and before the next rendering frame.',
          order: 4,
        },
      ],
    });

    // 2. Domain: Cloud Computing
    const cloudDomain = await Domain.create({
      name: 'Cloud Computing',
      slug: 'cloud-computing',
      description:
        'Design, build, and deploy resilient, scalable cloud architectures across major cloud providers like AWS, Azure, and Google Cloud.',
      icon: 'Cloud',
      status: 'published',
      order: 2,
    });

    const awsTech = await Technology.create({
      domainId: cloudDomain._id,
      name: 'Amazon Web Services (AWS)',
      slug: 'aws',
      description:
        'The world’s most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services.',
      icon: 'Cloud',
      status: 'published',
      order: 1,
    });

    const awsCourse = await Course.create({
      technologyId: awsTech._id,
      title: 'AWS Cloud Fundamentals & Core Services',
      slug: 'aws-cloud-fundamentals',
      description:
        'Explore core AWS infrastructure, identity management (IAM), compute (EC2, Lambda), storage (S3), and VPC networking.',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      difficulty: 'beginner',
      status: 'published',
      order: 1,
    });

    const awsModule1 = await Module.create({
      courseId: awsCourse._id,
      title: '1. AWS Compute Services',
      description: 'Explore virtual machines, containers, and serverless compute models.',
      order: 1,
    });

    await Lesson.create({
      moduleId: awsModule1._id,
      title: 'Introduction to Amazon EC2 & Virtual Machines',
      slug: 'intro-to-amazon-ec2',
      description:
        'Learn how Amazon Elastic Compute Cloud (EC2) provides resizable, on-demand compute capacity in the cloud.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Introduction to Amazon EC2',
          order: 1,
        },
        {
          type: 'text',
          content:
            '<p><strong>Amazon Elastic Compute Cloud (Amazon EC2)</strong> offers the broadest compute platform with choice of processor, storage, networking, operating system, and purchase model.</p>',
          order: 2,
        },
        {
          type: 'tip',
          title: 'Instance Types',
          content:
            'AWS categorizes EC2 instances by optimization: General Purpose (T4g, M6g), Compute Optimized (C6g), Memory Optimized (R6g), and Storage Optimized (I3en).',
          order: 3,
        },
        {
          type: 'code',
          language: 'bash',
          title: 'aws-cli-ec2-launch.sh',
          content: `# Launch a secure EC2 instance using the AWS CLI
aws ec2 run-instances \\
  --image-id ami-0c55b159cbfafe1f0 \\
  --instance-type t3.micro \\
  --key-name ProductionKeyPair \\
  --security-group-ids sg-0123456789abcdef0 \\
  --subnet-id subnet-0123456789abcdef0 \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=TechPath-Prod-App}]'`,
          order: 4,
        },
      ],
    });

    // 3. Domain: Cybersecurity
    const securityDomain = await Domain.create({
      name: 'Cybersecurity',
      slug: 'cybersecurity',
      description:
        'Protect networks, systems, programs, and data from digital attacks, unauthorized access, and vulnerabilities.',
      icon: 'Shield',
      status: 'published',
      order: 3,
    });

    const netSecTech = await Technology.create({
      domainId: securityDomain._id,
      name: 'Network Security & Defense',
      slug: 'network-security',
      description:
        'Strategies, protocols, and technologies to secure network infrastructure against intrusion and compromise.',
      icon: 'Shield',
      status: 'published',
      order: 1,
    });

    const secCourse = await Course.create({
      technologyId: netSecTech._id,
      title: 'Network Defense & Perimeter Security',
      slug: 'network-defense-perimeter-security',
      description:
        'Understand firewalls, packet inspection, intrusion detection systems (IDS/IPS), and zero-trust perimeter defense.',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      difficulty: 'intermediate',
      status: 'published',
      order: 1,
    });

    const secModule1 = await Module.create({
      courseId: secCourse._id,
      title: '1. Firewall Architecture & Access Control',
      description: 'Stateful vs stateless inspection and access control list (ACL) rules.',
      order: 1,
    });

    await Lesson.create({
      moduleId: secModule1._id,
      title: 'Firewall Rules & Packet Filtering',
      slug: 'firewall-rules-packet-filtering',
      description:
        'Learn how packet filtering rules work, the principle of default deny, and stateful connection tracking.',
      status: 'published',
      order: 1,
      content: [
        {
          type: 'heading',
          level: 1,
          content: 'Firewall Architecture & Packet Filtering',
          order: 1,
        },
        {
          type: 'text',
          content:
            '<p>Firewalls are the first line of defense in network security, inspecting inbound and outbound traffic according to configured security policies.</p>',
          order: 2,
        },
        {
          type: 'code',
          language: 'bash',
          title: 'iptables-defense.sh',
          content: `# Set default policies to DROP (Default Deny Principle)
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow established and related connections
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow loopback interface
iptables -A INPUT -i lo -j ACCEPT

# Allow HTTP and HTTPS traffic
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT`,
          order: 3,
        },
        {
          type: 'warning',
          title: 'Principle of Least Privilege',
          content:
            'Never open broad port ranges to the public internet (0.0.0.0/0). Restrict administrative ports (such as SSH on port 22 or RDP on port 3389) to specific trusted bastion IPs.',
          order: 4,
        },
      ],
    });

    // 4. Domain: Databases
    const dbDomain = await Domain.create({
      name: 'Databases & Data Systems',
      slug: 'databases',
      description:
        'Design efficient schemas, optimize queries, and manage relational (SQL) and non-relational (NoSQL) databases.',
      icon: 'Database',
      status: 'published',
      order: 4,
    });

    const sqlTech = await Technology.create({
      domainId: dbDomain._id,
      name: 'Relational SQL & PostgreSQL',
      slug: 'postgresql',
      description:
        'Powerful open-source object-relational database system with strong reliability, data integrity, and correctness.',
      icon: 'Database',
      status: 'published',
      order: 1,
    });

    await Course.create({
      technologyId: sqlTech._id,
      title: 'PostgreSQL Mastery & Query Optimization',
      slug: 'postgresql-mastery-query-optimization',
      description:
        'Master relational database design, complex joins, subqueries, indexing strategies, and query performance tuning.',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
      difficulty: 'intermediate',
      status: 'published',
      order: 1,
    });

    // 5. Domain: Artificial Intelligence
    const aiDomain = await Domain.create({
      name: 'Artificial Intelligence & Machine Learning',
      slug: 'artificial-intelligence',
      description:
        'Explore machine learning algorithms, deep learning neural networks, natural language processing, and generative AI models.',
      icon: 'Brain',
      status: 'published',
      order: 5,
    });

    const mlTech = await Technology.create({
      domainId: aiDomain._id,
      name: 'Machine Learning with Python',
      slug: 'machine-learning-python',
      description:
        'Build and train predictive models using Python, NumPy, Pandas, Scikit-Learn, and modern AI libraries.',
      icon: 'Brain',
      status: 'published',
      order: 1,
    });

    await Course.create({
      technologyId: mlTech._id,
      title: 'Practical Machine Learning with Python',
      slug: 'practical-machine-learning-python',
      description:
        'Hands-on machine learning from exploratory data analysis and feature engineering to model training, validation, and deployment.',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
      difficulty: 'advanced',
      status: 'published',
      order: 1,
    });

    console.log('✅ Seed completed successfully!');
    console.log('Seeded:');
    console.log('- 5 Domains');
    console.log('- 5 Technologies');
    console.log('- 5 Courses');
    console.log('- Modules & Lessons with rich content blocks');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
