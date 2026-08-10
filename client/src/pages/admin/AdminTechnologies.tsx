import React, { useEffect, useState } from 'react';
import { Cpu, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import type { Technology, Domain, ContentStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';

export const AdminTechnologies: React.FC = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [domainId, setDomainId] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Cpu');
  const [status, setStatus] = useState<ContentStatus>('draft');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [domainList, techList] = await Promise.all([
        adminService.getDomains(),
        adminService.getTechnologies(),
      ]);
      setDomains(domainList);
      setTechnologies(techList);
      if (domainList.length > 0 && !domainId) {
        setDomainId(domainList[0]._id);
      }
    } catch (err: any) {
      toast.error('Failed to load technologies', err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTechnologies =
    selectedDomainFilter === 'all'
      ? technologies
      : technologies.filter((t) => {
          const dId = typeof t.domainId === 'object' ? (t.domainId as any)._id : t.domainId;
          return dId === selectedDomainFilter;
        });

  const openCreateModal = () => {
    setEditingTech(null);
    setName('');
    setSlug('');
    setDomainId(domains[0]?._id || '');
    setDescription('');
    setIcon('Cpu');
    setStatus('draft');
    setIsModalOpen(true);
  };

  const openEditModal = (tech: Technology) => {
    setEditingTech(tech);
    setName(tech.name);
    setSlug(tech.slug);
    const dId = typeof tech.domainId === 'object' ? (tech.domainId as any)._id : tech.domainId;
    setDomainId(dId);
    setDescription(tech.description);
    setIcon(tech.icon || 'Cpu');
    setStatus(tech.status);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingTech) {
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
    if (!name.trim() || !slug.trim() || !domainId || !description.trim()) {
      toast.warning('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      if (editingTech) {
        await adminService.updateTechnology(editingTech._id, {
          name,
          slug,
          domainId,
          description,
          icon,
          status,
        });
        toast.success('Technology Updated', `Successfully updated ${name}`);
      } else {
        await adminService.createTechnology({
          name,
          slug,
          domainId,
          description,
          icon,
          status,
          order: technologies.length,
        });
        toast.success('Technology Created', `Successfully created ${name}`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to save technology', err.response?.data?.message || 'Server error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, techName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${techName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      setIsDeleting(id);
      await adminService.deleteTechnology(id);
      toast.success('Technology Deleted', `Deleted ${techName}`);
      fetchData();
    } catch (err: any) {
      toast.error('Cannot Delete Technology', err.response?.data?.message || 'Remove all child courses first');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredTechnologies.length) return;

    const newTechs = [...filteredTechnologies];
    const [moved] = newTechs.splice(index, 1);
    newTechs.splice(targetIndex, 0, moved);

    const items = newTechs.map((t, idx) => ({ id: t._id, order: idx }));
    setTechnologies(newTechs);

    try {
      await adminService.reorderTechnologies(items);
      toast.success('Reordered', 'Technology order saved');
    } catch (err) {
      toast.error('Failed to reorder technologies');
      fetchData();
    }
  };

  const getDomainName = (d: string | Domain) => {
    if (typeof d === 'object' && d !== null) return d.name;
    const found = domains.find((item) => item._id === d);
    return found ? found.name : 'Unknown Domain';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-cyan-400" />
            Technology / Subject Management
          </h1>
          <p className="mt-1 text-sm text-surface-400">
            Specific technologies and frameworks (e.g. Docker, Python, AWS, React, Kubernetes).
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Technology
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 p-4 bg-surface-900 border border-surface-800 rounded-xl">
        <Filter className="w-4 h-4 text-surface-400" />
        <span className="text-xs font-semibold uppercase text-surface-400">Filter by Domain:</span>
        <select
          value={selectedDomainFilter}
          onChange={(e) => setSelectedDomainFilter(e.target.value)}
          className="bg-surface-950 border border-surface-800 text-surface-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="all">All Domains ({technologies.length})</option>
          {domains.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-surface-400">
            <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
            Loading technologies...
          </div>
        ) : filteredTechnologies.length === 0 ? (
          <div className="p-12 text-center text-surface-400">
            No technologies found. Click "Create Technology" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-300">
              <thead className="bg-surface-950/60 text-xs font-semibold uppercase tracking-wider text-surface-400 border-b border-surface-800">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Technology</th>
                  <th className="px-6 py-4">Domain</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60">
                {filteredTechnologies.map((tech, idx) => (
                  <tr key={tech._id} className="hover:bg-surface-800/40 transition-colors">
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
                          disabled={idx === filteredTechnologies.length - 1}
                          onClick={() => handleMove(idx, 'down')}
                          className="p-1 rounded text-surface-500 hover:text-white disabled:opacity-20 hover:bg-surface-700 transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <span className="ml-1 text-xs font-mono text-surface-500">{idx + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                          {tech.icon || tech.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-white">{tech.name}</span>
                          <p className="text-xs text-surface-400 line-clamp-1 max-w-sm mt-0.5">
                            {tech.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-800 text-surface-300 border border-surface-700/60">
                        {getDomainName(tech.domainId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-surface-400">/{tech.slug}</td>
                    <td className="px-6 py-4">
                      <Badge variant={tech.status === 'published' ? 'success' : 'warning'}>
                        {tech.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(tech)}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-surface-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          disabled={isDeleting === tech._id}
                          onClick={() => handleDelete(tech._id, tech.name)}
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTech ? 'Edit Technology' : 'Create New Technology'}
        description="Technologies belong to a parent domain and contain structured courses."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label="Parent Domain *"
            value={domainId}
            onChange={(e) => setDomainId(e.target.value)}
            options={domains.map((d) => ({ value: d._id, label: d.name }))}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              Technology Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Docker, Python, AWS"
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
                placeholder="docker"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
                Icon / Symbol
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="e.g. Docker, Python"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a concise description of this technology..."
              className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Select
            label="Publish Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ContentStatus)}
            options={[
              { value: 'draft', label: 'Draft (Admin Only)' },
              { value: 'published', label: 'Published (Public Learners)' },
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
              {editingTech ? 'Save Changes' : 'Create Technology'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
