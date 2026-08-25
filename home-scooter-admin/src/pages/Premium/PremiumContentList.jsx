import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { premiumAdminApi } from '../../api/premiumAdminApi';
import { toast } from 'sonner';
import {
  FileText,
  Image as ImageIcon,
  Video,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Eye,
  Calendar,
  X,
  Upload,
} from 'lucide-react';

export const PremiumContentList = () => {
  const queryClient = useQueryClient();
  const [contentType, setContentType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  // Form State & Direct Upload Progress
  const [formData, setFormData] = useState({
    contentType: 'TEXT',
    title: '',
    description: '',
    mediaUrl: '',
    thumbnailUrl: '',
    displayOrder: 0,
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
    premiumOnly: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingDirect, setIsUploadingDirect] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['premiumAdminContent', contentType, search],
    queryFn: () => premiumAdminApi.getContentList({ contentType, search }),
  });

  const publishMutation = useMutation({
    mutationFn: (id) => premiumAdminApi.publishContent(id),
    onSuccess: () => {
      toast.success('Content published successfully!');
      queryClient.invalidateQueries(['premiumAdminContent']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to publish content'),
  });

  const unpublishMutation = useMutation({
    mutationFn: (id) => premiumAdminApi.unpublishContent(id),
    onSuccess: () => {
      toast.success('Content unpublished');
      queryClient.invalidateQueries(['premiumAdminContent']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to unpublish content'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => premiumAdminApi.deleteContent(id),
    onSuccess: () => {
      toast.success('Content deleted');
      queryClient.invalidateQueries(['premiumAdminContent']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete content'),
  });

  const saveMutation = useMutation({
    mutationFn: (dataToSend) => {
      if (editingContent) {
        return premiumAdminApi.updateContent(editingContent.contentId, dataToSend);
      }
      return premiumAdminApi.createContent(dataToSend);
    },
    onSuccess: () => {
      toast.success(editingContent ? 'Content updated successfully!' : 'Content created successfully!');
      setIsModalOpen(false);
      resetForm();
      queryClient.invalidateQueries(['premiumAdminContent']);
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || err.message || 'Failed to save content';
      toast.error(errMsg);
    },
  });

  const resetForm = () => {
    setEditingContent(null);
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploadingDirect(false);
    setFormData({
      contentType: 'TEXT',
      title: '',
      description: '',
      mediaUrl: '',
      thumbnailUrl: '',
      displayOrder: 0,
      startDate: '',
      endDate: '',
      status: 'ACTIVE',
      premiumOnly: true,
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingContent(item);
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploadingDirect(false);
    setFormData({
      contentType: item.contentType,
      title: item.title,
      description: item.description || '',
      mediaUrl: item.mediaUrl || '',
      thumbnailUrl: item.thumbnailUrl || '',
      displayOrder: item.displayOrder || 0,
      startDate: item.startDate ? new Date(item.startDate).toISOString().slice(0, 16) : '',
      endDate: item.endDate ? new Date(item.endDate).toISOString().slice(0, 16) : '',
      status: item.status,
      premiumOnly: item.premiumOnly,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    let finalMediaUrl = formData.mediaUrl;

    try {
      // Direct Client Upload to Cloudinary CDN if a file is selected
      if (selectedFile) {
        setIsUploadingDirect(true);
        setUploadProgress(0);

        // 1. Fetch signed upload params from backend
        const sigRes = await premiumAdminApi.getCloudinarySignature();
        const sigData = sigRes?.data || sigRes;
        const { cloudName, apiKey, timestamp, folder, signature } = sigData;

        if (!cloudName || !signature) {
          throw new Error('Failed to retrieve valid Cloudinary upload signature from backend');
        }

        // 2. Build Cloudinary FormData
        const cloudinaryData = new FormData();
        cloudinaryData.append('file', selectedFile);
        cloudinaryData.append('api_key', apiKey);
        cloudinaryData.append('timestamp', timestamp);
        cloudinaryData.append('signature', signature);
        cloudinaryData.append('folder', folder);

        const ext = selectedFile.name.split('.').pop().toLowerCase();
        const isVideoFile = formData.contentType === 'VIDEO' || /mp4|webm|mov|avi|mkv|3gp|m4v/.test(ext);
        const resourceType = isVideoFile ? 'video' : 'image';

        // 3. Perform Direct Upload to Cloudinary API with real-time progress tracking
        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
          cloudinaryData,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percent);
              }
            },
          }
        );

        if (uploadRes.data && uploadRes.data.secure_url) {
          finalMediaUrl = uploadRes.data.secure_url;
        } else {
          throw new Error('Cloudinary response did not contain a valid URL');
        }
      }

      // 4. Send light JSON metadata payload to backend API
      const payload = new FormData();
      payload.append('contentType', formData.contentType);
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('mediaUrl', finalMediaUrl);
      payload.append('thumbnailUrl', formData.thumbnailUrl);
      payload.append('displayOrder', formData.displayOrder);
      if (formData.startDate) payload.append('startDate', formData.startDate);
      if (formData.endDate) payload.append('endDate', formData.endDate);
      payload.append('status', formData.status);
      payload.append('premiumOnly', formData.premiumOnly);

      saveMutation.mutate(payload);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || err.message || 'Direct Cloudinary Upload Failed');
    } finally {
      setIsUploadingDirect(false);
    }
  };

  const contentItems = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            ⭐ Premium Content Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish and manage exclusive text posts, banner images, and video media for Premium Members.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Premium Content
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['ALL', 'TEXT', 'BANNER', 'VIDEO'].map((type) => (
            <button
              key={type}
              onClick={() => setContentType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                contentType === type
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'ALL' ? 'All Types' : type}
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
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : contentItems.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-sm font-semibold text-slate-600">No Premium Content found</p>
            <p className="text-xs text-slate-400">Click "Create Premium Content" to add your first post or banner.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Title & Preview</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Schedule Dates</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {contentItems.map((item) => (
                  <tr key={item.contentId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        item.contentType === 'VIDEO' ? 'bg-purple-100 text-purple-700' :
                        item.contentType === 'BANNER' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.contentType}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {item.contentId}</p>
                        {item.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-bold text-slate-800">{item.displayOrder}</td>

                    <td className="px-4 py-3 text-[11px] text-slate-500">
                      <div>Start: {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'Immediate'}</div>
                      <div>End: {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'No expiry'}</div>
                    </td>

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
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
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

      {/* Modal: Create / Edit Premium Content */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingContent ? 'Edit Premium Content' : 'Create New Premium Content'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Content Type</label>
                  <select
                    value={formData.contentType}
                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                  >
                    <option value="TEXT">TEXT (Important Text Update)</option>
                    <option value="BANNER">BANNER (Premium Banner Image)</option>
                    <option value="VIDEO">VIDEO (Exclusive Video Stream)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exclusive Market Insights & Rental Guide"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Article Body</label>
                <textarea
                  rows={4}
                  placeholder="Enter content description or text body..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                />
              </div>

              {formData.contentType !== 'TEXT' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Upload {formData.contentType === 'VIDEO' ? 'Video File' : 'Banner Image'}
                    </label>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      ☁️ Cloudinary CDN Enabled
                    </span>
                  </div>

                  <div>
                    <input
                      type="file"
                      accept={formData.contentType === 'VIDEO' ? 'video/mp4,video/webm,video/quicktime,video/x-msvideo,video/*' : 'image/*'}
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {formData.contentType === 'VIDEO'
                        ? 'Supported video formats: MP4, WEBM, MOV, AVI (Max 50MB). Automatically uploaded to Cloudinary Video CDN.'
                        : 'Supported image formats: JPG, PNG, WEBP, GIF. Automatically uploaded to Cloudinary Image CDN.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Or Direct Cloudinary / Stream URL
                    </label>
                    <input
                      type="url"
                      placeholder={formData.contentType === 'VIDEO' ? 'https://res.cloudinary.com/.../video.mp4' : 'https://res.cloudinary.com/.../image.jpg'}
                      value={formData.mediaUrl}
                      onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white focus:border-amber-500"
                    />
                  </div>

                  {/* Video URL Indicator for Admin Panel */}
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

                  {formData.contentType === 'BANNER' && formData.mediaUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 max-h-36 flex justify-center bg-slate-100">
                      <img
                        src={formData.mediaUrl}
                        alt="Banner Preview"
                        className="max-h-36 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Direct Upload Progress Bar */}
              {isUploadingDirect && (
                <div className="space-y-1.5 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  <div className="flex justify-between text-xs font-bold text-amber-900">
                    <span>🚀 Direct Cloudinary Upload in Progress...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-amber-700 font-medium">
                    Uploading file directly to Cloudinary CDN — bypassing VPS server limits.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.status === 'ACTIVE'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'ACTIVE' : 'DRAFT' })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  Publish Immediately (ACTIVE)
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isUploadingDirect || saveMutation.isPending}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingDirect || saveMutation.isPending}
                    className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUploadingDirect ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading ({uploadProgress}%)...
                      </>
                    ) : saveMutation.isPending ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : editingContent ? (
                      'Update Content'
                    ) : (
                      'Create Content'
                    )}
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
