import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap, User, Shield } from 'lucide-react';

const ACTION_LABELS = {
  PRIORITY_SCORED: 'Priority Scored',
  FORWARDED_TO_FACULTY: 'Forwarded to Faculty',
  FACULTY_VERIFIED: 'Faculty Verified',
  FORWARDED_TO_ADMIN: 'Forwarded to Administration',
  REJECTED: 'Rejected',
  SANCTIONED: 'Sanctioned',
  COMPLETED: 'Completed',
  INFO_REQUESTED: 'Info Requested',
  APPROVED: 'Approved',
};

const ACTION_COLORS = {
  SANCTIONED: 'text-green-600 bg-green-50 border-green-200',
  COMPLETED: 'text-green-700 bg-green-100 border-green-300',
  APPROVED: 'text-green-600 bg-green-50 border-green-200',
  REJECTED: 'text-red-600 bg-red-50 border-red-200',
  FORWARDED_TO_ADMIN: 'text-brand-600 bg-brand-50 border-brand-200',
  FACULTY_VERIFIED: 'text-amber-600 bg-amber-50 border-amber-200',
  PRIORITY_SCORED: 'text-blue-600 bg-blue-50 border-blue-200',
  FORWARDED_TO_FACULTY: 'text-blue-600 bg-blue-50 border-blue-200',
  INFO_REQUESTED: 'text-gray-600 bg-gray-50 border-gray-200',
};

function ActivityEntry({ item }) {
  const actionColor = ACTION_COLORS[item.action] || 'text-gray-600 bg-gray-50 border-gray-200';
  const RoleIcon = item.actorRole === 'automated' ? Zap
    : item.actorRole === 'admin' ? Shield
    : User;
  const roleColor = item.actorRole === 'automated' ? 'text-blue-500 bg-blue-50'
    : item.actorRole === 'admin' ? 'text-red-500 bg-red-50'
    : 'text-amber-600 bg-amber-50';

  return (
    <div className="flex gap-4 pb-5">
      {/* Icon */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${roleColor}`}>
        <RoleIcon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge border text-xs ${actionColor}`}>
            {ACTION_LABELS[item.action] || item.action}
          </span>
          <span className="text-xs text-gray-400">{item.relativeTime}</span>
        </div>
        <p className="text-sm text-gray-800 mt-1">{item.message}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">{item.actor}</span>
          <span className="text-gray-200">·</span>
          <span className="text-xs font-mono text-gray-400">{item.requestId}</span>
        </div>
      </div>
    </div>
  );
}

export default function ActivityFeed() {
  const { activity } = useApp();

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="page-title">Activity Feed</h1>
        <p className="text-sm text-gray-500 mt-0.5">Live audit trail of all workflow events and state changes</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
            <Zap className="w-3 h-3 text-blue-500" />
          </div>
          System / Automated
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center">
            <User className="w-3 h-3 text-amber-500" />
          </div>
          Faculty
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center">
            <Shield className="w-3 h-3 text-red-500" />
          </div>
          Administration
        </div>
      </div>

      <div className="card p-6">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
          <div className="space-y-0">
            {activity.map(item => (
              <ActivityEntry key={item.id} item={item} />
            ))}
          </div>
        </div>

        {activity.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No activity yet.</p>
        )}
      </div>
    </div>
  );
}
