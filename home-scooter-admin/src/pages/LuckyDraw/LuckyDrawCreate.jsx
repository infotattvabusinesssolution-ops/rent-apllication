import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { luckyDrawAdminApi } from '../../api/luckyDrawAdminApi';
import { toast } from 'sonner';
import { Gift, ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const LuckyDrawCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    bannerImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200',
    thumbnailImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400',
    entryPrice: 99,
    currency: 'INR',
    maxEntries: 10000,
    maxEntriesPerUser: 5,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    drawDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    isFeatured: true,
    showOnHomepage: true,
  });

  const [rules, setRules] = useState([
    'Each paid entry gives one valid ticket.',
    'Maximum 5 entries allowed per user account.',
    'Winner is automatically selected by system algorithm upon closing.',
  ]);

  const [prizes, setPrizes] = useState([
    {
      title: 'First Prize - Bumper Reward',
      rank: 1,
      prizeType: 'CASH',
      prizeValue: 50000,
      quantity: 1,
      winnersRequired: 1,
    },
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddRule = () => {
    setRules((prev) => [...prev, '']);
  };

  const handleRuleChange = (index, value) => {
    const next = [...rules];
    next[index] = value;
    setRules(next);
  };

  const handleRemoveRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleAddPrize = () => {
    setPrizes((prev) => [
      ...prev,
      {
        title: `Prize Rank ${prev.length + 1}`,
        rank: prev.length + 1,
        prizeType: 'CASH',
        prizeValue: 5000,
        quantity: 1,
        winnersRequired: 1,
      },
    ]);
  };

  const handlePrizeChange = (index, field, value) => {
    const next = [...prizes];
    next[index][field] = value;
    setPrizes(next);
  };

  const handleRemovePrize = (index) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.entryPrice || !formData.maxEntries) {
      toast.error('Please fill in all required draw details.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await luckyDrawAdminApi.createDraw({
        ...formData,
        rules: rules.filter((r) => r.trim() !== ''),
      });

      const drawId = res.data._id;

      // Create initial prizes
      for (const p of prizes) {
        if (p.title) {
          await luckyDrawAdminApi.createPrize(drawId, p);
        }
      }

      toast.success('Lucky Draw campaign created successfully!');
      navigate(`/lucky-draw/${drawId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to create draw');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/lucky-draw')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Create New Lucky Draw Campaign</h1>
          <p className="text-xs text-slate-500">Configure entry prices, schedules, rules, and prizes.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Basic Information</h2>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Draw Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Win ₹50,000 Electric Scooter Bumper Draw"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Brief slogan or highlight"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Banner Image URL</label>
              <input
                type="text"
                name="bannerImage"
                value={formData.bannerImage}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Entry Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Entry & Pricing Configuration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Entry Price (₹) *</label>
              <input
                type="number"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Maximum Total Entries *</label>
              <input
                type="number"
                name="maxEntries"
                value={formData.maxEntries}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Entries Per User *</label>
              <input
                type="number"
                name="maxEntriesPerUser"
                value={formData.maxEntriesPerUser}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Timeline Schedule</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date & Time *</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Date & Time *</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Draw Date & Time *</label>
              <input
                type="datetime-local"
                name="drawDate"
                value={formData.drawDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Prizes Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Configured Prizes</h2>
            <button
              type="button"
              onClick={handleAddPrize}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Prize
            </button>
          </div>

          {prizes.map((prize, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-800">Prize Rank #{prize.rank}</span>
                {prizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePrize(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Prize Title"
                  value={prize.title}
                  onChange={(e) => handlePrizeChange(idx, 'title', e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="number"
                  placeholder="Prize Value (₹)"
                  value={prize.prizeValue}
                  onChange={(e) => handlePrizeChange(idx, 'prizeValue', Number(e.target.value))}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <select
                  value={prize.prizeType}
                  onChange={(e) => handlePrizeChange(idx, 'prizeType', e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="CASH">CASH</option>
                  <option value="PRODUCT">PRODUCT</option>
                  <option value="SCOOTER">SCOOTER</option>
                  <option value="VOUCHER">VOUCHER</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/lucky-draw')}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSubmitting ? 'Creating Draw...' : 'Create & Save Lucky Draw'}
          </button>
        </div>
      </form>
    </div>
  );
};
