export interface UserProfile {
  id: number;
  username: string;
  email: string;
  displayName: string;
  role: string;
  xp: number;
  level: number;
  avatarUrl?: string | null;
  joinedDate?: string;
  streak?: number;
}

export interface CourseItem {
  id: number | string;
  slug: string;
  title: string;
  category: string;
  progress: number;
  lessons: string;
  tone: 'sky' | 'pink' | 'mint' | 'yellow';
  icon: string;
  difficulty?: string;
  description?: string;
}

export interface QuizQuestionItem {
  id: number;
  questionType:
    | 'MCQ_SINGLE'
    | 'MCQ_MULTI'
    | 'TRUE_FALSE'
    | 'FILL_BLANK'
    | 'MATCH_PAIR'
    | 'ARRANGE_SEQUENCE'
    | 'FLASHCARD'
    | 'CODE_COMPLETION'
    | 'DESCRIPTIVE'
    | string;
  title: string;
  options: { id: number; label: string; text: string; isCorrect?: boolean; matchTarget?: string }[];
  correctAnswer?: string;
  /** For MCQ_MULTI: list of correct option texts */
  correctAnswers?: string[];
  /** For ARRANGE_SEQUENCE: correct order of option texts */
  correctSequence?: string[];
  /** For FLASHCARD / DESCRIPTIVE: the answer to reveal */
  answerText?: string;
  /** Optional code snippet to display */
  codeSnippet?: string;
  codeLanguage?: string;
  explanation: string;
  hint?: string;
  xpReward: number;
  evaluationMode?: 'OBJECTIVE' | 'SUBJECTIVE';
  timeLimitSeconds?: number;
}

export const defaultMockUser: UserProfile = {
  id: 1,
  username: 'alex_m',
  email: 'alex.morgan@learnforge.com',
  displayName: 'Alex Morgan',
  role: 'STUDENT',
  xp: 1240,
  level: 4,
  avatarUrl: null,
  joinedDate: 'September 2025',
  streak: 7,
};

export const mockCourses: CourseItem[] = [
  {
    id: 1,
    slug: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    category: 'Development',
    progress: 72,
    lessons: '18 of 25 lessons',
    tone: 'sky',
    icon: 'JS',
    difficulty: 'BEGINNER',
    description: 'Master JavaScript fundamentals — syntax, scope, closures, arrays, and asynchronous patterns.',
  },
  {
    id: 2,
    slug: 'core-java',
    title: 'Core Java & OOP',
    category: 'Development',
    progress: 60,
    lessons: '12 of 20 lessons',
    tone: 'mint',
    icon: 'JAVA',
    difficulty: 'BEGINNER',
    description: 'Master Java fundamentals — syntax, OOP, collections, exceptions, and memory mechanics.',
  },
  {
    id: 3,
    slug: 'spring-boot',
    title: 'Spring Boot Mastery',
    category: 'Development',
    progress: 45,
    lessons: '9 of 18 lessons',
    tone: 'sky',
    icon: 'SB',
    difficulty: 'INTERMEDIATE',
    description: 'Build enterprise-grade microservices and robust REST APIs with Spring Boot and Spring Data JPA.',
  },
  {
    id: 4,
    slug: 'sql-database-design',
    title: 'SQL & Database Design',
    category: 'Data',
    progress: 30,
    lessons: '6 of 15 lessons',
    tone: 'yellow',
    icon: 'SQL',
    difficulty: 'BEGINNER',
    description: 'Write performant relational queries, optimize indexes, and understand ACID transactions.',
  },
  {
    id: 5,
    slug: 'ui-ux-design-basics',
    title: 'UI/UX Design Basics',
    category: 'Design',
    progress: 38,
    lessons: '7 of 18 lessons',
    tone: 'pink',
    icon: 'UX',
    difficulty: 'BEGINNER',
    description: 'Learn visual hierarchy, wireframing, color theory, and user experience psychology.',
  },
  {
    id: 6,
    slug: 'product-strategy',
    title: 'Product Strategy',
    category: 'Business',
    progress: 12,
    lessons: '2 of 16 lessons',
    tone: 'mint',
    icon: 'PS',
    difficulty: 'ADVANCED',
    description: 'Align business KPIs, write user stories, and ship roadmaps that delight customers.',
  },
  {
    id: 7,
    slug: 'public-speaking',
    title: 'Public Speaking',
    category: 'Personal growth',
    progress: 0,
    lessons: '0 of 14 lessons',
    tone: 'yellow',
    icon: 'PS',
    difficulty: 'BEGINNER',
    description: 'Master body language, voice pacing, and storytelling for technical and leadership talks.',
  },
];

