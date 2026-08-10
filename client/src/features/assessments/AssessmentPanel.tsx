import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Trophy,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { assessmentService } from '../../services/assessment.service';
import { Button } from '../../components/ui/Button';
import type { AssessmentSubmissionResult } from '../../types';

interface AssessmentPanelProps {
  lessonId: string;
}

export const AssessmentPanel: React.FC<AssessmentPanelProps> = ({ lessonId }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AssessmentSubmissionResult | null>(null);
  const [started, setStarted] = useState(false);

  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment', lessonId],
    queryFn: () => assessmentService.getByLesson(lessonId),
    enabled: !!lessonId,
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!assessment) throw new Error('No assessment');

      const formattedAnswers = Object.entries(answers).map(([qIdx, optIdx]) => ({
        questionIndex: parseInt(qIdx),
        selectedOptionIndex: optIdx,
      }));

      return assessmentService.submit(assessment._id, formattedAnswers);
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setStarted(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse border border-surface-200 rounded-xl p-6 mt-10">
        <div className="h-5 bg-surface-200 rounded w-1/3 mb-3" />
        <div className="h-4 bg-surface-100 rounded w-2/3" />
      </div>
    );
  }

  if (!assessment || assessment.questions.length === 0) {
    return null;
  }

  const totalQuestions = assessment.questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;

  // Not started yet — show intro card
  if (!started && !result) {
    return (
      <div className="mt-10">
        <div className="border border-surface-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="px-6 py-4 bg-gradient-to-r from-primary-50 to-accent-50 border-b border-surface-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
                <ClipboardCheck className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-surface-900">{assessment.title}</h2>
                <p className="text-sm text-surface-500">Assessment</p>
              </div>
            </div>
          </div>
          <div className="p-6 text-center">
            {assessment.description && (
              <p className="text-surface-600 mb-4">{assessment.description}</p>
            )}
            <div className="flex items-center justify-center gap-6 mb-6 text-sm text-surface-500">
              <span>{totalQuestions} {totalQuestions === 1 ? 'question' : 'questions'}</span>
              <span>•</span>
              <span>Passing score: {assessment.passingScore}%</span>
            </div>
            <Button variant="primary" onClick={() => setStarted(true)}>
              Start Assessment <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show results
  if (result) {
    return (
      <div className="mt-10">
        <div className="border border-surface-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {/* Results Header */}
          <div
            className={`px-6 py-5 border-b ${
              result.passed
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
                : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {result.passed ? (
                <Trophy className="w-8 h-8 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              )}
              <div>
                <h3 className="text-xl font-bold text-surface-900">
                  {result.passed ? 'Assessment Passed!' : 'Not Passed'}
                </h3>
                <p className="text-sm text-surface-500">
                  Score: {result.score}% ({result.correctCount}/{result.totalQuestions} correct)
                  {' · '}Passing: {result.passingScore}%
                </p>
              </div>
            </div>

            {/* Score Bar */}
            <div className="mt-4">
              <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    result.passed ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Per-question breakdown */}
          <div className="p-6 space-y-4">
            {result.details.map((detail, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  detail.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-red-200 bg-red-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {detail.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-surface-800 mb-1">
                      Q{idx + 1}: {detail.question}
                    </p>
                    {!detail.isCorrect && (
                      <p className="text-xs text-surface-500 mb-1">
                        Your answer:{' '}
                        <span className="text-red-600 font-medium">
                          {assessment.questions[idx]?.options[detail.selectedIndex]?.text || 'No answer'}
                        </span>
                        {' · '}Correct:{' '}
                        <span className="text-emerald-600 font-medium">
                          {assessment.questions[idx]?.options[detail.correctIndex]?.text || '—'}
                        </span>
                      </p>
                    )}
                    {detail.explanation && (
                      <p className="text-xs text-surface-600 mt-1 italic">{detail.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // In-progress — show questions
  return (
    <div className="mt-10">
      <div className="border border-surface-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="px-6 py-4 bg-gradient-to-r from-primary-50 to-accent-50 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-surface-900">{assessment.title}</h2>
            </div>
            <span className="text-sm text-surface-500">
              {answeredCount}/{totalQuestions} answered
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {assessment.questions.map((q, qIdx) => (
            <div key={q._id || qIdx} className="pb-6 border-b border-surface-100 last:border-0 last:pb-0">
              <p className="text-sm font-semibold text-surface-800 mb-3">
                <span className="text-primary-600 mr-2">Q{qIdx + 1}.</span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                    }
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all duration-150 flex items-center gap-3 ${
                      answers[qIdx] === optIdx
                        ? 'border-primary-400 bg-primary-50 ring-1 ring-primary-200'
                        : 'border-surface-200 hover:border-primary-300 hover:bg-primary-50/30'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                        answers[qIdx] === optIdx
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-surface-300 text-surface-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="primary"
              disabled={!allAnswered || submitMutation.isPending}
              onClick={() => submitMutation.mutate()}
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Assessment'}
            </Button>
            {!allAnswered && (
              <p className="text-xs text-surface-400">
                Answer all questions to submit
              </p>
            )}
          </div>
          {submitMutation.isError && (
            <p className="text-sm text-red-600">Failed to submit. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
};
