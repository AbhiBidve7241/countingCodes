import axiosInstance from './axiosInstance';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username?: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface StartQuizPayload {
  courseId?: number;
  topicId?: number;
  sessionType?: 'PRACTICE' | 'TIMED' | 'EXAM' | 'FLASHCARD' | 'INTERVIEW' | 'REVISION';
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL';
  questionTypes?: string[];
  interviewOnly?: boolean;
  count?: number;
}

export interface SubmitAnswerPayload {
  quizSessionId: number;
  questionId: number;
  userAnswer: string;
  selfRating?: number;
  timeTakenMs?: number;
}

export const authApi = {
  login: (payload: LoginPayload) => axiosInstance.post('/api/auth/login', payload),
  register: (payload: RegisterPayload) => axiosInstance.post('/api/auth/register', payload),
  refresh: (refreshToken: string) =>
    axiosInstance.post('/api/auth/refresh', {}, { headers: { 'X-Refresh-Token': refreshToken } }),
};

export const courseApi = {
  getAllCourses: () => axiosInstance.get('/api/courses'),
  getCourseDetails: (slug: string) => axiosInstance.get(`/api/courses/${slug}`),
  getTopic: (topicId: number | string) => axiosInstance.get(`/api/courses/topics/${topicId}`),
};

export const quizApi = {
  startQuiz: (payload: StartQuizPayload) => axiosInstance.post('/api/quiz/start', payload),
  submitAnswer: (payload: SubmitAnswerPayload) => axiosInstance.post('/api/quiz/submit', payload),
  completeQuiz: (sessionId: number) => axiosInstance.post(`/api/quiz/${sessionId}/complete`),
  getHistory: () => axiosInstance.get('/api/quiz/history'),
};

export const progressApi = {
  getDashboardStats: () => axiosInstance.get('/api/progress/dashboard'),
  getTopicProgress: () => axiosInstance.get('/api/progress/topics'),
  getWeakAreas: () => axiosInstance.get('/api/progress/weak-areas'),
  getBadges: () => axiosInstance.get('/api/progress/badges'),
};

export const revisionApi = {
  startSmartRevision: (count = 10) =>
    axiosInstance.post('/api/revision/smart/start', null, { params: { count } }),
};

export const questionApi = {
  toggleBookmark: (id: number, data?: { note?: string; tag?: string }) =>
    axiosInstance.post(`/api/questions/${id}/bookmark`, data),
  getBookmarks: (tag?: string) => axiosInstance.get('/api/questions/bookmarks', { params: { tag } }),
};

export const adminApi = {
  getStats: () => axiosInstance.get('/api/admin/stats'),
  reimportContent: () => axiosInstance.post('/api/admin/reimport'),
  importBatchQuestions: (payload: any) => axiosInstance.post('/api/admin/questions/import-batch', payload),
  createCourse: (payload: any) => axiosInstance.post('/api/admin/courses', payload),
  getAllTopics: () => axiosInstance.get('/api/admin/topics'),
};

export default {
  auth: authApi,
  courses: courseApi,
  quiz: quizApi,
  progress: progressApi,
  revision: revisionApi,
  questions: questionApi,
  admin: adminApi,
};
