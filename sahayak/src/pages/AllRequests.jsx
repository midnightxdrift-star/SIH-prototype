import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/ui/StatusBadge';
import ImportanceBadge from '../components/ui/ImportanceBadge';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AllRequests() {
  const { scholarships, fundRequests, activeRequests, historyRequests } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | history

  const allItems = [
    ...scholarships.map(s => ({
      id: s.id,
      name: `${s.studentName} — ${s.scholarshipName}`,
      type: 'Scholarship Verification',
      importance: 'moderate',
      status: s.status,
      date: s.submittedDate,
      actor: s.status === 'faculty_review' ? 'Faculty / HOD' : s.status === 'admin_review' ? 'Administration' : '—',
      link: '/scholarship',
    })),
    ...fundRequests.map(r => ({
      id: r.id,
      name: r.item,
      type: 'Smart Fund Sanctioning',
      importance: 'high',
      status: r.status,
      date: r.submittedDate,
      actor: r.status === 'faculty_review' ? 'Faculty / HOD'
        : r.status === 'awaiting_sanction' ? 'Administration'
        : r.status === 'completion_in_progress' ? 'Requester'
        : '—',
      link: '/fund-sanctioning',
      priority: r.priorityScore,
    })),
  ];

  const filtered = allItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
      || item.id.toLowerCase().includes(search.toLowerCase())
      || item.type.toLowerCase().includes(search.toLowerCase());
    const isActive = !['rejected', 'completed'].includes(item.status);
    const matchFilter = filter === 'all' ? true
      : filter === 'active' ? isActive
      : filter === 'history' ? !isActive
      : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">All Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">{allItems.length} total · {activeRequests.length} active</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by name, ID or type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {[['all', 'All'], ['active', 'Active'], ['history', 'History']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === val
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Request</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Importance</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">With</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              {/* Priority col */}
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                  No requests found.
                </td>
              </tr>
            ) : (
              filtered.map(item => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs font-mono text-gray-500">{item.id}</td>
                  <td className="px-5 py-3">
                    <Link to={item.link} className="text-sm font-medium text-gray-900 hover:text-brand-600 transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-400">{item.type}</p>
                  </td>
                  <td className="px-5 py-3">
                    <ImportanceBadge level={item.importance} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{item.actor}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{item.date}</td>
                  <td className="px-5 py-3">
                    {item.priority !== undefined ? (
                      <span className={`text-sm font-bold ${
                        item.priority >= 80 ? 'text-red-600'
                        : item.priority >= 60 ? 'text-amber-600'
                        : 'text-green-600'
                      }`}>{item.priority}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Rejection notice */}
      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-2.5">
        <span className="w-2 h-2 rounded-full bg-red-300" />
        Rejected requests are automatically removed from the active workflow and preserved in History.
      </div>
    </div>
  );
}