export const mockActivities = [
  ['Completed', 'Arrays & Loops', 'JavaScript Fundamentals', '10 min ago', 'sky'],
  ['Earned', 'Quick Learner badge', 'You are on fire!', 'Yesterday', 'pink'],
  ['Completed', 'Design Principles', 'UI/UX Design Basics', '2 days ago', 'mint'],
  ['Completed', 'Classes & Objects', 'Core Java & OOP', '3 days ago', 'sky'],
];

export const mockWeeklyActivity = ['35%', '55%', '42%', '72%', '68%', '88%', '64%'];

export const mockDashboardStats = {
  streak: 7,
  longestStreak: 14,
  xp: 1240,
  level: 4,
  accuracyPct: 68,
  totalAnswered: 125,
  correctAnswered: 85,
  badgeCount: 12,
  dueReviewsCount: 3,
  weeklyGoal: {
    completedDays: 4,
    targetDays: 5,
    percentage: 80,
  },
};

export const mockBadges = [
  { id: 1, title: 'On fire', icon: 'Flame', label: 'On fire', color: 'pink' },
  { id: 2, title: 'Quick learner', icon: 'Zap', label: 'Quick learner', color: 'mint' },
  { id: 3, title: 'Focused', icon: 'Target', label: 'Focused', color: 'sky' },
];

export const mockSkillBreakdown = [
  ['Development', 72],
  ['Design', 38],
  ['Business', 12],
] as const;

