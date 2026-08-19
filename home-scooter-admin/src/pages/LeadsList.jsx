import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../api/leadsApi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDateTime } from '../utils/formatters';
import { toast } from 'sonner';
import { PhoneCall, Download, CheckCircle2, Clock } from 'lucide-react';

export const LeadsList = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const { data: result, isLoading } = useQuery({
    queryKey: ['leads', statusFilter, search],
    queryFn: () => leadsApi.getLeads({ status: statusFilter, search }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => leadsApi.updateLeadStatus(id, status),
    onSuccess: () => {
      toast.success('Lead status updated');
      queryClient.invalidateQueries(['leads']);
    },
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await leadsApi.exportLeads();
      toast.success('Callback leads CSV file exported successfully!');
    } catch (e) {
      toast.error('Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };

  const leads = result?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Callback Leads</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track callback requests initiated by marketplace buyers to ad posters.
          </p>
        </div>

        <Button icon={Download} onClick={handleExport} isLoading={isExporting} variant="outline">
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Total Buyer Leads</span>
          <p className="text-2xl font-black text-slate-900 mt-1">3,824</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leads Today</span>
          <p className="text-2xl font-black text-slate-900 mt-1">42</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">This Week</span>
          <p className="text-2xl font-black text-slate-900 mt-1">284</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversion Rate</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">68.4%</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by ad title, buyer, seller, phone..." className="w-full sm:w-80" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg"
        >
          <option value="ALL">All Lead Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Converted">Converted</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <Card>
          <Skeleton className="h-64" />
        </Card>
      ) : leads.length === 0 ? (
        <EmptyState
          icon={PhoneCall}
          title="No callback leads found"
          description="Callback inquiries submitted by buyers will be recorded here."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Ad Title / ID</th>
                  <th className="py-3 px-4">Poster Info</th>
                  <th className="py-3 px-4">Buyer Info</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <span className="text-[10px] font-bold text-blue-600">#{lead.adId}</span>
                      <p className="font-bold text-slate-900 truncate">{lead.adTitle}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{lead.posterName}</p>
                      <p className="text-[11px] text-slate-500">{lead.posterPhone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{lead.buyerName}</p>
                      <p className="text-[11px] text-blue-600 font-semibold">{lead.buyerPhone}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{lead.location}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDateTime(lead.timestamp)}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          lead.status === 'New'
                            ? 'warning'
                            : lead.status === 'Converted'
                            ? 'success'
                            : lead.status === 'Contacted'
                            ? 'primary'
                            : 'neutral'
                        }
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({ id: lead.id, status: e.target.value })
                        }
                        className="px-2 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
