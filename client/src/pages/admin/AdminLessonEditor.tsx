import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileCode,
  Save,
  Plus,
  Eye,
  Columns,
  Code2,
  ArrowLeft,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import type { Lesson, ContentBlock, ContentBlockType, ContentStatus, Module } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { BlockEditor } from '../../components/admin/BlockEditor';
import { BlockTypePicker } from '../../components/admin/BlockTypePicker';
import { LessonRenderer } from '../../features/lessons/renderer/LessonRenderer';
import { useToast } from '../../components/ui/Toast';

type ViewMode = 'editor' | 'split' | 'preview';

export const AdminLessonEditor: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  // Form & Content Blocks State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const fetchLessonData = async () => {
    if (!lessonId) return;
    try {
      setIsLoading(true);
      const data = await adminService.getLessonById(lessonId);
      setLesson(data);
      setTitle(data.title);
      setSlug(data.slug);
      setDescription(data.description || '');
      const mId = typeof data.moduleId === 'object' ? (data.moduleId as any)._id : data.moduleId;
      setModuleId(mId);
      setStatus(data.status);
      setBlocks(data.content || []);
    } catch (err: any) {
      toast.error('Failed to load lesson', err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  // Block Manipulation Handlers
  const handleAddBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      type,
      content:
        type === 'heading'
          ? 'New Section Heading'
          : type === 'text'
          ? 'Write paragraph content here...'
          : type === 'code'
          ? '// Code snippet'
          : '',
      title: type === 'tip' || type === 'warning' || type === 'note' ? 'Important Note' : '',
      level: type === 'heading' ? 2 : undefined,
      language: type === 'code' ? 'typescript' : undefined,
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
    setIsPickerOpen(false);
    toast.info('Block Added', `Added new ${type} block`);
  };

  const handleUpdateBlock = (index: number, updated: ContentBlock) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = updated;
    setBlocks(updatedBlocks);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const updatedBlocks = [...blocks];
    const [moved] = updatedBlocks.splice(index, 1);
    updatedBlocks.splice(targetIndex, 0, moved);

    // Re-index order property
    const reordered = updatedBlocks.map((b, idx) => ({ ...b, order: idx }));
    setBlocks(reordered);
  };

  const handleDuplicateBlock = (index: number) => {
    const toDuplicate = blocks[index];
    const duplicated: ContentBlock = {
      ...toDuplicate,
      _id: undefined,
      order: index + 1,
    };
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, duplicated);
    const reordered = updatedBlocks.map((b, idx) => ({ ...b, order: idx }));
    setBlocks(reordered);
    toast.info('Block Duplicated');
  };

  const handleDeleteBlock = (index: number) => {
    const updatedBlocks = blocks.filter((_, idx) => idx !== index);
    const reordered = updatedBlocks.map((b, idx) => ({ ...b, order: idx }));
    setBlocks(reordered);
    toast.info('Block Removed');
  };

  const handleSave = async (publishImmediate?: boolean) => {
    if (!lessonId) return;
    if (!title.trim() || !slug.trim()) {
      toast.warning('Validation Error', 'Lesson title and slug are required');
      return;
    }

    const saveStatus = publishImmediate ? 'published' : status;

    try {
      setIsSaving(true);
      const reindexedBlocks = blocks.map((b, idx) => ({ ...b, order: idx }));
      const updated = await adminService.updateLesson(lessonId, {
        title,
        slug,
        description,
        status: saveStatus,
        content: reindexedBlocks,
      });

      setLesson(updated);
      setStatus(saveStatus);
      setBlocks(updated.content);
      toast.success(
        publishImmediate ? 'Lesson Published!' : 'Changes Saved',
        `Successfully saved ${title}`
      );
    } catch (err: any) {
      toast.error('Failed to save lesson', err.response?.data?.message || 'Server error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-900 border border-surface-800 shadow-xl sticky top-20 z-20 backdrop-blur-md bg-surface-900/95">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-400">
                Lesson Editor
              </span>
              <span className="text-surface-600">•</span>
              <Badge variant={status === 'published' ? 'success' : 'warning'} size="sm">
                {status}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight truncate max-w-md">
              {title || 'Untitled Lesson'}
            </h1>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-surface-950 border border-surface-800 text-xs">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'editor' ? 'bg-surface-800 text-white shadow' : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Editor
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'split' ? 'bg-surface-800 text-white shadow' : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'preview' ? 'bg-surface-800 text-white shadow' : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            isLoading={isSaving}
            className="!border-surface-700 !text-surface-200 hover:!bg-surface-800"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Draft
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSave(true)}
            isLoading={isSaving}
            className="shadow-lg shadow-primary-600/30"
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Publish Lesson
          </Button>
        </div>
      </div>

      {/* Lesson Metadata Accordion/Panel */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-surface-400">
          Lesson Settings & Metadata
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-surface-300 mb-1.5">
              Lesson Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-surface-300 mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-surface-300 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="draft">Draft (Admin Only)</option>
              <option value="published">Published (Public Catalog)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Workspace: Editor + Live Preview */}
      <div
        className={`grid gap-6 ${
          viewMode === 'split'
            ? 'grid-cols-1 lg:grid-cols-2'
            : viewMode === 'editor'
            ? 'grid-cols-1 max-w-4xl mx-auto'
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}
      >
        {/* Left / Main: Block Builder Area */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-400">
                Structured Content Blocks ({blocks.length})
              </span>
              <Button variant="primary" size="sm" onClick={() => setIsPickerOpen(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                Add Block
              </Button>
            </div>

            {blocks.length === 0 ? (
              <div className="p-12 text-center bg-surface-900 border border-surface-800 rounded-2xl text-surface-400 space-y-3">
                <Sparkles className="w-8 h-8 text-primary-400 mx-auto" />
                <p className="text-sm font-semibold text-white">This lesson has no content blocks.</p>
                <p className="text-xs text-surface-500">
                  Click "+ Add Block" to insert Headings, Paragraphs, Code, Callouts, or Quizzes.
                </p>
                <Button variant="primary" size="sm" onClick={() => setIsPickerOpen(true)}>
                  <Plus className="w-4 h-4 mr-1.5" /> Add First Block
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block, idx) => (
                  <BlockEditor
                    key={block._id || `block-${idx}`}
                    block={block}
                    index={idx}
                    totalBlocks={blocks.length}
                    onChange={(updated) => handleUpdateBlock(idx, updated)}
                    onMoveUp={() => handleMoveBlock(idx, 'up')}
                    onMoveDown={() => handleMoveBlock(idx, 'down')}
                    onDuplicate={() => handleDuplicateBlock(idx)}
                    onDelete={() => handleDeleteBlock(idx)}
                  />
                ))}

                <div className="pt-2 text-center">
                  <Button variant="outline" size="sm" onClick={() => setIsPickerOpen(true)}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Another Block
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right: Live Public Preview Area */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-primary-400" />
                Live Learner Preview (Exact Public Output)
              </span>
              <span className="text-[10px] text-surface-500">Real-time dynamic rendering</span>
            </div>

            <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 sm:p-8 shadow-2xl min-h-[500px]">
              <div className="mb-6 pb-4 border-b border-surface-100 dark:border-surface-800">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
                  {title || 'Untitled Lesson'}
                </h1>
                {description && (
                  <p className="mt-2 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* Lesson Renderer */}
              <LessonRenderer content={blocks} />
            </div>
          </div>
        )}
      </div>

      {/* Block Type Picker Modal */}
      <Modal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        title="Add Content Block"
        description="Choose a block type to insert into your technical lesson."
        maxWidth="2xl"
      >
        <BlockTypePicker onSelect={handleAddBlock} onClose={() => setIsPickerOpen(false)} />
      </Modal>
    </div>
  );
};
