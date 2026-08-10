import React, { useEffect, useState } from 'react';
import { Layers, Plus, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import type { Domain, ContentStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';

export const AdminDomains: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Layers');
  const [status, setStatus] = useState<ContentStatus>('draft');

  const fetchDomains = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getDomains();
      setDomains(res);
    } catch (err: any) {
      toast.error('Failed to load domains', err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const openCreateModal = () => {
    setEditingDomain(null);
    setName('');
    setSlug('');
    setDescription('');
    setIcon('Layers');
    setStatus('draft');
    setIsModalOpen(true);
  };

  const openEditModal = (domain: Domain) => {
    setEditingDomain(domain);
    setName(domain.name);
    setSlug(domain.slug);
    setDescription(domain.description);
    setIcon(domain.icon || 'Layers');
    setStatus(domain.status);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingDomain) {
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
    if (!name.trim() || !slug.trim() || !description.trim()) {
      toast.warning('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      if (editingDomain) {
        await adminService.updateDomain(editingDomain._id, {
          name,
          slug,
          description,
          icon,
          status,
        });
        toast.success('Domain Updated', `Successfully updated ${name}`);
      } else {
        await adminService.createDomain({
          name,
          slug,
          description,
          icon,
          status,
          order: domains.length,
        });
        toast.success('Domain Created', `Successfully created ${name}`);
      }
      setIsModalOpen(false);
      fetchDomains();
    } catch (err: any) {
      toast.error('Failed to save domain', err.response?.data?.message || 'Server error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, domainName: string) => {
    if (!window.confirm(`Are you sure you want to delete domain "${domainName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      setIsDeleting(id);
      await adminService.deleteDomain(id);
      toast.success('Domain Deleted', `Deleted ${domainName}`);
      fetchDomains();
    } catch (err: any) {
      toast.error('Cannot Delete Domain', err.response?.data?.message || 'Remove all child technologies first');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= domains.length) return;

    const newDomains = [...domains];
    const [moved] = newDomains.splice(index, 1);
    newDomains.splice(targetIndex, 0, moved);

    const items = newDomains.map((d, idx) => ({ id: d._id, order: idx }));
    setDomains(newDomains);

    try {
      await adminService.reorderDomains(items);
      toast.success('Reordered', 'Domain order saved');
    } catch (err) {
      toast.error('Failed to reorder domains');
      fetchDomains();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-primary-400" />
            Domain Management
          </h1>
          <p className="mt-1 text-sm text-surface-400">
            Top-level technology domains (e.g. Software Engineering, Cybersecurity, Cloud Computing).
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Domain
        </Button>
      </div>

      {/* Table Container */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-surface-400">
            <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
            Loading domains...
          </div>
        ) : domains.length === 0 ? (
          <div className="p-12 text-center text-surface-400">
            No domains found. Click "Create Domain" to start adding educational fields.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-300">
              <thead className="bg-surface-950/60 text-xs font-semibold uppercase tracking-wider text-surface-400 border-b border-surface-800">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Domain</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60">
                {domains.map((domain, idx) => (
                  <tr key={domain._id} className="hover:bg-surface-800/40 transition-colors">
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
                          disabled={idx === domains.length - 1}
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
                        <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-sm">
                          {domain.icon || domain.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-white">{domain.name}</span>
                          <p className="text-xs text-surface-400 line-clamp-1 max-w-sm mt-0.5">
                            {domain.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-surface-400">/{domain.slug}</td>
                    <td className="px-6 py-4">
                      <Badge variant={domain.status === 'published' ? 'success' : 'warning'}>
                        {domain.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(domain)}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-surface-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          disabled={isDeleting === domain._id}
                          onClick={() => handleDelete(domain._id, domain.name)}
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
        title={editingDomain ? 'Edit Domain' : 'Create New Domain'}
        description="Domains group multiple technologies and subject learning paths."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
              Domain Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Software Engineering"
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
                placeholder="software-engineering"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300 mb-1.5">
                Icon Identifier
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="e.g. Code, Cloud, Shield"
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
              placeholder="Describe this technology domain and the skills covered..."
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
              {editingDomain ? 'Save Changes' : 'Create Domain'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
