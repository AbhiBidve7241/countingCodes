import { QuizQuestionItem } from './mockData';

export interface ParsedQuestionResult {
  valid: boolean;
  item?: QuizQuestionItem;
  raw: any;
  error?: string;
  detectedType: string;
}

export interface SqlGenerationResult {
  sql: string;
  questionCount: number;
  optionCount: number;
}

/**
 * Clean & tolerant JSON parser (handles leading/trailing noise, unescaped newlines)
 */
export function safeParseJson(input: string): { data: any; error?: string } {
  if (!input || !input.trim()) {
    return { data: null, error: 'Empty JSON input' };
  }

  let cleaned = input.trim();

  // Strip Markdown code fences if user copied from AI chat (```json ... ```)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '').trim();
  }

  try {
    const parsed = JSON.parse(cleaned);
    return { data: parsed };
  } catch (err: any) {
    // Attempt minor recovery for trailing commas
    try {
      const relaxed = cleaned.replace(/,\s*([\]}])/g, '$1');
      const parsed = JSON.parse(relaxed);
      return { data: parsed };
    } catch (e2: any) {
      return { data: null, error: err.message || 'Invalid JSON syntax' };
    }
  }
}

/**
 * Automatically detects the canonical question type from key-value pairs
 */
export function detectQuestionType(raw: any): string {
  if (!raw || typeof raw !== 'object') return 'MCQ_SINGLE';

  const typeKey = raw.type || raw.question_type || raw.questionType;
  if (typeKey && typeof typeKey === 'string') {
    const norm = typeKey.trim().toUpperCase().replace(/[-\s]/g, '_');
    if (['MCQ', 'SINGLE_CHOICE', 'MCQ_SINGLE', 'SINGLE'].includes(norm)) return 'MCQ_SINGLE';
    if (['MULTI_CHOICE', 'MCQ_MULTI', 'MULTIPLE_CHOICE', 'MULTI'].includes(norm)) return 'MCQ_MULTI';
    if (['FILL_IN_THE_BLANK', 'FILL_BLANK', 'FILL_IN_BLANK', 'BLANK'].includes(norm)) return 'FILL_BLANK';
    if (['TRUE_FALSE', 'BOOLEAN', 'TF'].includes(norm)) return 'TRUE_FALSE';
    if (['MATCH_PAIR', 'MATCH_PAIRS', 'MATCHING', 'MATCH'].includes(norm)) return 'MATCH_PAIR';
    if (['COMPLETE_CODE', 'CODE_COMPLETION', 'CODE'].includes(norm)) return 'CODE_COMPLETION';
    if (['SEQUENCE', 'ARRANGE_SEQUENCE', 'ORDER', 'ORDERING'].includes(norm)) return 'ARRANGE_SEQUENCE';
    if (['FLASHCARD', 'FLASH_CARD'].includes(norm)) return 'FLASHCARD';
    if (['EXPLAIN_CONCEPT', 'DESCRIPTIVE', 'CONCEPTUAL'].includes(norm)) return 'DESCRIPTIVE';
    return norm;
  }

  // Structural heuristics if type key is missing
  if (raw.pairs || raw.pair_items || raw.match_pairs) {
    return 'MATCH_PAIR';
  }
  if (raw.sequence_items || raw.sequence || raw.correct_sequence || raw.items_in_order) {
    return 'ARRANGE_SEQUENCE';
  }
  if (raw.acceptable_answers || raw.accepted_answers || raw.blank_answer) {
    return 'FILL_BLANK';
  }
  if (raw.correct_boolean !== undefined || (raw.metadata && raw.metadata.correct_value !== undefined)) {
    return 'TRUE_FALSE';
  }
  if (raw.expected_tokens || (raw.code_snippet && raw.code_snippet.includes('______'))) {
    return 'CODE_COMPLETION';
  }
  if (Array.isArray(raw.options)) {
    const correctOpts = raw.options.filter((o: any) => o.correct || o.is_correct || o.isCorrect);
    if (correctOpts.length > 1) return 'MCQ_MULTI';
    return 'MCQ_SINGLE';
  }
  if (raw.answerText || (raw.explanation && !raw.options)) {
    return 'FLASHCARD';
  }

  return 'MCQ_SINGLE';
}

/**
 * Normalizes any external question object into the LearnForge QuizQuestionItem format
 */