export const mockQuizQuestions: QuizQuestionItem[] = [
  /* ── MCQ_SINGLE ── */
  {
    id: 101,
    questionType: 'MCQ_SINGLE',
    title: 'What is an array used for in JavaScript?',
    options: [
      { id: 1, label: 'A', text: 'A collection of values stored in a single variable', isCorrect: true },
      { id: 2, label: 'B', text: 'A function that repeats forever', isCorrect: false },
      { id: 3, label: 'C', text: 'A type of CSS selector', isCorrect: false },
      { id: 4, label: 'D', text: 'A browser window', isCorrect: false },
    ],
    correctAnswer: 'A collection of values stored in a single variable',
    explanation: 'An array is an ordered list of values referenced by an index, stored in a single variable.',
    hint: 'Think about grouping multiple related elements together.',
    xpReward: 20,
  },
  {
    id: 102,
    questionType: 'MCQ_SINGLE',
    title: 'Which keyword defines a block-scoped variable that cannot be reassigned?',
    options: [
      { id: 5, label: 'A', text: 'var', isCorrect: false },
      { id: 6, label: 'B', text: 'let', isCorrect: false },
      { id: 7, label: 'C', text: 'const', isCorrect: true },
      { id: 8, label: 'D', text: 'static', isCorrect: false },
    ],
    correctAnswer: 'const',
    explanation: "'const' creates an immutable reference to a value and adheres to block scoping.",
    hint: 'Short for constant.',
    xpReward: 20,
  },
  {
    id: 103,
    questionType: 'MCQ_SINGLE',
    title: 'Which keyword creates a new object instance in Java and allocates memory?',
    options: [
      { id: 9, label: 'A', text: 'create', isCorrect: false },
      { id: 10, label: 'B', text: 'new', isCorrect: true },
      { id: 11, label: 'C', text: 'malloc', isCorrect: false },
      { id: 12, label: 'D', text: 'instance', isCorrect: false },
    ],
    correctAnswer: 'new',
    explanation: "The 'new' operator instantiates a class by allocating memory for a new object and invoking its constructor.",
    hint: 'Common OOP keyword for creating instances.',
    xpReward: 20,
  },
  {
    id: 104,
    questionType: 'MCQ_SINGLE',
    title: 'In SQL, which clause filters rows before any groupings are applied?',
    options: [
      { id: 13, label: 'A', text: 'ORDER BY', isCorrect: false },
      { id: 14, label: 'B', text: 'GROUP BY', isCorrect: false },
      { id: 15, label: 'C', text: 'WHERE', isCorrect: true },
      { id: 16, label: 'D', text: 'HAVING', isCorrect: false },
    ],
    correctAnswer: 'WHERE',
    explanation: "'WHERE' filters individual records prior to grouping, while 'HAVING' filters aggregated groups.",
    hint: 'Begins with W.',
    xpReward: 20,
  },
  {
    id: 105,
    questionType: 'MCQ_SINGLE',
    title: 'Which HTTP method is idempotent and intended to replace an existing resource completely?',
    options: [
      { id: 17, label: 'A', text: 'POST', isCorrect: false },
      { id: 18, label: 'B', text: 'PUT', isCorrect: true },
      { id: 19, label: 'C', text: 'PATCH', isCorrect: false },
      { id: 20, label: 'D', text: 'CONNECT', isCorrect: false },
    ],
    correctAnswer: 'PUT',
    explanation: 'PUT replaces all current representations of the target resource with the uploaded content and is idempotent.',
    hint: '3-letter HTTP verb for complete replacement.',
    xpReward: 20,
  },

  /* ── MCQ_MULTI ── */
  {
    id: 201,
    questionType: 'MCQ_MULTI',
    title: 'Which of the following are valid Java access modifiers? (Select all that apply)',
    options: [
      { id: 21, label: 'A', text: 'public', isCorrect: true },
      { id: 22, label: 'B', text: 'private', isCorrect: true },
      { id: 23, label: 'C', text: 'hidden', isCorrect: false },
      { id: 24, label: 'D', text: 'protected', isCorrect: true },
      { id: 25, label: 'E', text: 'internal', isCorrect: false },
    ],
    correctAnswers: ['public', 'private', 'protected'],
    explanation: "Java has four access levels: public, protected, (package-private / default), and private. 'hidden' and 'internal' do not exist in Java.",
    hint: 'There are exactly 3 named modifiers (the 4th is the default with no keyword).',
    xpReward: 25,
  },

  /* ── TRUE_FALSE ── */
  {
    id: 301,
    questionType: 'TRUE_FALSE',
    title: 'In Java, a static method can directly access instance variables of the class.',
    options: [
      { id: 30, label: 'True', text: 'True', isCorrect: false },
      { id: 31, label: 'False', text: 'False', isCorrect: true },
    ],
    correctAnswer: 'False',
    explanation: 'Static methods belong to the class itself and run without an instance, so they cannot access instance (non-static) variables directly.',
    xpReward: 15,
  },
  {
    id: 302,
    questionType: 'TRUE_FALSE',
    title: 'HTTP is a stateless protocol — each request is independent and carries no memory of previous requests.',
    options: [
      { id: 32, label: 'True', text: 'True', isCorrect: true },
      { id: 33, label: 'False', text: 'False', isCorrect: false },
    ],
    correctAnswer: 'True',
    explanation: 'HTTP is inherently stateless. Cookies, sessions, and tokens are mechanisms layered on top to simulate state.',
    xpReward: 15,
  },

  /* ── FILL_BLANK ── */
  {
    id: 401,
    questionType: 'FILL_BLANK',
    title: 'The SQL keyword used to retrieve distinct (unique) values from a column is ___.',
    options: [],
    correctAnswer: 'DISTINCT',
    explanation: "SELECT DISTINCT eliminates duplicate rows from the result set. e.g. SELECT DISTINCT country FROM customers;",
    hint: 'It goes between SELECT and the column name.',
    xpReward: 20,
  },
  {
    id: 402,
    questionType: 'FILL_BLANK',
    title: 'In Java, the ___ keyword is used to inherit from a parent class.',
    options: [],
    correctAnswer: 'extends',
    explanation: "'extends' establishes an IS-A relationship, allowing the child class to inherit fields and methods from the parent.",
    hint: 'You write: class Dog ___ Animal',
    xpReward: 20,
  },

  /* ── MATCH_PAIR ── */
  {
    id: 501,
    questionType: 'MATCH_PAIR',
    title: 'Match each HTTP method to its primary purpose.',
    options: [
      { id: 50, label: 'GET',    text: 'GET',    isCorrect: true, matchTarget: 'Retrieve a resource' },
      { id: 51, label: 'POST',   text: 'POST',   isCorrect: true, matchTarget: 'Create a new resource' },
      { id: 52, label: 'PUT',    text: 'PUT',    isCorrect: true, matchTarget: 'Replace a resource completely' },
      { id: 53, label: 'DELETE', text: 'DELETE', isCorrect: true, matchTarget: 'Remove a resource' },
    ],
    explanation: 'REST semantics: GET=read, POST=create, PUT=replace, DELETE=remove. PATCH is for partial updates.',
    xpReward: 30,
  },

  /* ── ARRANGE_SEQUENCE ── */
  {
    id: 601,
    questionType: 'ARRANGE_SEQUENCE',
    title: 'Arrange the steps of a typical Spring Boot request-response lifecycle in the correct order.',
    options: [
      { id: 60, label: '1', text: 'Client sends HTTP request', isCorrect: true },
      { id: 61, label: '2', text: 'DispatcherServlet routes to Controller', isCorrect: true },
      { id: 62, label: '3', text: 'Controller calls Service layer', isCorrect: true },
      { id: 63, label: '4', text: 'Service calls Repository/Database', isCorrect: true },
      { id: 64, label: '5', text: 'Response returned to Client', isCorrect: true },
    ],
    correctSequence: [
      'Client sends HTTP request',
      'DispatcherServlet routes to Controller',
      'Controller calls Service layer',
      'Service calls Repository/Database',
      'Response returned to Client',
    ],
    explanation: 'Spring MVC processes requests through DispatcherServlet → Controller → Service → Repository → back up the chain.',
    xpReward: 30,
  },

  /* ── FLASHCARD ── */
  {
    id: 701,
    questionType: 'FLASHCARD',
    title: 'What is the difference between == and .equals() in Java?',
    options: [],
    answerText: '== compares object references (memory addresses), while .equals() compares the actual content/state of objects. For Strings, always use .equals() to compare values.',
    explanation: 'Using == on Strings compares whether they point to the exact same object in memory, which can cause bugs. Always use .equals() for value comparison.',
    xpReward: 15,
    evaluationMode: 'SUBJECTIVE',
  },

  /* ── CODE_COMPLETION ── */
  {
    id: 801,
    questionType: 'CODE_COMPLETION',
    title: 'Complete the Java method to return the factorial of n recursively.',
    codeSnippet: `public static int factorial(int n) {
    if (n <= 1) return 1;
    return ____;
}`,
    codeLanguage: 'java',
    options: [],
    correctAnswer: 'n * factorial(n - 1)',
    explanation: 'The recursive case multiplies n by the factorial of (n-1). The base case returns 1 when n ≤ 1.',
    hint: 'Think: n × factorial of (n minus 1)',
    xpReward: 30,
  },

  /* ── DESCRIPTIVE ── */
  {
    id: 901,
    questionType: 'DESCRIPTIVE',
    title: 'Explain the SOLID principles and why they matter in software design.',
    options: [],
    explanation: 'SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. They guide maintainable, extensible, testable code.',
    xpReward: 40,
    evaluationMode: 'SUBJECTIVE',
  },
];
