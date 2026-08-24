import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { educationAdminApi } from '../../api/educationAdminApi';
import { toast } from 'sonner';
import {
  GraduationCap,
  Search,
  Filter,
  Download,
  Ban,
  CheckCircle,
  Eye,
  Edit,
  X,
  ShieldAlert,
} from 'lucide-react';

export const EducationStudentsList = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [educationLevel, setEducationLevel] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['educationStudents', search, educationLevel, status, page],
    queryFn: () => educationAdminApi.getStudents({ search, educationLevel, status, page, limit: 10 }),
  });

  const blockMutation = useMutation({
    mutationFn: ({ id, reason }) => educationAdminApi.blockStudent(id, { reason }),
    onSuccess: () => {
      toast.success('Student account blocked successfully');
      queryClient.invalidateQueries(['educationStudents']);
      setBlockModalOpen(false);
      setBlockReason('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to block student'),
  });

  const unblockMutation = useMutation({
    mutationFn: (id) => educationAdminApi.unblockStudent(id),
    onSuccess: () => {
      toast.success('Student account unblocked successfully');
      queryClient.invalidateQueries(['educationStudents']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to unblock student'),
  });

  const students = data?.data || [];
  const pagination = data?.pagination || {};

  const handleExportCsv = async () => {
    try {
      const res = await educationAdminApi.getStudents({ exportCsv: 'true' });
      const list = res.data || [];

      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Education ID,Full Name,Mobile,Email,Education Level,Standard,Course,Place,Status,Joined Date\n';

      list.forEach((s) => {
        csvContent += `"${s.educationStudentId}","${s.fullName}","${s.mobile}","${s.email || ''}","${s.educationLevel}","${s.classStandard || ''}","${s.course || ''}","${s.place || ''}","${s.status}","${new Date(s.createdAt).toLocaleDateString()}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `education_students_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Students directory CSV exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Education Student Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage registered students, filter by qualification, review Education IDs (EDU-2026-XXXXX), and manage access.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          Export CSV Directory
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 overflow-x-auto">
          <select
            value={educationLevel}
            onChange={(e) => {
              setEducationLevel(e.target.value);
              setPage(1);
            }}
            className="p-2 text-xs font-bold border border-slate-200 rounded-xl focus:border-indigo-500"
          >
            <option value="ALL">All Qualification Levels</option>
            <option value="10TH">10th Standard</option>
            <option value="11TH">11th Standard</option>
            <option value="12TH">12th Standard</option>
            <option value="DIPLOMA">Diploma</option>
            <option value="UG">Undergraduate (UG)</option>
            <option value="PG">Postgraduate (PG)</option>
            <option value="JOB_SEEKER">Job Seeker</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="p-2 text-xs font-bold border border-slate-200 rounded-xl focus:border-indigo-500"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="BLOCKED">Blocked Only</option>
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Name, Mobile, ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-sm font-semibold text-slate-600">No Education Students found</p>
            <p className="text-xs text-slate-400">Try adjusting your search criteria or qualification filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Education ID</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Mobile & Email</th>
                  <th className="px-4 py-3">Level / Course</th>
                  <th className="px-4 py-3">Place</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {students.map((student) => (
                  <tr key={student.educationStudentId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600">
                      {student.educationStudentId}
                    </td>

                    <td className="px-4 py-3 font-bold text-slate-900">{student.fullName}</td>

                    <td className="px-4 py-3">
                      <div>{student.mobile}</div>
                      {student.email && <div className="text-[10px] text-slate-400">{student.email}</div>}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        {student.educationLevel}
                      </span>
                      {student.course && <span className="ml-1 text-[10px] text-slate-500">({student.course})</span>}
                    </td>

                    <td className="px-4 py-3 text-slate-500">{student.place || 'N/A'}</td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        student.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                      {student.status === 'ACTIVE' ? (
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setBlockModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[11px] font-bold flex items-center gap-1 inline-flex"
                        >
                          <Ban className="w-3.5 h-3.5" /> Block
                        </button>
                      ) : (
                        <button
                          onClick={() => unblockMutation.mutate(student.educationStudentId)}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-[11px] font-bold flex items-center gap-1 inline-flex"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Unblock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Block Reason Modal */}
      {blockModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Block Student Account
              </h3>
              <button onClick={() => setBlockModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              You are about to block <strong>{selectedStudent.fullName}</strong> ({selectedStudent.educationStudentId}).
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mandatory Reason for Blocking *</label>
              <textarea
                rows={3}
                required
                placeholder="Specify violation or administrative reason..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setBlockModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!blockReason.trim() || blockMutation.isPending}
                onClick={() => blockMutation.mutate({ id: selectedStudent.educationStudentId, reason: blockReason })}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
              >
                {blockMutation.isPending ? 'Blocking...' : 'Confirm Block Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
