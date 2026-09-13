import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../../store/quizStore';
import { QuestionCard } from '../../components/quiz/QuestionCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { CelebrationBurst } from '../../components/gamification/CelebrationBurst';
import { ResultScreen } from './ResultScreen';
import { quizApi } from '../../api';

export const QuizPage = () => {
  const navigate = useNavigate();
  const {
    session,
    currentIndex,
    userAnswers,
    evaluations,
    isEvaluating,
    isCompleted,
    summary,
    consecutiveCorrect,
    showCelebration,
    initSession,
    setUserAnswer,
    submitAnswer,
    nextQuestion,
    goToQuestion,
    finishQuiz,
  } = useQuizStore();

  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    // If no active session, start a default practice session
    if (!session) {
      quizApi.startQuiz({ count: 5, sessionType: 'PRACTICE' })
        .then((res) => initSession(res.data))
        .catch(() => navigate('/courses'));
    }
  }, [session, initSession, navigate]);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIndex]);

  if (!session || !session.questions || session.questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-slate-400 font-mono">
        Initializing quiz session arena...
      </div>
    );
  }

  if (isCompleted && summary) {
    return <ResultScreen summary={summary} />;
  }

  const currentQuestion = session.questions[currentIndex];
  const currentAnswer = userAnswers[currentQuestion.id];
  const currentEvaluation = evaluations[currentQuestion.id];
  const totalQuestions = session.questions.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const handleSubmit = async (selfRating = null) => {
    const timeTakenMs = Date.now() - questionStartTime;
    const answerToSubmit = (selfRating !== null) ? selfRating : currentAnswer;

    await submitAnswer(currentQuestion.id, answerToSubmit, selfRating, timeTakenMs);
  };

  const handleNext = async () => {
    if (currentIndex < totalQuestions - 1) {
      nextQuestion();
    } else {
      await finishQuiz();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {showCelebration && <CelebrationBurst />}

      {/* Arena Header: Progress & Streak Multiplier */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Question Counter & Mode */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30 uppercase">
            {session.sessionType || 'PRACTICE'}
          </div>
          <span className="text-sm font-semibold text-white">
            Question <span className="text-indigo-400">{currentIndex + 1}</span> of {totalQuestions}
          </span>
        </div>

        {/* Streak Counter Pill */}
        {consecutiveCorrect > 1 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold animate-pulse">
            <span>🔥</span> {consecutiveCorrect}x Streak Bonus Active!
          </div>
        )}

        {/* Progress Dots Nav */}
        <div className="flex items-center gap-1.5">
          {session.questions.map((q, idx) => {
            const isEvaluated = !!evaluations[q.id];
            const isQCorrect = evaluations[q.id]?.isCorrect;
            const isCurrent = idx === currentIndex;

            let dotStyle = 'bg-slate-800 border-slate-700';
            if (isCurrent) dotStyle = 'bg-indigo-500 ring-2 ring-indigo-400 border-white';
            else if (isEvaluated) {
              dotStyle = isQCorrect ? 'bg-emerald-500 border-emerald-400' : 'bg-rose-500 border-rose-400';
            }

            return (
              <button
                key={q.id || idx}
                onClick={() => goToQuestion(idx)}
                className={`w-3 h-3 rounded-full border transition-all ${dotStyle}`}
                title={`Question ${idx + 1}`}
              />
            );
          })}
        </div>

      </div>

      {/* Progress Bar */}
      <ProgressBar progress={progressPercent} height="h-2" color="gradient" />

      {/* Active Question Arena */}
      <QuestionCard
        question={currentQuestion}
        questionIndex={currentIndex}
        totalQuestions={totalQuestions}
        answer={currentAnswer}
        onAnswerChange={(val) => setUserAnswer(currentQuestion.id, val)}
        evaluation={currentEvaluation}
        onSubmit={handleSubmit}
        onNext={handleNext}
        isSubmitting={isEvaluating}
      />

    </div>
  );
};
