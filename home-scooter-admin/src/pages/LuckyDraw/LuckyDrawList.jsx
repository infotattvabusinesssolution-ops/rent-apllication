import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { luckyDrawAdminApi } from '../../api/luckyDrawAdminApi';
import { Gift, Plus, Search, Filter, Eye, Tag } from 'lucide-react';

export const LuckyDrawList = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: drawsData, isLoading } = useQuery({
    queryKey: ['adminLuckyDrawList', selectedStatus, searchTerm],
    queryFn: () =>
      luckyDrawAdminApi.getDraws({
        status: selectedStatus || undefined,
        search: searchTerm || undefined,
      }),
  });

  const draws = drawsData?.data || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Gift className="w-7 h-7 text-purple-600" />
            All Lucky Draw Campaigns
          </h1>
          <p className="text-xs text-slate-500 mt-1">View, filter, edit and execute lucky draws.</p>
        </div>

        <Link
          to="/lucky-draw/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-xs hover:bg-purple-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create New Draw
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by draw title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
            <option value="WINNER_SELECTED">Winner Selected</option>
            <option value="VERIFIED">Verified</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Draws Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm">Loading campaigns...</div>
        ) : draws.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm">
            No lucky draws match your selected filters.
          </div>
        ) : (
          draws.map((draw) => (
            <div
              key={draw._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-40 bg-slate-100">
                {draw.bannerImage || draw.thumbnailImage ? (
                  <img
                    src={draw.bannerImage || draw.thumbnailImage}
                    alt={draw.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-purple-700 to-indigo-600 text-white font-bold text-lg">
                    {draw.title}
                  </div>
                )}
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-slate-800 shadow-xs">
                  ₹{draw.entryPrice} / Entry
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-purple-900/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase">
                  {draw.status}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{draw.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{draw.shortDescription || 'No description'}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Entries Sold:</span>
                    <span className="font-bold text-purple-700">
                      {draw.totalEntries} / {draw.maxEntries}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.round((draw.totalEntries / draw.maxEntries) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                    <span>Prizes: {draw.prizeCount || 0} configured</span>
                    <span>Ends: {new Date(draw.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/lucky-draw/${draw._id}`)}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Manage & View Draw
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