export function normalizeToQuizQuestion(raw: any, index: number, baseId = 1000): ParsedQuestionResult {
  try {
    const qType = detectQuestionType(raw);
    const title = raw.title || raw.question || raw.prompt || `Question ${index + 1}`;
    const explanation = raw.explanation || raw.answer_explanation || 'No explanation provided.';
    const hint = raw.hint || raw.hint_text || raw.hintText || undefined;
    const codeSnippet = raw.code_snippet || raw.codeSnippet || undefined;
    const xpReward = Number(raw.xp_reward || raw.xpReward || raw.xp || 10);
    const qId = Number(raw.id && !isNaN(Number(raw.id)) ? raw.id : baseId + index);

    let options: QuizQuestionItem['options'] = [];
    let correctAnswer: string | undefined = undefined;
    let correctAnswers: string[] | undefined = undefined;
    let correctSequence: string[] | undefined = undefined;
    let answerText: string | undefined = undefined;

    // Type-specific extraction
    switch (qType) {
      case 'TRUE_FALSE': {
        const correctVal =
          raw.correct_boolean !== undefined
            ? Boolean(raw.correct_boolean)
            : raw.metadata?.correct_value !== undefined
            ? Boolean(raw.metadata.correct_value)
            : raw.answer !== undefined
            ? String(raw.answer).toLowerCase() === 'true'
            : true;

        options = [
          { id: 1, label: 'True', text: 'True', isCorrect: correctVal },
          { id: 2, label: 'False', text: 'False', isCorrect: !correctVal },
        ];
        correctAnswer = correctVal ? 'True' : 'False';
        break;
      }

      case 'FILL_BLANK': {
        const accepted =
          raw.acceptable_answers ||
          raw.accepted_answers ||
          raw.metadata?.accepted_answers ||
          (raw.answer ? [raw.answer] : ['correct answer']);
        const answersList = Array.isArray(accepted) ? accepted.map(String) : [String(accepted)];
        correctAnswers = answersList;
        correctAnswer = answersList[0];
        answerText = answersList[0];
        options = answersList.map((ans, i) => ({
          id: i + 1,
          label: ans,
          text: ans,
          isCorrect: true,
        }));
        break;
      }

      case 'MATCH_PAIR': {
        const pairObj = raw.pairs || raw.pair_items || raw.match_pairs || {};
        let idx = 1;
        if (Array.isArray(pairObj)) {
          options = pairObj.map((p: any) => ({
            id: idx++,
            label: String(p.key || p.pair_key || p.left || ''),
            text: String(p.key || p.pair_key || p.left || ''),
            matchTarget: String(p.value || p.pair_value || p.right || ''),
            isCorrect: true,
          }));
        } else if (typeof pairObj === 'object' && pairObj !== null) {
          options = Object.entries(pairObj).map(([key, val]) => ({
            id: idx++,
            label: key,
            text: key,
            matchTarget: String(val),
            isCorrect: true,
          }));
        }
        break;
      }

      case 'ARRANGE_SEQUENCE':
      case 'SEQUENCE': {
        const seqItems =
          raw.sequence_items ||
          raw.sequence ||
          raw.correct_sequence ||
          (Array.isArray(raw.options) ? raw.options.map((o: any) => (typeof o === 'string' ? o : o.text)) : []);

        const strList = Array.isArray(seqItems)
          ? seqItems.map((item: any) => (typeof item === 'string' ? item : item.text || String(item)))
          : [];

        correctSequence = [...strList];
        options = strList.map((text, i) => ({
          id: i + 1,
          label: text,
          text: text,
          isCorrect: true,
        }));
        break;
      }

      case 'CODE_COMPLETION':
      case 'COMPLETE_CODE': {
        const tokens =
          raw.expected_tokens ||
          raw.tokens ||
          raw.metadata?.expected_tokens ||
          (raw.answer ? [raw.answer] : ['code']);
        const tokenList = Array.isArray(tokens) ? tokens.map(String) : [String(tokens)];
        correctAnswers = tokenList;
        correctAnswer = tokenList[0];
        answerText = tokenList[0];
        options = tokenList.map((t, i) => ({
          id: i + 1,
          label: t,
          text: t,
          isCorrect: true,
        }));
        break;
      }

      case 'FLASHCARD':
      case 'DESCRIPTIVE': {
        answerText = raw.answerText || raw.answer || raw.model_answer || explanation;
        break;
      }

      case 'MCQ_MULTI': {
        if (Array.isArray(raw.options)) {
          options = raw.options.map((opt: any, i: number) => {
            const text = typeof opt === 'string' ? opt : opt.text || opt.option_text || opt.label || `Option ${i + 1}`;
            const isCor = typeof opt === 'object' ? Boolean(opt.correct || opt.is_correct || opt.isCorrect) : false;
            return {
              id: i + 1,
              label: text,
              text: text,
              isCorrect: isCor,
            };
          });
          correctAnswers = options.filter((o) => o.isCorrect).map((o) => o.text);
        }
        break;
      }

      case 'MCQ_SINGLE':
      default: {
        if (Array.isArray(raw.options)) {
          options = raw.options.map((opt: any, i: number) => {
            const text = typeof opt === 'string' ? opt : opt.text || opt.option_text || opt.label || `Option ${i + 1}`;
            const isCor = typeof opt === 'object' ? Boolean(opt.correct || opt.is_correct || opt.isCorrect) : false;
            return {
              id: i + 1,
              label: text,
              text: text,
              isCorrect: isCor,
            };
          });
          const correctOpt = options.find((o) => o.isCorrect);
          if (correctOpt) {
            correctAnswer = correctOpt.text;
          } else if (raw.answer) {
            correctAnswer = String(raw.answer);
          }
        }
        break;
      }
    }

    const item: QuizQuestionItem = {
      id: qId,
      questionType: qType,
      title,
      options,
      correctAnswer,
      correctAnswers,
      correctSequence,
      answerText,
      codeSnippet,
      explanation,
      hint,
      xpReward,
      evaluationMode: ['FLASHCARD'].includes(qType)
        ? 'SUBJECTIVE'
        : ['DESCRIPTIVE', 'EXPLAIN_CONCEPT'].includes(qType)
        ? 'SUBJECTIVE'
        : 'OBJECTIVE',
      timeLimitSeconds: raw.time_limit_seconds || 45,
    };

    return {
      valid: true,
      item,
      raw,
      detectedType: qType,
    };
  } catch (err: any) {
    return {
      valid: false,
      raw,
      error: err.message || 'Normalization failed',
      detectedType: 'UNKNOWN',
    };
  }
}

