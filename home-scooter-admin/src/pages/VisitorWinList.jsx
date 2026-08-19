import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitorWinApi } from '../api/visitorWinApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatDateTime } from '../utils/formatters';
import { toast } from 'sonner';
import { Award, Download, Trash2 } from 'lucide-react';

export const VisitorWinList = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const { data: result, isLoading } = useQuery({
    queryKey: ['visitorWin', search],
    queryFn: () => visitorWinApi.getRegistrations({ search }),
  });

  const deleteMutation = useMutation({
    mutationFn: visitorWinApi.deleteRegistration,
    onSuccess: () => {
      toast.success('Registration deleted');
      setDeletingId(null);
      queryClient.invalidateQueries(['visitorWin']);
    },
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await visitorWinApi.exportVisitorWin();
      toast.success('Visitor Win registrations exported as CSV!');
    } catch (e) {
      toast.error('Failed to export registrations');
    } finally {
      setIsExporting(false);
    }
  };

  const list = result?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Visitor Win Registrations</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage visitor contest participation, inquiries & rewards program registrations.
            </p>
          </div>
        </div>

        <Button icon={Download} onClick={handleExport} isLoading={isExporting} variant="outline">
          Export Registrations CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">Total Registrations</span>
          <p className="text-2xl font-black text-slate-900 mt-1">1,420</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today</span>
          <p className="text-2xl font-black text-slate-900 mt-1">18</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">This Week</span>
          <p className="text-2xl font-black text-slate-900 mt-1">124</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">This Month</span>
          <p className="text-2xl font-black text-slate-900 mt-1">450</p>
        </Card>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search name, phone, place, subject..." className="max-w-md" />

      {/* Table */}
      {isLoading ? (
        <Card>
          <Skeleton className="h-64" />
        </Card>
      ) : list.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Visitor Win Registrations"
          description="Contest participant submissions will be displayed in this view."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Visitor Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Place / City</th>
                  <th className="py-3 px-4">Age</th>
                  <th className="py-3 px-4">Subject / Inquiry</th>
                  <th className="py-3 px-4">Registered At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{item.phone}</td>
                    <td className="py-3 px-4 text-slate-700">{item.place}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.age} yrs</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{item.subject}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDateTime(item.registrationDate)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => setDeletingId(item.id)}
                        icon={Trash2}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deleteMutation.mutate(deletingId)}
          title="Delete Registration Entry?"
          description="Are you sure you want to remove this Visitor Win entry?"
          confirmText="Delete Entry"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
