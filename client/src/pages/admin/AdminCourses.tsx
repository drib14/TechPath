import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  ListTree,
  Filter,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import type { Course, Technology, Difficulty, ContentStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedTechFilter, setSelectedTechFilter] = useState<string>('all');
  const [selectedDiffFilter, setSelectedDiffFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [technologyId, setTechnologyId] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [status, setStatus] = useState<ContentStatus>('draft');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [techList, courseList] = await Promise.all([
        adminService.getTechnologies(),
        adminService.getCourses(),
      ]);
      setTechnologies(techList);
      setCourses(courseList);
      if (techList.length > 0 && !technologyId) {
        setTechnologyId(techList[0]._id);
      }
    } catch (err: any) {
      toast.error('Failed to load courses', err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const tId = typeof c.technologyId === 'object' ? (c.technologyId as any)._id : c.technologyId;
    const matchesTech = selectedTechFilter === 'all' || tId === selectedTechFilter;
    const matchesDiff = selectedDiffFilter === 'all' || c.difficulty === selectedDiffFilter;
    return matchesTech && matchesDiff;
  });

  const openCreateModal = () => {
    setEditingCourse(null);
    setTitle('');
    setSlug('');
    setTechnologyId(technologies[0]?._id || '');
    setDescription('');
    setThumbnail('');
    setDifficulty('beginner');
    setStatus('draft');
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setSlug(course.slug);
    const tId = typeof course.technologyId === 'object' ? (course.technologyId as any)._id : course.technologyId;
    setTechnologyId(tId);
    setDescription(course.description);
    setThumbnail(course.thumbnail || '');
    setDifficulty(course.difficulty);
    setStatus(course.status);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingCourse) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !technologyId || !description.trim()) {
      toast.warning('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      if (editingCourse) {
        await adminService.updateCourse(editingCourse._id, {
          title,
          slug,
          technologyId,
          description,
          thumbnail,
          difficulty,
          status,
        });
        toast.success('Course Updated', `Successfully updated ${title}`);
      } else {
        await adminService.createCourse({
          title,
          slug,
          technologyId,
          description,
          thumbnail,
          difficulty,
          status,
          order: courses.length,
        });
        toast.success('Course Created', `Successfully created ${title}`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to save course', err.response?.data?.message || 'Server error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, courseTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete course "${courseTitle}"? This will delete all its modules and lessons.`)) {
      return;
    }
    try {
      setIsDeleting(id);
      await adminService.deleteCourse(id);
      toast.success('Course Deleted', `Deleted ${courseTitle}`);
      fetchData();
    } catch (err: any) {
      toast.error('Cannot Delete Course', err.response?.data?.message || 'Remove child modules first');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredCourses.length) return;

    const newCourses = [...filteredCourses];
    const [moved] = newCourses.splice(index, 1);
    newCourses.splice(targetIndex, 0, moved);

    const items = newCourses.map((c, idx) => ({ id: c._id, order: idx }));
    setCourses(newCourses);

    try {
      await adminService.reorderCourses(items);
      toast.success('Reordered', 'Course order saved');
    } catch (err) {
      toast.error('Failed to reorder courses');
      fetchData();
    }
  };

  const getTechName = (t: string | Technology) => {
    if (typeof t === 'object' && t !== null) return t.name;
    const found = technologies.find((item) => item._id === t);
    return found ? found.name : 'Unknown Tech';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Course Management
          </h1>
          <p className="mt-1 text-sm text-surface-400">
            Create structured courses with difficulty tiers, curriculum modules, and interactive lessons.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Course
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-surface-900 border border-surface-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-surface-400" />
          <span className="text-xs font-semibold uppercase text-surface-400">Technology:</span>
          <select
            value={selectedTechFilter}
            onChange={(e) => setSelectedTechFilter(e.target.value)}
            className="bg-surface-950 border border-surface-800 text-surface-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">All Technologies ({courses.length})</option>
            {technologies.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-surface-400">Difficulty:</span>
          <select
            value={selectedDiffFilter}
            onChange={(e) => setSelectedDiffFilter(e.target.value)}
            className="bg-surface-950 border border-surface-800 text-surface-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-surface-400">
            <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
            Loading courses...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center text-surface-400">
            No courses found matching criteria. Click "Create Course" to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-300">
              <thead className="bg-surface-950/60 text-xs font-semibold uppercase tracking-wider text-surface-400 border-b border-surface-800">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Technology</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60">
                {filteredCourses.map((course, idx) => (
                  <tr key={course._id} className="hover:bg-surface-800/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'up')}
                          className="p-1 rounded text-surface-500 hover:text-white disabled:opacity-20 hover:bg-surface-700 transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === filteredCourses.length - 1}
                          onClick={() => handleMove(idx, 'down')}
                          className="p-1 rounded text-surface-500 hover:text-white disabled:opacity-20 hover:bg-surface-700 transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <span className="ml-1 text-xs font-mono text-surface-500">{idx + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-semibold text-white">{course.title}</span>
                        <p className="text-xs text-surface-400 line-clamp-1 max-w-sm mt-0.5">
                          {course.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-800 text-surface-300 border border-surface-700/60">
                        {getTechName(course.technologyId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          course.difficulty === 'beginner'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : course.difficulty === 'intermediate'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {course.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={course.status === 'published' ? 'success' : 'warning'}>
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Curriculum tree link */}
                        <Link
                          to={`/admin/courses/${course._id}/curriculum`}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-600/20 text-primary-300 hover:bg-primary-600/30 border border-primary-500/30 transition-colors"
                          title="Manage Modules & Lessons"
                        >
                          <ListTree className="w-3.5 h-3.5" />
                          Curriculum
                        </Link>

                        <button
                          onClick={() => openEditModal(course)}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-surface-800 transition-colors"
                          title="Edit Settings"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          disabled={isDeleting === course._id}
                          onClick={() => handleDelete(course._id, course.title)}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="Delete"
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

      {/* Create / Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Edit Course' : 'Create New Course'}
        description="Courses contain curriculum modules, lessons, and hands-on exercises."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label="Parent Technology *"
            value={technologyId}
            onChange={(e) => setTechnologyId(e.target.value)}
            options={technologies.map((t) => ({ value: t._id, label: t.name }))}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Modern Fullstack Docker Mastery"
              className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="docker-mastery"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <Select
              label="Difficulty Tier *"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              Course Summary & Learning Goals *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what learners will build and master in this course..."
              className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Select
            label="Publish Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ContentStatus)}
            options={[
              { value: 'draft', label: 'Draft (Hidden from catalog)' },
              { value: 'published', label: 'Published (Available to Learners)' },
            ]}
          />

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
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