/**
 * Parses batch input from string, detecting arrays vs objects vs wrappers
 */
export function parseQuestionBatch(input: string): { items: QuizQuestionItem[]; results: ParsedQuestionResult[]; error?: string } {
  const { data, error } = safeParseJson(input);
  if (error || !data) {
    return { items: [], results: [], error };
  }

  let rawList: any[] = [];
  if (Array.isArray(data)) {
    rawList = data;
  } else if (typeof data === 'object') {
    if (Array.isArray(data.questions)) {
      rawList = data.questions;
    } else if (Array.isArray(data.data)) {
      rawList = data.data;
    } else if (Array.isArray(data.items)) {
      rawList = data.items;
    } else {
      rawList = [data];
    }
  }

  const results: ParsedQuestionResult[] = [];
  const items: QuizQuestionItem[] = [];

  rawList.forEach((raw, idx) => {
    const res = normalizeToQuizQuestion(raw, idx, Date.now() + idx);
    results.push(res);
    if (res.valid && res.item) {
      items.push(res.item);
    }
  });

  return { items, results };
}

/**
 * Generates ready-to-run MySQL/Postgres SQL statements for the parsed questions
 */
export function generateSqlStatements(parsedItems: ParsedQuestionResult[], defaultTopicId = 1): SqlGenerationResult {
  const escapeSql = (str: string | null | undefined): string => {
    if (str === null || str === undefined) return 'NULL';
    return "'" + str.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
  };

  const escapeJson = (obj: any): string => {
    if (!obj) return 'NULL';
    const json = typeof obj === 'string' ? obj : JSON.stringify(obj);
    return escapeSql(json);
  };

  const questionSqls: string[] = [];
  const optionSqls: string[] = [];
  let totalOptions = 0;

  parsedItems.forEach((res, qIndex) => {
    if (!res.valid || !res.item) return;
    const q = res.item;
    const raw = res.raw;

    // Map frontend type to DB question_type
    let dbType = q.questionType;
    if (dbType === 'ARRANGE_SEQUENCE') dbType = 'SEQUENCE';
    if (dbType === 'CODE_COMPLETION') dbType = 'COMPLETE_CODE';
    if (dbType === 'DESCRIPTIVE') dbType = 'EXPLAIN_CONCEPT';

    // Metadata JSON
    let metadata: any = null;
    if (q.questionType === 'FILL_BLANK') {
      metadata = { accepted_answers: q.correctAnswers || [q.correctAnswer] };
    } else if (q.questionType === 'TRUE_FALSE') {
      metadata = { correct_value: q.correctAnswer === 'True' };
    } else if (q.questionType === 'CODE_COMPLETION' || q.questionType === 'COMPLETE_CODE') {
      metadata = { expected_tokens: q.correctAnswers || [q.correctAnswer] };
    } else if (raw.metadata) {
      metadata = raw.metadata;
    }

    const topicId = Number(raw.topic_id || raw.topicId || defaultTopicId);
    const difficulty = (raw.difficulty || 'MEDIUM').toString().toUpperCase();
    const normalizedDifficulty = ['EASY', 'HARD'].includes(difficulty) ? difficulty : 'MEDIUM';
    const xpReward = q.xpReward || 10;
    const hintPenalty = 5;
    const evalMode = q.evaluationMode === 'SUBJECTIVE' ? 'SUBJECTIVE' : 'OBJECTIVE';

    // 1. Insert into questions table
    questionSqls.push(
      `-- Question #${qIndex + 1}: ${q.title.slice(0, 40).replace(/\n/g, ' ')}...\n` +
      `INSERT INTO questions (\n` +
      `    topic_id, question_type, evaluation_mode, title, description,\n` +
      `    code_snippet, explanation, hint_text, difficulty, xp_reward,\n` +
      `    hint_penalty, is_important, is_interview, is_frequently_asked,\n` +
      `    tags, metadata, source_ref, created_at, updated_at\n` +
      `) VALUES (\n` +
      `    ${topicId}, ${escapeSql(dbType)}, ${escapeSql(evalMode)}, ${escapeSql(q.title)}, ${escapeSql(raw.description || null)},\n` +
      `    ${escapeSql(q.codeSnippet || null)}, ${escapeSql(q.explanation || null)}, ${escapeSql(q.hint || null)}, ${escapeSql(normalizedDifficulty)}, ${xpReward},\n` +
      `    ${hintPenalty}, ${raw.is_important ? 'TRUE' : 'FALSE'}, ${raw.is_interview ? 'TRUE' : 'FALSE'}, ${raw.is_frequently_asked ? 'TRUE' : 'FALSE'},\n` +
      `    ${escapeJson(raw.tags || null)}, ${escapeJson(metadata)}, ${escapeSql('ADMIN_PANEL_INSERT')}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP\n` +
      `);`
    );

    // 2. Insert into question_options table using LAST_INSERT_ID()
    if (q.options && q.options.length > 0) {
      const optInserts = q.options.map((opt, optIndex) => {
        totalOptions++;
        const isCor = Boolean(opt.isCorrect);
        const pairKey = opt.label && opt.matchTarget ? escapeSql(opt.label) : 'NULL';
        const pairVal = opt.matchTarget ? escapeSql(opt.matchTarget) : 'NULL';
        return `(LAST_INSERT_ID(), ${escapeSql(opt.text)}, ${isCor ? 'TRUE' : 'FALSE'}, ${optIndex}, ${pairKey}, ${pairVal})`;
      });

      optionSqls.push(
        `INSERT INTO question_options (question_id, option_text, is_correct, order_index, pair_key, pair_value)\nVALUES\n  ` +
        optInserts.join(',\n  ') +
        `;\n`
      );
    }
  });

  const fullSql =
    `-- =========================================================================\n` +
    `-- LearnForge Question Importer - Generated SQL\n` +
    `-- Total Questions: ${parsedItems.filter((p) => p.valid).length} | Total Options: ${totalOptions}\n` +
    `-- Timestamp: ${new Date().toISOString()}\n` +
    `-- =========================================================================\n\n` +
    `START TRANSACTION;\n\n` +
    questionSqls
      .map((qSql, i) => {
        const oSql = optionSqls[i] ? `\n${optionSqls[i]}` : '';
        return `${qSql}${oSql}`;
      })
      .join('\n') +
    `\nCOMMIT;\n`;

  return {
    sql: fullSql,
    questionCount: parsedItems.filter((p) => p.valid).length,
    optionCount: totalOptions,
  };
}

