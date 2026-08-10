import React, { useEffect, useState } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  FileQuestion,
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import type { Assessment, Lesson, AssessmentQuestion } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { SkeletonAdminTable } from '../../components/ui/Skeleton';

export const AdminAssessments: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // Form State
  const [lessonId, setLessonId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [assessmentList, courseList] = await Promise.all([
        adminService.getAssessments(),
        adminService.getCourses(),
      ]);
      setAssessments(assessmentList);

      // Collect lessons from courses
      const allLessons: Lesson[] = [];
      for (const course of courseList) {
        const modules = await adminService.getModules(course._id);
        for (const mod of modules) {
          const modLessons = await adminService.getLessonsByModule(mod._id);
          allLessons.push(...modLessons);
        }
      }
      setLessons(allLessons);
      if (allLessons.length > 0 && !lessonId) {
        setLessonId(allLessons[0]._id);
      }
    } catch (err: any) {
      toast.error('Failed to load assessments', err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingAssessment(null);
    setLessonId(lessons[0]?._id || '');
    setTitle('');
    setDescription('');
    setPassingScore(70);
    setQuestions([
      {
        question: 'Sample Question: What is the primary purpose of this technology?',
        type: 'multiple-choice',
        options: [
          { text: 'Correct Answer Explanation', isCorrect: true },
          { text: 'Incorrect option 1', isCorrect: false },
          { text: 'Incorrect option 2', isCorrect: false },
        ],
        explanation: 'Detailed explanation for learners after submission.',
      },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    const lId = typeof assessment.lessonId === 'object' ? (assessment.lessonId as any)._id : assessment.lessonId;
    setLessonId(lId);
    setTitle(assessment.title);
    setDescription(assessment.description || '');
    setPassingScore(assessment.passingScore);
    setQuestions(assessment.questions || []);
    setIsModalOpen(true);
  };

  // Question manipulation helpers
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        type: 'multiple-choice',
        options: [
          { text: 'Option A', isCorrect: true },
          { text: 'Option B', isCorrect: false },
        ],
        explanation: '',
      },
    ]);
  };

  const handleUpdateQuestion = (qIndex: number, updated: Partial<AssessmentQuestion>) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], ...updated };
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    setQuestions(questions.filter((_, idx) => idx !== qIndex));
  };

  const handleAddOption = (qIndex: number) => {
    const q = questions[qIndex];
    handleUpdateQuestion(qIndex, {
      options: [...q.options, { text: '', isCorrect: false }],
    });
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    const q = questions[qIndex];
    const newOptions = [...q.options];
    newOptions[optIndex] = { ...newOptions[optIndex], text };
    handleUpdateQuestion(qIndex, { options: newOptions });
  };

  const handleSetCorrectOption = (qIndex: number, optIndex: number) => {
    const q = questions[qIndex];
    const newOptions = q.options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === optIndex,
    }));
    handleUpdateQuestion(qIndex, { options: newOptions });
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    const q = questions[qIndex];
    if (q.options.length <= 2) {
      toast.warning('A question must have at least 2 options');
      return;
    }
    handleUpdateQuestion(qIndex, {
      options: q.options.filter((_, idx) => idx !== optIndex),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !lessonId || questions.length === 0) {
      toast.warning('Please fill in title and add at least one question');
      return;
    }

    try {
      setIsSaving(true);
      if (editingAssessment) {
        await adminService.updateAssessment(editingAssessment._id, {
          title,
          description,
          passingScore,
          questions,
        });
        toast.success('Assessment Updated', `Saved quiz: ${title}`);
      } else {
        await adminService.createAssessment({
          lessonId,
          title,
          description,
          passingScore,
          questions,
        });
        toast.success('Assessment Created', `Created quiz: ${title}`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to save assessment', err.response?.data?.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, quizTitle: string) => {
    if (!window.confirm(`Delete quiz "${quizTitle}"?`)) return;
    try {
      await adminService.deleteAssessment(id);
      toast.success('Assessment Deleted', `Deleted ${quizTitle}`);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete assessment', err.response?.data?.message);
    }
  };

  const getLessonTitle = (l: string | { _id: string; title: string }) => {
    if (typeof l === 'object' && l !== null) return l.title;
    const found = lessons.find((item) => item._id === l);
    return found ? found.title : 'Attached Lesson';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
            Assessment & Quiz Manager
          </h1>
          <p className="mt-1 text-sm text-surface-400">
            Create automated grading assessments, multiple-choice tests, and passing benchmarks.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Assessment
        </Button>
      </div>

      {/* Table / List */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <SkeletonAdminTable rows={6} cols={5} />
        ) : assessments.length === 0 ? (
          <div className="p-12 text-center text-surface-400">
            No assessments found. Click "Create Assessment" to add a quiz to a lesson.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-300">
              <thead className="bg-surface-950/60 text-xs font-semibold uppercase tracking-wider text-surface-400 border-b border-surface-800">
                <tr>
                  <th className="px-6 py-4">Assessment</th>
                  <th className="px-6 py-4">Attached Lesson</th>
                  <th className="px-6 py-4">Questions</th>
                  <th className="px-6 py-4">Passing Score</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60">
                {assessments.map((quiz) => (
                  <tr key={quiz._id} className="hover:bg-surface-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-semibold text-white">{quiz.title}</span>
                        {quiz.description && (
                          <p className="text-xs text-surface-400 line-clamp-1 max-w-sm mt-0.5">
                            {quiz.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-800 text-surface-200 border border-surface-700/60">
                        <FileQuestion className="w-3.5 h-3.5 text-primary-400" />
                        {getLessonTitle(quiz.lessonId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-surface-300">
                      {quiz.questions?.length || 0} questions
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {quiz.passingScore}% minimum
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(quiz)}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-surface-800 transition-colors"
                          title="Edit Assessment"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(quiz._id, quiz.title)}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Assessment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Assessment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}
        description="Configure questions, answer options with explanations, and passing benchmarks."
        maxWidth="4xl"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
                Attached Lesson *
              </label>
              <select
                required
                disabled={!!editingAssessment}
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {lessons.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.title} (/{l.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
                Passing Score Percentage (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value, 10))}
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              Quiz Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Module 1 Knowledge Check"
              className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Question Builder List */}
          <div className="space-y-4 pt-4 border-t border-surface-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-300">
                Questions List ({questions.length})
              </span>
              <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Question
              </Button>
            </div>

            <div className="space-y-4 max-h-[45vh] overflow-y-auto custom-scrollbar pr-1">
              {questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="p-4 rounded-xl bg-surface-950 border border-surface-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                      Question {qIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-surface-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    value={q.question}
                    onChange={(e) => handleUpdateQuestion(qIdx, { question: e.target.value })}
                    placeholder="Enter question prompt..."
                    className="w-full bg-surface-900 border border-surface-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />

                  {/* Options */}
                  <div className="space-y-2 pl-3 border-l-2 border-primary-500/40">
                    <span className="text-[11px] font-semibold uppercase text-surface-400">
                      Answer Choices (Select the radio to mark correct answer):
                    </span>

                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={opt.isCorrect}
                          onChange={() => handleSetCorrectOption(qIdx, optIdx)}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 bg-surface-900 border-surface-700"
                        />
                        <input
                          type="text"
                          required
                          value={opt.text}
                          onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                          placeholder={`Option ${optIdx + 1}`}
                          className="flex-1 bg-surface-900 border border-surface-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(qIdx, optIdx)}
                          className="text-surface-500 hover:text-red-400 p-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddOption(qIdx)}
                      className="text-xs text-primary-400 hover:underline pt-1 flex items-center gap-1"
                    >
                      + Add Option
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-surface-500 mb-1">
                      Learner Explanation / Feedback (shown after submitting):
                    </label>
                    <input
                      type="text"
                      value={q.explanation || ''}
                      onChange={(e) => handleUpdateQuestion(qIdx, { explanation: e.target.value })}
                      placeholder="Why is this answer correct?"
                      className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-1.5 text-xs text-surface-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="!text-surface-400 hover:!text-white"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingAssessment ? 'Save Changes' : 'Create Assessment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
