import React from 'react';

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', bg: 'bg-gray-100', text: 'text-gray-600' },
  validating: { label: 'Validating', bg: 'bg-blue-50', text: 'text-blue-600' },
  auto_verified: { label: 'Auto-Verified', bg: 'bg-blue-100', text: 'text-blue-700' },
  faculty_review: { label: 'Faculty Review', bg: 'bg-amber-50', text: 'text-amber-700' },
  forwarded_admin: { label: 'Forwarded to Admin', bg: 'bg-purple-50', text: 'text-purple-700' },
  awaiting_sanction: { label: 'Awaiting Sanction', bg: 'bg-orange-50', text: 'text-orange-700' },
  admin_review: { label: 'Admin Review', bg: 'bg-blue-50', text: 'text-blue-700' },
  approved: { label: 'Approved', bg: 'bg-green-50', text: 'text-green-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-600' },
  completion_in_progress: { label: 'Completion In Progress', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  completed: { label: 'Completed', bg: 'bg-green-100', text: 'text-green-800' },
};

export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-600' };
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${config.bg} ${config.text} ${padding}`}>
      {config.label}
    </span>
  );
}
