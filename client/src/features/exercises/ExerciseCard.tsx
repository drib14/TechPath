import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, XCircle, HelpCircle, Send, Code, FileText, Settings, AlertTriangle } from 'lucide-react';
import { exerciseService } from '../../services/exercise.service';
import { Button } from '../../components/ui/Button';

interface ExerciseOption {
  text: string;
}

interface ExerciseData {
  _id: string;
  lessonId: string;
  type: string;
  question: string;
  options: ExerciseOption[];
  order: number;
}

interface ExerciseResult {
  isCorrect: boolean;
  correctOptionIndex?: number;
  correctAnswer?: string;
  explanation: string;
}

interface ExerciseCardProps {
  exercise: ExerciseData;
  index: number;
}

const exerciseTypeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  'multiple-choice': { icon: HelpCircle, label: 'Multiple Choice', color: 'text-primary-600' },
  'true-false': { icon: CheckCircle, label: 'True / False', color: 'text-accent-600' },
  'text-answer': { icon: FileText, label: 'Text Answer', color: 'text-amber-600' },
  'code': { icon: Code, label: 'Code', color: 'text-violet-600' },
  'configuration': { icon: Settings, label: 'Configuration', color: 'text-teal-600' },
  'scenario': { icon: AlertTriangle, label: 'Scenario', color: 'text-orange-600' },
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload: { selectedOptionIndex?: number; textAnswer?: string } = {};

      if (exercise.type === 'multiple-choice' || exercise.type === 'true-false') {
        if (selectedOption !== null) {
          payload.selectedOptionIndex = selectedOption;
        }
      } else {
        payload.textAnswer = textAnswer;
      }

      return exerciseService.submitAnswer(exercise._id, payload);
    },
    onSuccess: (data) => {
      setResult(data);
      setSubmitted(true);
    },
  });

  const config = exerciseTypeConfig[exercise.type] || exerciseTypeConfig['multiple-choice'];
  const TypeIcon = config.icon;
  const isOptionBased = exercise.type === 'multiple-choice' || exercise.type === 'true-false';
  const canSubmit = isOptionBased ? selectedOption !== null : textAnswer.trim().length > 0;

  return (
    <div className="border border-surface-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 bg-surface-50 border-b border-surface-200 flex items-center gap-3">
        <div className={`flex items-center gap-2 ${config.color}`}>
          <TypeIcon className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {config.label}
          </span>
        </div>
        <span className="text-xs text-surface-400 ml-auto">Exercise {index + 1}</span>
        {submitted && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              result?.isCorrect
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {result?.isCorrect ? 'Correct' : 'Incorrect'}
          </span>
        )}
      </div>

      {/* Question */}
      <div className="p-5">
        <p className="text-surface-800 font-medium mb-4 leading-relaxed">{exercise.question}</p>

        {/* Option-based UI */}
        {isOptionBased && (
          <div className="space-y-2 mb-4">
            {exercise.options.map((option, optIdx) => {
              let optionStyle = 'border-surface-200 hover:border-primary-300 hover:bg-primary-50/30';
              
              if (submitted && result) {
                if (optIdx === result.correctOptionIndex) {
                  optionStyle = 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-200';
                } else if (optIdx === selectedOption && !result.isCorrect) {
                  optionStyle = 'border-red-400 bg-red-50 ring-1 ring-red-200';
                } else {
                  optionStyle = 'border-surface-200 opacity-60';
                }
              } else if (selectedOption === optIdx) {
                optionStyle = 'border-primary-400 bg-primary-50 ring-1 ring-primary-200';
              }

              return (
                <button
                  key={optIdx}
                  disabled={submitted}
                  onClick={() => setSelectedOption(optIdx)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 flex items-center gap-3 ${optionStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                      submitted && result
                        ? optIdx === result.correctOptionIndex
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : optIdx === selectedOption && !result.isCorrect
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-surface-300 text-surface-400'
                        : selectedOption === optIdx
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-surface-300 text-surface-400'
                    }`}
                  >
                    {submitted && result ? (
                      optIdx === result.correctOptionIndex ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : optIdx === selectedOption && !result.isCorrect ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        String.fromCharCode(65 + optIdx)
                      )
                    ) : (
                      String.fromCharCode(65 + optIdx)
                    )}
                  </span>
                  <span className="text-sm text-surface-700">{option.text}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Text-based UI */}
        {!isOptionBased && (
          <div className="mb-4">
            <textarea
              disabled={submitted}
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={exercise.type === 'code' ? 6 : 3}
              className={`w-full px-4 py-3 rounded-lg border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-y text-sm transition-colors ${
                exercise.type === 'code' ? 'font-mono bg-surface-50' : ''
              } ${submitted ? 'bg-surface-100 cursor-not-allowed' : ''}`}
            />
          </div>
        )}

        {/* Submit Button */}
        {!submitted && (
          <Button
            variant="primary"
            size="sm"
            disabled={!canSubmit || submitMutation.isPending}
            onClick={() => submitMutation.mutate()}
          >
            {submitMutation.isPending ? (
              'Checking...'
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Check Answer
              </>
            )}
          </Button>
        )}

        {/* Error */}
        {submitMutation.isError && (
          <p className="text-sm text-red-600 mt-2">
            Failed to check answer. Please try again.
          </p>
        )}

        {/* Result & Explanation */}
        {submitted && result && (
          <div
            className={`mt-4 p-4 rounded-lg border ${
              result.isCorrect
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {result.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-600" />
              )}
              <span
                className={`font-semibold text-sm ${
                  result.isCorrect ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {result.isCorrect ? 'Correct!' : 'Not quite right'}
              </span>
            </div>
            {result.explanation && (
              <p className="text-sm text-surface-600 leading-relaxed">{result.explanation}</p>
            )}
            {!result.isCorrect && result.correctAnswer && !isOptionBased && (
              <p className="text-sm text-surface-600 mt-2">
                <span className="font-medium">Expected answer: </span>
                <code className="px-1.5 py-0.5 bg-white rounded text-xs">{result.correctAnswer}</code>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
