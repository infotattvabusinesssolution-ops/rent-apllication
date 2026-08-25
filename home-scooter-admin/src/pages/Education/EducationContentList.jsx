import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { educationAdminApi } from '../../api/educationAdminApi';
import { toast } from 'sonner';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Video,
  FileText,
  Image,
  Link,
  Award,
  GraduationCap,
  Briefcase,
  Bell,
  Building,
} from 'lucide-react';

const CATEGORIES = [
  { key: 'ALL', label: 'All Categories' },
  { key: 'EDUCATION_UPDATE', label: 'Education Updates' },
  { key: 'COURSE', label: 'Featured Courses' },
  { key: 'ADMISSION', label: 'Admissions' },
  { key: 'CAREER', label: 'Career Opportunities' },
  { key: 'EXAM', label: 'Exams' },
  { key: 'SCHOLARSHIP', label: 'Scholarships' },
  { key: 'ANNOUNCEMENT', label: 'Announcements' },
];

export const EducationContentList = () => {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('ALL');
  const [contentType, setContentType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  const [formData, setFormData] = useState({
    category: 'EDUCATION_UPDATE',
    contentType: 'TEXT',
    title: '',
    shortDescription: '',
    description: '',
    displayOrder: 0,
    targetAudience: 'ALL',
    externalUrl: '',
    mediaUrl: '',
    documentUrl: '',
    status: 'DRAFT',
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['educationContent', category, contentType, search],
    queryFn: () => educationAdminApi.getContentList({ category, contentType, search }),
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => {
      if (editingContent) {
        return educationAdminApi.updateContent(editingContent.contentId, payload);
      }
      return educationAdminApi.createContent(payload);
    },
    onSuccess: () => {
      toast.success(editingContent ? 'Content updated successfully' : 'Content created successfully');
      queryClient.invalidateQueries(['educationContent']);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save content'),
  });

  const publishMutation = useMutation({
    mutationFn: (id) => educationAdminApi.publishContent(id),
    onSuccess: () => {
      toast.success('Content published (ACTIVE)');
      queryClient.invalidateQueries(['educationContent']);
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id) => educationAdminApi.unpublishContent(id),
    onSuccess: () => {
      toast.success('Content unpublished (INACTIVE)');
      queryClient.invalidateQueries(['educationContent']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => educationAdminApi.deleteContent(id),
    onSuccess: () => {
      toast.success('Content deleted');
      queryClient.invalidateQueries(['educationContent']);
    },
  });

  const resetForm = () => {
    setEditingContent(null);
    setSelectedFile(null);
    setFormData({
      category: 'EDUCATION_UPDATE',
      contentType: 'TEXT',
      title: '',
      shortDescription: '',
      description: '',
      displayOrder: 0,
      targetAudience: 'ALL',
      externalUrl: '',
      mediaUrl: '',
      documentUrl: '',
      status: 'DRAFT',
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingContent(item);
    setSelectedFile(null);
    setFormData({
      category: item.category || 'EDUCATION_UPDATE',
      contentType: item.contentType || 'TEXT',
      title: item.title || '',
      shortDescription: item.shortDescription || '',
      description: item.description || '',
      displayOrder: item.displayOrder || 0,
      targetAudience: item.targetAudience || 'ALL',
      externalUrl: item.externalUrl || '',
      mediaUrl: item.mediaUrl || '',
      documentUrl: item.documentUrl || '',
      status: item.status || 'DRAFT',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        payload.append(key, formData[key]);
      }
    });

    if (selectedFile) {
      payload.append('media', selectedFile);
    }

    saveMutation.mutate(payload);
  };

  const contentItems = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Education Content Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish educational updates, courses, admissions, career options, exam alerts, videos, and PDF documents.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Educational Content
        </button>
      </div>

      {/* Category Pill Tabs & Search */}
      <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                category === cat.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {['ALL', 'TEXT', 'BANNER', 'VIDEO', 'DOCUMENT', 'LINK'].map((type) => (
              <button
                key={type}
                onClick={() => setContentType(type)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  contentType === type ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search content by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : contentItems.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-sm font-semibold text-slate-600">No Content found for selected filters</p>
            <p className="text-xs text-slate-400">Click "Create Educational Content" to publish your first post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Category / Type</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Audience</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {contentItems.map((item) => (
                  <tr key={item.contentId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 block w-fit">
                          {item.category?.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold block w-fit ${
                          item.contentType === 'VIDEO' ? 'bg-purple-100 text-purple-700' :
                          item.contentType === 'DOCUMENT' ? 'bg-amber-100 text-amber-700' :
                          item.contentType === 'BANNER' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.contentType}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {item.contentId}</p>
                      {item.shortDescription && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.shortDescription}</p>
                      )}
                    </td>

                    <td className="px-4 py-3 font-bold text-slate-600">{item.targetAudience}</td>

                    <td className="px-4 py-3 font-black text-indigo-600">{item.viewsCount || 0}</td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                      {item.status === 'ACTIVE' ? (
                        <button
                          onClick={() => unpublishMutation.mutate(item.contentId)}
                          className="px-2.5 py-1 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-[11px] font-bold"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => publishMutation.mutate(item.contentId)}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-[11px] font-bold"
                        >
                          Publish
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this content?')) {
                            deleteMutation.mutate(item.contentId);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create / Edit Educational Content */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingContent ? 'Edit Educational Content' : 'Create New Educational Content'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                  >
                    <option value="EDUCATION_UPDATE">Education Update</option>
                    <option value="COURSE">Featured Course</option>
                    <option value="ADMISSION">Admission Alert</option>
                    <option value="CAREER">Career Opportunity</option>
                    <option value="EXAM">Exam Notification</option>
                    <option value="SCHOLARSHIP">Scholarship Alert</option>
                    <option value="ANNOUNCEMENT">Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Content Format *</label>
                  <select
                    value={formData.contentType}
                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                  >
                    <option value="TEXT">TEXT (Article / Update)</option>
                    <option value="BANNER">BANNER (Image Poster)</option>
                    <option value="VIDEO">VIDEO (Cloudinary Stream)</option>
                    <option value="DOCUMENT">DOCUMENT (PDF File)</option>
                    <option value="LINK">LINK (External Portal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CBSE 12th Board Exam Schedule 2026 Released"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                  >
                    <option value="ALL">All Students</option>
                    <option value="10TH">10th Standard</option>
                    <option value="11TH">11th Standard</option>
                    <option value="12TH">12th Standard</option>
                    <option value="DIPLOMA">Diploma Students</option>
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="JOB_SEEKER">Job Seekers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary</label>
                <input
                  type="text"
                  placeholder="Brief 1-line headline summary..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Body / Article Content</label>
                <textarea
                  rows={4}
                  placeholder="Enter full body text..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-indigo-500"
                />
              </div>

              {/* Dynamic File / Link Input */}
              {formData.contentType !== 'TEXT' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Upload {formData.contentType} File
                    </label>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      ☁️ Cloudinary CDN Direct
                    </span>
                  </div>

                  {formData.contentType !== 'LINK' && (
                    <div>
                      <input
                        type="file"
                        accept={
                          formData.contentType === 'VIDEO'
                            ? 'video/*'
                            : formData.contentType === 'DOCUMENT'
                            ? '.pdf,.doc,.docx'
                            : 'image/*'
                        }
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                  )}

                  {formData.contentType === 'LINK' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">External Portal URL</label>
                      <input
                        type="url"
                        placeholder="https://example-education-portal.gov.in"
                        value={formData.externalUrl}
                        onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white focus:border-indigo-500"
                      />
                    </div>
                  )}

                  {formData.contentType === 'VIDEO' && formData.mediaUrl && (
                    <div className="mt-2 p-2.5 rounded-lg border border-purple-200 bg-purple-50 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-purple-900 truncate">
                        <Video className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="truncate">{formData.mediaUrl}</span>
                      </div>
                      <a
                        href={formData.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] rounded-md shrink-0 transition-colors"
                      >
                        Open Link ↗
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.status === 'ACTIVE'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'ACTIVE' : 'DRAFT' })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  Publish Immediately (ACTIVE)
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md flex items-center gap-2"
                  >
                    {saveMutation.isPending ? 'Uploading to Cloudinary...' : editingContent ? 'Update Content' : 'Create Content'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
