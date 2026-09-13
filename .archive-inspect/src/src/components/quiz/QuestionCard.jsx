import React, { useState, useEffect } from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { McqSingleRenderer } from './McqSingleRenderer';
import { McqMultiRenderer } from './McqMultiRenderer';
import { FillBlankRenderer } from './FillBlankRenderer';
import { TrueFalseRenderer } from './TrueFalseRenderer';
import { MatchPairRenderer } from './MatchPairRenderer';
import { SequenceRenderer } from './SequenceRenderer';
import { CodeCompletionRenderer } from './CodeCompletionRenderer';
import { FlashcardRenderer } from './FlashcardRenderer';
import { DescriptiveRenderer } from './DescriptiveRenderer';
import { ObjectiveResultPanel } from './ObjectiveResultPanel';
import { SubjectiveResultPanel } from './SubjectiveResultPanel';
import { soundEngine } from '../../utils/soundEffects';
import { useThemeStore } from '../../store/themeStore';
import { progressApi } from '../../api';

export const QuestionCard = ({
  question,
  questionIndex,
  totalQuestions,
  answer,
  onAnswerChange,
  evaluation,
  onSubmit,
  onNext,
  isSubmitting = false,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(question.timeLimitSeconds || null);
  const soundEnabled = useThemeStore((state) => state.soundEnabled);

  // Reset local state when question changes
  useEffect(() => {
    setShowHint(false);
    setSecondsLeft(question.timeLimitSeconds || null);
  }, [question.id]);

  // Countdown timer if timed question
  useEffect(() => {
    if (evaluation || !secondsLeft || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft, evaluation]);

  // Sound triggers on evaluation
  useEffect(() => {
    if (evaluation && soundEnabled) {
      if (evaluation.isCorrect || evaluation.evaluationMode === 'SUBJECTIVE') {
        soundEngine.playCorrect();
      } else if (evaluation.isCorrect === false) {
        soundEngine.playIncorrect();
      }
    }
  }, [evaluation, soundEnabled]);

  const handleToggleBookmark = async () => {
    try {
      await progressApi.toggleBookmark(question.id, { tag: 'revision' });
      setIsBookmarked(!isBookmarked);
    } catch (e) {
      console.error('Bookmark error:', e);
    }
  };

  const isAnswerProvided = () => {
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    if (typeof answer === 'object') return Object.keys(answer).length > 0;
    return String(answer).trim().length > 0;
  };

  const getDifficultyVariant = (diff) => {
    switch (diff?.toUpperCase()) {
      case 'ADVANCED': return 'danger';
      case 'INTERMEDIATE': return 'warning';
      default: return 'success';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl">
      
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="brand" size="sm">
            {question.questionType?.replace(/_/g, ' ')}
          </Badge>
          <Badge variant={getDifficultyVariant(question.difficulty)} size="sm">
            {question.difficulty || 'BEGINNER'}
          </Badge>
          {question.isInterview && (
            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-mono font-semibold">
              🎯 Interview Focus
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {secondsLeft !== null && (
            <div className={`px-3 py-1 rounded-lg font-mono text-xs font-bold border flex items-center gap-1.5 ${
              secondsLeft <= 10
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-white/10'
            }`}>
              <span>⏱️</span> {secondsLeft}s
            </div>
          )}

          <button
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        </div>
      </div>

      {/* Question Header & Prompt */}
      <div className="py-6 space-y-4">
        <div className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
          Question {questionIndex + 1} of {totalQuestions}
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white leading-snug">
          {question.title}
        </h2>
      </div>

      {/* Code Snippet Box (if present and not already shown in code completion) */}
      {question.codeSnippet && question.questionType !== 'CODE_COMPLETION' && question.questionType !== 'COMPLETE_CODE' && (
        <div className="mb-6 rounded-2xl bg-slate-950 border border-white/10 p-5 font-mono text-sm overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 mb-3 border-b border-white/5">
            <span className="uppercase font-semibold text-indigo-400 font-mono">
              {question.codeLanguage || 'java'}
            </span>
            <span>Snippet</span>
          </div>
          <pre className="text-slate-100 font-mono leading-relaxed whitespace-pre-wrap">
            {question.codeSnippet}
          </pre>
        </div>
      )}

      {/* Interactive Question Type Renderer Router */}
      <div className="my-2">
        {(question.questionType === 'MCQ_SINGLE' || question.questionType === 'MCQ' || question.questionType === 'SINGLE_CHOICE') && (
          <McqSingleRenderer
            options={question.options}
            selectedAnswer={answer}
            onSelectAnswer={onAnswerChange}
            disabled={!!evaluation}
            evaluation={evaluation}
          />
        )}

        {(question.questionType === 'MCQ_MULTI' || question.questionType === 'MULTI_CHOICE' || question.questionType === 'MULTIPLE_CHOICE') && (
          <McqMultiRenderer
            options={question.options}
            selectedAnswer={answer}
            onSelectAnswer={onAnswerChange}
            disabled={!!evaluation}
            evaluation={evaluation}
          />
        )}

        {(question.questionType === 'FILL_BLANK' || question.questionType === 'FILL_IN_THE_BLANK' || question.questionType === 'FILL_IN_BLANK') && (
          <FillBlankRenderer
            value={answer || ''}
            onChange={onAnswerChange}
            disabled={!!evaluation}
            evaluation={evaluation}
          />
        )}

        {(question.questionType === 'TRUE_FALSE' || question.questionType === 'BOOLEAN') && (
          <TrueFalseRenderer
            selectedAnswer={answer}
            onSelectAnswer={onAnswerChange}
            disabled={!!evaluation}
            evaluation={evaluation}
          />
        )}

        {(question.questionType === 'MATCH_PAIR' || question.questionType === 'MATCH_PAIRS' || question.questionType === 'MATCHING') && (
          <MatchPairRenderer
            options={question.options}
            userPairs={answer || {}}
            onChange={onAnswerChange}
            disabled={!!evaluation}
            evaluation={evaluation}
          />
        )}

        {(question.questionType === 'SEQUENCE' || question.questionType === 'ARRANGE_SEQUENCE' || question.questionType === 'ORDER') && (
          <SequenceRenderer
            items={question.options?.map((o) => o.optionText) || []}
            sequence={answer || []}
            onChange={onAnswerChange}
            disabled={!!evaluation}
            evaluation={evaluation}
          />
        )}

        {(question.questionType === 'COMPLETE_CODE' || question.questionType === 'CODE_COMPLETION' || question.questionType === 'CODE') && (
          <CodeCompletionRenderer
            codeSnippet={question.codeSnippet}
            codeLanguage={question.codeLanguage}
            value={answer || ''}
            onChange={onAnswerChange}
            disabled={!!evaluation}
            evaluation={evaluation}
          />
        )}

        {(question.questionType === 'FLASHCARD' || question.questionType === 'FLASH_CARD') && (
          <FlashcardRenderer
            questionTitle={question.title}
            explanation={question.explanation}
            onRateAnswer={(rating) => onSubmit(rating)}
            disabled={!!evaluation}
            evaluation={evaluation}
          />
        )}

        {(question.questionType === 'EXPLAIN_CONCEPT' || question.questionType === 'INTERVIEW_MODE' || question.questionType === 'DESCRIPTIVE' || question.questionType === 'CASE_STUDY' || question.evaluationMode === 'SUBJECTIVE') && (
          <DescriptiveRenderer
            value={answer || ''}
            onChange={onAnswerChange}
            disabled={!!evaluation}
            evaluation={evaluation}
          />
        )}
      </div>

      {/* Hint Drawer */}
      {question.hint && !evaluation && (
        <div className="pt-2">
          {!showHint ? (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>💡 Need a hint?</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 animate-in fade-in duration-200">
              <span className="font-semibold text-indigo-300 font-mono">HINT: </span>
              {question.hint}
            </div>
          )}
        </div>
      )}

      {/* Post-submission Evaluation Panels */}
      {evaluation && (
        <>
          {question.evaluationMode === 'SUBJECTIVE' ? (
            <SubjectiveResultPanel evaluation={evaluation} />
          ) : (
            <ObjectiveResultPanel evaluation={evaluation} explanation={question.explanation} />
          )}
        </>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
        <div className="text-xs text-slate-400 font-mono">
          Reward: <strong className="text-amber-400">+{question.xpReward || 15} XP</strong>
        </div>

        <div className="flex items-center gap-3">
          {!evaluation && question.questionType !== 'FLASHCARD' && (
            <Button
              variant="primary"
              size="md"
              disabled={!isAnswerProvided() || isSubmitting}
              isLoading={isSubmitting}
              onClick={() => onSubmit()}
            >
              {question.evaluationMode === 'SUBJECTIVE' ? 'Submit for AI Evaluation' : 'Submit Answer'}
            </Button>
          )}

          {evaluation && (
            <Button variant="primary" size="md" onClick={onNext}>
              {questionIndex < totalQuestions - 1 ? 'Next Question →' : 'View Final Results 🏆'}
            </Button>
          )}
        </div>
      </div>

    </div>
  );
};
