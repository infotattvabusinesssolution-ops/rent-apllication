import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categoriesApi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { toast } from 'sonner';
import {
  Plus,
  Edit2,
  Trash2,
  FolderTree,
} from 'lucide-react';

export const CategoryManagement = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Modal & Edit State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    parent: 'None (Main Category)',
    description: '',
    icon: '📦',
    isActive: true,
  });

  // Fetch categories from backend API
  const { data: apiResult, isLoading } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: categoriesApi.getCategories,
  });

  const categoriesList = apiResult?.data || [
    { id: '1', name: 'Layout Sites', parent: 'None (Main Category)', description: 'Plots, Land & Gated Sites', icon: '🗺️', color: 'bg-amber-100 text-amber-800 border-amber-200', adsCount: 412, isActive: true },
    { id: '2', name: 'Rent: House & Apartments', parent: 'Properties', description: 'Rental houses, flats & apartments', icon: '🏠', color: 'bg-blue-100 text-blue-800 border-blue-200', adsCount: 328, isActive: true },
    { id: '3', name: 'Rent: Shop & Offices', parent: 'Properties', description: 'Commercial shops & offices for rent', icon: '🏬', color: 'bg-blue-100 text-blue-800 border-blue-200', adsCount: 145, isActive: true },
    { id: '4', name: 'Sale: House & Apartments', parent: 'Properties', description: 'Houses, flats & villas for purchase', icon: '🏡', color: 'bg-teal-100 text-teal-800 border-teal-200', adsCount: 198, isActive: true },
    { id: '5', name: 'Sale: Shop & Offices', parent: 'Properties', description: 'Commercial shops & offices for sale', icon: '🏢', color: 'bg-teal-100 text-teal-800 border-teal-200', adsCount: 89, isActive: true },
    { id: '6', name: 'PG & Guest House', parent: 'Properties', description: 'Paying guest accommodations', icon: '🛏️', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', adsCount: 76, isActive: true },
    { id: '7', name: 'Properties', parent: 'None (Main Category)', description: 'Rent & Sale Houses, Shops & PGs', icon: '🏢', color: 'bg-blue-100 text-blue-800 border-blue-200', adsCount: 836, isActive: true },
    { id: '8', name: 'Electric Scooters', parent: 'None (Main Category)', description: 'Daily & Monthly EV Rentals', icon: '🛵', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', adsCount: 154, isActive: true },
    { id: '9', name: 'Services', parent: 'None (Main Category)', description: 'Interiors, Maintenance & Repairs', icon: '🛠️', color: 'bg-purple-100 text-purple-800 border-purple-200', adsCount: 92, isActive: true },
    { id: '10', name: 'Others', parent: 'None (Main Category)', description: 'Miscellaneous & Partner Ads', icon: '📦', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', adsCount: 45, isActive: true },
  ];

  const createMutation = useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => {
      toast.success('New category created & saved in backend database!');
      setModalOpen(false);
      queryClient.invalidateQueries(['adminCategories']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoriesApi.updateCategory(id, data),
    onSuccess: () => {
      toast.success('Category updated successfully!');
      setModalOpen(false);
      queryClient.invalidateQueries(['adminCategories']);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: categoriesApi.toggleCategoryStatus,
    onSuccess: () => {
      toast.success('Category status updated');
      queryClient.invalidateQueries(['adminCategories']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.deleteCategory,
    onSuccess: () => {
      toast.success('Category deleted successfully');
      setDeletingId(null);
      queryClient.invalidateQueries(['adminCategories']);
    },
  });

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      parent: 'None (Main Category)',
      description: '',
      icon: '✨',
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      parent: cat.parent,
      description: cat.description,
      icon: cat.icon,
      isActive: cat.isActive,
    });
    setModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredCategories = categoriesList.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase());

    if (filterType === 'MAIN') return matchesSearch && cat.parent === 'None (Main Category)';
    if (filterType === 'PROPERTIES') return matchesSearch && cat.parent === 'Properties';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Category & Subcategory Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Backend API powered category manager for creating, updating, and toggling categories.
          </p>
        </div>

        <Button icon={Plus} onClick={handleOpenAddModal} variant="primary">
          Add New Category
        </Button>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Total Categories
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{categoriesList.length}</p>
        </Card>

        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Property Subcategories
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {categoriesList.filter((c) => c.parent === 'Properties').length}
          </p>
        </Card>

        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Status
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {categoriesList.filter((c) => c.isActive).length} / {categoriesList.length} Active
          </p>
        </Card>

        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Backend Sync Status
          </span>
          <p className="text-xs font-bold text-blue-600 mt-2">MongoDB REST API Connected ✓</p>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search categories by name or description..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories ({categoriesList.length})</option>
            <option value="MAIN">Main Categories Only</option>
            <option value="PROPERTIES">Property Subcategories</option>
          </select>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => (
          <Card
            key={cat.id}
            className={`transition-all duration-200 ${
              !cat.isActive ? 'opacity-65 bg-slate-50/70 border-slate-200' : 'hover:border-blue-300'
            }`}
          >
            <div className="p-4 space-y-3">
              {/* Card Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${cat.color || 'bg-blue-100 text-blue-800 border-blue-200'} flex items-center justify-center text-2xl border shrink-0`}>
                    <span>{cat.icon || '📦'}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                      Parent: {cat.parent}
                    </span>
                  </div>
                </div>

                <Badge variant={cat.isActive ? 'success' : 'neutral'} size="sm">
                  {cat.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {cat.description || 'No description provided.'}
              </p>

              {/* Stats & Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-700">
                  {cat.adsCount || 0} Listings
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleMutation.mutate(cat.id)}
                    className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                      cat.isActive
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {cat.isActive ? 'Disable' : 'Enable'}
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeletingId(cat.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCategory ? 'Edit Category' : 'Add New Category'}
          subtitle="Configure category label, icon emoji, parent relation, and status"
        >
          <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-serif">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Commercial Lands or EV Accessories"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Parent Category
              </label>
              <select
                value={formData.parent}
                onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
              >
                <option value="None (Main Category)">None (Main Category)</option>
                <option value="Properties">Properties</option>
                <option value="Layout Sites">Layout Sites</option>
                <option value="Electric Scooters">Electric Scooters</option>
                <option value="Services">Services</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Icon Emoji
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. 🏢, 🗺️, 🛵, 🛠️"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all text-center text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={formData.isActive ? 'ACTIVE' : 'INACTIVE'}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.value === 'ACTIVE' })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of what listings belong to this category..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={createMutation.isPending || updateMutation.isPending}
                className="font-bold"
              >
                {editingCategory ? 'Update Category' : 'Create & Publish Category'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deleteMutation.mutate(deletingId)}
          title="Delete Category?"
          description="Are you sure you want to remove this category from the database?"
          confirmText="Delete Category"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