/**
 * Pre-configured Sample Templates for quick testing
 */
export const SAMPLE_TEMPLATES = {
  mixedBatch: [
    {
      type: "MCQ_SINGLE",
      title: "Which keyword is used to inherit a class in Java?",
      options: [
        { text: "implements", correct: false },
        { text: "extends", correct: true },
        { text: "inherits", correct: false },
        { text: "super", correct: false }
      ],
      explanation: "In Java, the 'extends' keyword is used to inherit from a parent class.",
      hint: "Think about widening or extending a class.",
      difficulty: "EASY",
      xp_reward: 10
    },
    {
      type: "TRUE_FALSE",
      title: "Java interfaces can have default implementations of methods starting from Java 8.",
      correct_boolean: true,
      explanation: "Starting in Java 8, interfaces can contain default and static method implementations.",
      difficulty: "EASY",
      xp_reward: 10
    },
    {
      type: "FILL_BLANK",
      title: "The ______ annotation is used in Spring Boot to mark a class as a RESTful web controller.",
      acceptable_answers: ["@RestController", "RestController"],
      explanation: "@RestController is a convenience annotation combining @Controller and @ResponseBody.",
      difficulty: "MEDIUM",
      xp_reward: 15
    },
    {
      type: "MATCH_PAIR",
      title: "Match each Java Collection with its internal data structure:",
      pairs: {
        "ArrayList": "Dynamic resizable array",
        "LinkedList": "Doubly linked list nodes",
        "HashSet": "Hash table backed by HashMap",
        "TreeMap": "Red-Black balanced tree"
      },
      explanation: "ArrayList uses arrays, LinkedList nodes, HashSet hashes keys, and TreeMap maintains a sorted red-black tree.",
      difficulty: "MEDIUM",
      xp_reward: 20
    },
    {
      type: "ARRANGE_SEQUENCE",
      title: "Order the stages of a Thread life cycle from creation to termination:",
      sequence_items: [
        "NEW",
        "RUNNABLE",
        "BLOCKED / WAITING",
        "TIMED_WAITING",
        "TERMINATED"
      ],
      explanation: "Java threads move from NEW to RUNNABLE, can wait, and finally reach TERMINATED.",
      difficulty: "HARD",
      xp_reward: 25
    },
    {
      type: "COMPLETE_CODE",
      title: "Complete the lambda expression to filter even numbers: list.stream().filter(n -> ______)",
      code_snippet: "List<Integer> evens = list.stream()\n    .filter(n -> ______)\n    .toList();",
      expected_tokens: ["n % 2 == 0", "n % 2 === 0"],
      explanation: "n % 2 == 0 tests if the remainder when dividing by 2 is zero.",
      difficulty: "MEDIUM",
      xp_reward: 15
    },
    {
      type: "FLASHCARD",
      title: "What is the difference between Synchronous and Asynchronous execution?",
      explanation: "Synchronous operations block the caller until completion. Asynchronous operations execute concurrently without blocking the calling thread, notifying via callbacks/promises/futures.",
      difficulty: "EASY",
      xp_reward: 10
    }
  ],

  aiPromptTemplate: `You are a test generator for LearnForge. Output ONLY a valid JSON array of questions adhering to this structure:

[
  {
    "type": "MCQ_SINGLE",
    "title": "Your question here?",
    "options": [
      { "text": "Option A", "correct": false },
      { "text": "Option B", "correct": true },
      { "text": "Option C", "correct": false },
      { "text": "Option D", "correct": false }
    ],
    "explanation": "Why B is correct.",
    "hint": "Helpful tip",
    "difficulty": "EASY"
  },
  {
    "type": "FILL_BLANK",
    "title": "The ______ keyword creates instances.",
    "acceptable_answers": ["new"],
    "explanation": "Explanation here",
    "difficulty": "EASY"
  },
  {
    "type": "MATCH_PAIR",
    "title": "Match terms with definitions:",
    "pairs": {
      "Term A": "Definition A",
      "Term B": "Definition B"
    },
    "explanation": "Explanation here"
  },
  {
    "type": "ARRANGE_SEQUENCE",
    "title": "Put these steps in chronological order:",
    "sequence_items": ["Step 1", "Step 2", "Step 3", "Step 4"],
    "explanation": "Explanation here"
  }
]
`
};
