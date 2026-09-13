import axiosInstance from './axiosInstance';

export const authApi = {
  login: (credentials) => axiosInstance.post('/api/auth/login', credentials),
  register: (userData) => axiosInstance.post('/api/auth/register', userData),
  me: () => axiosInstance.get('/api/auth/me'),
};

export const courseApi = {
  getAllCourses: () => axiosInstance.get('/api/courses'),
  getCourseDetails: (slug) => axiosInstance.get(`/api/courses/${slug}`),
  getTopicDetails: (topicId) => axiosInstance.get(`/api/courses/topics/${topicId}`),
};

export const quizApi = {
  startQuiz: (payload) => axiosInstance.post('/api/quiz/start', payload),
  submitAnswer: (payload) => axiosInstance.post('/api/quiz/submit', payload),
  completeQuiz: (sessionId) => axiosInstance.post(`/api/quiz/${sessionId}/complete`),
  getHistory: () => axiosInstance.get('/api/quiz/history'),
};

export const progressApi = {
  getDashboardStats: () => axiosInstance.get('/api/progress/dashboard'),
  getTopicProgress: () => axiosInstance.get('/api/progress/topics'),
  getWeakAreas: () => axiosInstance.get('/api/progress/weak-areas'),
  getBadges: () => axiosInstance.get('/api/progress/badges'),
  toggleBookmark: (questionId, data) => axiosInstance.post(`/api/questions/${questionId}/bookmark`, data),
  getBookmarks: (tag) => axiosInstance.get('/api/questions/bookmarks', { params: { tag } }),
};

export const revisionApi = {
  startSmartRevision: (count = 10) => axiosInstance.post('/api/revision/smart/start', null, { params: { count } }),
};

export const adminApi = {
  getStats: () => axiosInstance.get('/api/admin/stats'),
  reimportContent: () => axiosInstance.post('/api/admin/reimport'),
};
