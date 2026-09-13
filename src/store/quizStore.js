import { create } from 'zustand';
import { quizApi } from '../api';
import { useAuthStore } from './authStore';

export const useQuizStore = create((set, get) => ({
  session: null,
  currentIndex: 0,
  userAnswers: {}, // questionId -> answer
  evaluations: {}, // questionId -> EvaluationResult
  timeTakenPerQuestion: {}, // questionId -> ms
  isEvaluating: false,
  isCompleted: false,
  summary: null,
  consecutiveCorrect: 0,
  showCelebration: false,
  levelUpData: null,

  initSession: (sessionData) => {
    set({
      session: sessionData,
      currentIndex: 0,
      userAnswers: {},
      evaluations: {},
      timeTakenPerQuestion: {},
      isEvaluating: false,
      isCompleted: false,
      summary: null,
      consecutiveCorrect: 0,
      showCelebration: false,
      levelUpData: null,
    });
  },

  setUserAnswer: (questionId, answer) => {
    set((state) => ({
      userAnswers: { ...state.userAnswers, [questionId]: answer },
    }));
  },

  submitAnswer: async (questionId, userAnswer, selfRating = null, timeTakenMs = 0) => {
    const { session, consecutiveCorrect } = get();
    if (!session) return null;

    set({ isEvaluating: true });
    try {
      const response = await quizApi.submitAnswer({
        quizSessionId: session.sessionId,
        questionId,
        userAnswer: typeof userAnswer === 'object' ? JSON.stringify(userAnswer) : String(userAnswer),
        selfRating,
        timeTakenMs,
      });

      const evalResult = response.data;
      const isCorrect = evalResult.isCorrect;

      const newConsecutive = isCorrect ? consecutiveCorrect + 1 : 0;
      const triggerCelebration = isCorrect && (newConsecutive === 3 || newConsecutive === 5 || evalResult.evaluationMode === 'SUBJECTIVE');

      set((state) => ({
        evaluations: { ...state.evaluations, [questionId]: evalResult },
        timeTakenPerQuestion: { ...state.timeTakenPerQuestion, [questionId]: timeTakenMs },
        consecutiveCorrect: newConsecutive,
        showCelebration: triggerCelebration,
        isEvaluating: false,
      }));

      // Update XP in auth store if returned
      if (evalResult.xpEarned) {
        const authUser = useAuthStore.getState().user;
        if (authUser) {
          useAuthStore.getState().updateUserStats(
            (authUser.xp || 0) + evalResult.xpEarned,
            authUser.level || 1
          );
        }
      }

      return evalResult;
    } catch (err) {
      set({ isEvaluating: false });
      throw err;
    }
  },

  nextQuestion: () => {
    const { currentIndex, session } = get();
    if (session && currentIndex < session.questions.length - 1) {
      set({ currentIndex: currentIndex + 1, showCelebration: false });
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, showCelebration: false });
    }
  },

  goToQuestion: (index) => {
    set({ currentIndex: index, showCelebration: false });
  },

  finishQuiz: async () => {
    const { session } = get();
    if (!session) return null;

    try {
      const response = await quizApi.completeQuiz(session.sessionId);
      const summaryData = response.data;
      set({ isCompleted: true, summary: summaryData });
      return summaryData;
    } catch (err) {
      console.error('Error completing quiz:', err);
      throw err;
    }
  },

  resetQuiz: () => {
    set({
      session: null,
      currentIndex: 0,
      userAnswers: {},
      evaluations: {},
      timeTakenPerQuestion: {},
      isEvaluating: false,
      isCompleted: false,
      summary: null,
      consecutiveCorrect: 0,
      showCelebration: false,
      levelUpData: null,
    });
  }
}));
