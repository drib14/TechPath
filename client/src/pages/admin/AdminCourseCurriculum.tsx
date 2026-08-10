import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ListTree,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  FileText,
  FileCode,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import type { Course, Module, Lesson, ContentStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export const AdminCourseCurriculum: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Module Modal State
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');

  // Lesson Quick Create State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSlug, setLessonSlug] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonStatus, setLessonStatus] = useState<ContentStatus>('draft');

  const [isSaving, setIsSaving] = useState(false);

  const fetchCurriculum = async () => {
    if (!courseId) return;
    try {
      setIsLoading(true);
      const courses = await adminService.getCourses();
      const currentCourse = courses.find((c) => c._id === courseId) || null;
      setCourse(currentCourse);

      const moduleList = await adminService.getModules(courseId);

      // Fetch lessons for each module
      const modulesWithLessons = await Promise.all(
        moduleList.map(async (mod) => {
          const lessons = await adminService.getLessonsByModule(mod._id);
          return { ...mod, lessons };
        })
      );

      setModules(modulesWithLessons);
    } catch (err: any) {
      toast.error('Failed to load curriculum', err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, [courseId]);

  // Module Handlers
  const openCreateModuleModal = () => {
    setEditingModule(null);
    setModuleTitle('');
    setModuleDescription('');
    setIsModuleModalOpen(true);
  };

  const openEditModuleModal = (mod: Module) => {
    setEditingModule(mod);
    setModuleTitle(mod.title);
    setModuleDescription(mod.description || '');
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim() || !courseId) return;

    try {
      setIsSaving(true);
      if (editingModule) {
        await adminService.updateModule(editingModule._id, {
          title: moduleTitle,
          description: moduleDescription,
        });
        toast.success('Module Updated', `Updated ${moduleTitle}`);
      } else {
        await adminService.createModule({
          courseId,
          title: moduleTitle,
          description: moduleDescription,
          order: modules.length,
        });
        toast.success('Module Created', `Added ${moduleTitle}`);
      }
      setIsModuleModalOpen(false);
      fetchCurriculum();
    } catch (err: any) {
      toast.error('Failed to save module', err.response?.data?.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteModule = async (modId: string, title: string) => {
    if (!window.confirm(`Delete module "${title}" and all its lessons?`)) return;
    try {
      await adminService.deleteModule(modId);
      toast.success('Module Deleted', `Deleted ${title}`);
      fetchCurriculum();
    } catch (err: any) {
      toast.error('Cannot Delete Module', err.response?.data?.message || 'Remove lessons first');
    }
  };

  const handleMoveModule = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    const newModules = [...modules];
    const [moved] = newModules.splice(index, 1);
    newModules.splice(targetIndex, 0, moved);

    const items = newModules.map((m, idx) => ({ id: m._id, order: idx }));
    setModules(newModules);

    try {
      await adminService.reorderModules(items);
      toast.success('Reordered', 'Module order saved');
    } catch {
      toast.error('Failed to reorder modules');
      fetchCurriculum();
    }
  };

  // Lesson Handlers
  const openCreateLessonModal = (modId: string) => {
    setTargetModuleId(modId);
    setLessonTitle('');
    setLessonSlug('');
    setLessonDescription('');
    setLessonStatus('draft');
    setIsLessonModalOpen(true);
  };

  const handleLessonTitleChange = (val: string) => {
    setLessonTitle(val);
    setLessonSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    );
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !lessonSlug.trim() || !targetModuleId) return;

    try {
      setIsSaving(true);
      const mod = modules.find((m) => m._id === targetModuleId);
      const newLesson = await adminService.createLesson({
        moduleId: targetModuleId,
        title: lessonTitle,
        slug: lessonSlug,
        description: lessonDescription,
        status: lessonStatus,
        order: mod?.lessons.length || 0,
        content: [
          {
            type: 'heading',
            content: lessonTitle,
            level: 1,
            order: 0,
          },
          {
            type: 'text',
            content: 'Write educational lesson content here using markdown or rich blocks.',
            order: 1,
          },
        ],
      });
      toast.success('Lesson Created', `Created lesson "${lessonTitle}"`);
      setIsLessonModalOpen(false);
      fetchCurriculum();
    } catch (err: any) {
      toast.error('Failed to create lesson', err.response?.data?.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string, title: string) => {
    if (!window.confirm(`Delete lesson "${title}"?`)) return;
    try {
      await adminService.deleteLesson(lessonId);
      toast.success('Lesson Deleted', `Deleted ${title}`);
      fetchCurriculum();
    } catch (err: any) {
      toast.error('Failed to delete lesson', err.response?.data?.message);
    }
  };

  const handleToggleLessonStatus = async (lesson: Lesson) => {
    const nextStatus: ContentStatus = lesson.status === 'published' ? 'draft' : 'published';
    try {
      await adminService.updateLesson(lesson._id, { status: nextStatus });
      toast.success('Status Updated', `Lesson is now ${nextStatus}`);
      fetchCurriculum();
    } catch (err: any) {
      toast.error('Failed to update status', err.response?.data?.message);
    }
  };

  const handleMoveLesson = async (
    modIndex: number,
    lessonIndex: number,
    direction: 'up' | 'down'
  ) => {
    const mod = modules[modIndex];
    const targetLessonIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    if (targetLessonIndex < 0 || targetLessonIndex >= mod.lessons.length) return;

    const newLessons = [...mod.lessons];
    const [moved] = newLessons.splice(lessonIndex, 1);
    newLessons.splice(targetLessonIndex, 0, moved);

    const items = newLessons.map((l, idx) => ({ id: l._id, order: idx }));

    const updatedModules = [...modules];
    updatedModules[modIndex] = { ...mod, lessons: newLessons };
    setModules(updatedModules);

    try {
      await adminService.reorderLessons(items);
      toast.success('Reordered', 'Lesson order saved');
    } catch {
      toast.error('Failed to reorder lessons');
      fetchCurriculum();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/courses"
            className="inline-flex items-center gap-1.5 text-xs text-primary-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses Catalog
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ListTree className="w-6 h-6 text-primary-400" />
            Curriculum Builder: {course?.title || 'Loading...'}
          </h1>
          <p className="mt-1 text-sm text-surface-400">
            Structure your course hierarchy into sequential modules and interactive lessons.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModuleModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Module
        </Button>
      </div>

      {/* Curriculum Modules Tree */}
      {isLoading ? (
        <div className="p-12 text-center text-surface-400 bg-surface-900 border border-surface-800 rounded-2xl">
          <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          Loading course curriculum...
        </div>
      ) : modules.length === 0 ? (
        <div className="p-12 text-center bg-surface-900 border border-surface-800 rounded-2xl text-surface-400">
          <p className="text-base font-semibold text-white">This course has no modules yet.</p>
          <p className="text-xs text-surface-500 mt-1 mb-4">
            Create your first module (e.g. "Module 1: Getting Started") to add lessons.
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModuleModal}>
            <Plus className="w-4 h-4 mr-1.5" /> Create Module
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {modules.map((mod, modIdx) => (
            <div
              key={mod._id}
              className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-xl"
            >
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-surface-950/60 border-b border-surface-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button
                      disabled={modIdx === 0}
                      onClick={() => handleMoveModule(modIdx, 'up')}
                      className="p-1 rounded text-surface-500 hover:text-white disabled:opacity-20 hover:bg-surface-700 transition-colors"
                      title="Move Module Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={modIdx === modules.length - 1}
                      onClick={() => handleMoveModule(modIdx, 'down')}
                      className="p-1 rounded text-surface-500 hover:text-white disabled:opacity-20 hover:bg-surface-700 transition-colors"
                      title="Move Module Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-400">
                        Module {modIdx + 1}
                      </span>
                      <span className="text-surface-600">•</span>
                      <h2 className="text-base font-bold text-white">{mod.title}</h2>
                    </div>
                    {mod.description && (
                      <p className="text-xs text-surface-400 mt-0.5">{mod.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCreateLessonModal(mod._id)}
                    className="!border-surface-700 !text-surface-200 hover:!bg-surface-800"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Lesson
                  </Button>
                  <button
                    onClick={() => openEditModuleModal(mod)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-surface-800 transition-colors"
                    title="Edit Module"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteModule(mod._id, mod.title)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Module"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lessons List in Module */}
              <div className="p-4 sm:p-5">
                {mod.lessons.length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-surface-950/30 border border-dashed border-surface-800 text-surface-500 text-xs">
                    No lessons in this module yet. Click "+ Add Lesson" above.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {mod.lessons.map((lesson, lIdx) => (
                      <div
                        key={lesson._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-950/40 border border-surface-800 hover:border-surface-700 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-0.5">
                            <button
                              disabled={lIdx === 0}
                              onClick={() => handleMoveLesson(modIdx, lIdx, 'up')}
                              className="p-1 rounded text-surface-500 hover:text-white disabled:opacity-20 hover:bg-surface-800 transition-colors"
                              title="Move Lesson Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={lIdx === mod.lessons.length - 1}
                              onClick={() => handleMoveLesson(modIdx, lIdx, 'down')}
                              className="p-1 rounded text-surface-500 hover:text-white disabled:opacity-20 hover:bg-surface-800 transition-colors"
                              title="Move Lesson Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="w-7 h-7 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center text-xs font-mono text-surface-300">
                            {lIdx + 1}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">
                                {lesson.title}
                              </span>
                              <Badge
                                variant={lesson.status === 'published' ? 'success' : 'warning'}
                                size="sm"
                              >
                                {lesson.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-surface-400 mt-0.5">
                              <span className="font-mono">/{lesson.slug}</span>
                              <span>•</span>
                              <span>{lesson.content?.length || 0} blocks</span>
                            </div>
                          </div>
                        </div>

                        {/* Lesson Action Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {/* Publish/Draft Toggle */}
                          <button
                            onClick={() => handleToggleLessonStatus(lesson)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                              lesson.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            }`}
                          >
                            {lesson.status === 'published' ? 'Published' : 'Draft'}
                          </button>

                          {/* Open Block CMS Editor */}
                          <Link
                            to={`/admin/lessons/${lesson._id}/editor`}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-primary-600 text-white hover:bg-primary-500 shadow-md shadow-primary-600/30 transition-colors"
                          >
                            <FileCode className="w-3.5 h-3.5" />
                            Edit Blocks
                          </Link>

                          <button
                            onClick={() => handleDeleteLesson(lesson._id, lesson.title)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Lesson"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Module Modal */}
      <Modal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        title={editingModule ? 'Edit Module' : 'Add New Module'}
        description="Modules represent chapters or thematic sections in this course."
      >
        <form onSubmit={handleSaveModule} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              Module Title *
            </label>
            <input
              type="text"
              required
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="e.g. Unit 1: Containers & Image Creation"
              className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              Module Overview (Optional)
            </label>
            <textarea
              rows={3}
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              placeholder="Explain the objectives of this module..."
              className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModuleModalOpen(false)}
              className="!text-surface-400 hover:!text-white"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingModule ? 'Save Changes' : 'Create Module'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Add Lesson Modal */}
      <Modal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        title="Add New Lesson"
        description="Create a lesson topic. You will be able to customize all content blocks in the visual editor."
      >
        <form onSubmit={handleCreateLesson} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              Lesson Title *
            </label>
            <input
              type="text"
              required
              value={lessonTitle}
              onChange={(e) => handleLessonTitleChange(e.target.value)}
              placeholder="e.g. Building Multi-Stage Dockerfiles"
              className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={lessonSlug}
              onChange={(e) => setLessonSlug(e.target.value)}
              placeholder="building-multi-stage-dockerfiles"
              className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              Summary (Optional)
            </label>
            <textarea
              rows={2}
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
              placeholder="Short description of what is taught..."
              className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Select
            label="Initial Status"
            value={lessonStatus}
            onChange={(e) => setLessonStatus(e.target.value as ContentStatus)}
            options={[
              { value: 'draft', label: 'Draft (Admin Only)' },
              { value: 'published', label: 'Published (Public Learners)' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLessonModalOpen(false)}
              className="!text-surface-400 hover:!text-white"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Create Lesson
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
