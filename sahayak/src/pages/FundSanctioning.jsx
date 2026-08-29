import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useRole, ROLES } from '../context/RoleContext';
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown, TrendingUp, IndianRupee, Users, Zap, Info, Send, Check } from 'lucide-react';
import ImportanceBadge from '../components/ui/ImportanceBadge';
import StatusBadge from '../components/ui/StatusBadge';
import WorkflowTimeline from '../components/ui/WorkflowTimeline';

function PriorityBar({ score }) {
  const color = score >= 80 ? 'bg-red-500' : score >= 60 ? 'bg-amber-500' : 'bg-green-500';
  const label = score >= 80 ? 'HIGH' : score >= 60 ? 'MODERATE' : 'LOW';
  const labelColor = score >= 80 ? 'text-red-600' : score >= 60 ? 'text-amber-600' : 'text-green-600';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold ${labelColor} w-20 text-right`}>{score}/100 · {label}</span>
    </div>
  );
}

function RequestCard({ req, selected, onSelect }) {
  const isRejected = req.status === 'rejected';
  const isCompleted = req.status === 'completed';

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left card card-hover p-4 transition-all ${
        selected ? 'ring-2 ring-brand-400 border-brand-200' : ''
      } ${isRejected ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{req.item}</p>
          <p className="text-xs text-gray-500">{req.requestorName}</p>
        </div>
        <StatusBadge status={req.status} size="sm" />
      </div>
      <div className="mb-2">
        <PriorityBar score={req.priorityScore} />
      </div>
      <p className="text-xs font-semibold text-gray-600">₹{req.estimatedCost.toLocaleString('en-IN')}</p>
    </button>
  );
}

function ChecklistItem({ label, done, onToggle, canToggle }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <button
        onClick={canToggle && !done ? onToggle : undefined}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
          done
            ? 'bg-green-500 border-green-500'
            : canToggle
            ? 'border-gray-300 hover:border-brand-400 cursor-pointer'
            : 'border-gray-200 cursor-default'
        }`}
      >
        {done && <Check className="w-3 h-3 text-white" />}
      </button>
      <span className={`text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{label}</span>
    </div>
  );
}

function ActionModal({ title, onSubmit, onClose }) {
  const [note, setNote] = useState('');
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
        <textarea
          className="input h-24 resize-none mb-4"
          placeholder="Add remarks (optional)..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={() => onSubmit(note)} className="btn-primary">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function FundSanctioning() {
  const { fundRequests, facultyReviewFund, adminSanctionFund, updateChecklistItem } = useApp();
  const { role } = useRole();
  const [selectedId, setSelectedId] = useState(fundRequests[0]?.id);
  const [modal, setModal] = useState(null);

  const sorted = [...fundRequests].sort((a, b) => {
    if (a.status === 'rejected' && b.status !== 'rejected') return 1;
    if (b.status === 'rejected' && a.status !== 'rejected') return -1;
    return b.priorityScore - a.priorityScore;
  });

  const current = fundRequests.find(r => r.id === selectedId) || fundRequests[0];

  const checklistLabels = {
    approvalRecorded: 'Approval recorded',
    purchaseOrderGenerated: 'Purchase order generated',
    vendorSelected: 'Vendor selected',
    purchaseCompleted: 'Purchase completed',
    equipmentReceived: 'Equipment received / delivered',
    inventoryUpdated: 'Inventory updated',
    requesterConfirmed: 'Requester confirmed receipt',
  };

  const handleFacultyAction = (action) => {
    setModal({
      title: action === 'APPROVE' ? 'Forward to Administration' : 'Reject Fund Request',
      onSubmit: (note) => {
        facultyReviewFund(current.id, action, note || (action === 'APPROVE' ? 'Recommended for administration review.' : 'Rejected by faculty.'));
        setModal(null);
      },
    });
  };

  const handleAdminAction = (decision) => {
    setModal({
      title: decision === 'APPROVE' ? 'Sanction Fund Request' : 'Reject Fund Request',
      onSubmit: (note) => {
        adminSanctionFund(current.id, decision, note || (decision === 'APPROVE' ? 'Sanctioned.' : 'Rejected.'));
        setModal(null);
      },
    });
  };

  const activeRequests = fundRequests.filter(r => !['rejected', 'completed'].includes(r.status));
  const sanctionedTotal = fundRequests
    .filter(r => r.status === 'completed' || r.adminDecision === 'APPROVED')
    .reduce((acc, r) => acc + r.estimatedCost, 0);

  return (
    <div className="max-w-6xl mx-auto">
      {modal && (
        <ActionModal
          title={modal.title}
          onSubmit={modal.onSubmit}
          onClose={() => setModal(null)}
        />
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="page-title">Smart Fund Sanctioning</h1>
            <ImportanceBadge level="high" />
          </div>
          <p className="text-sm text-gray-500">Priority-based institutional resource requests with higher-authority sanctioning</p>
        </div>
      </div>

      {/* System explanation */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          <p className="text-sm text-red-800">
            <span className="font-semibold">High Importance:</span> The system automatically scores and ranks requests by priority. Only the Dean / Administration can perform the final sanctioning. Approval triggers a completion checklist — a request is COMPLETED only after all steps are done.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="label">Active Requests</p>
          <p className="text-2xl font-bold text-gray-900">{activeRequests.length}</p>
        </div>
        <div className="card p-4">
          <p className="label">High Priority</p>
          <p className="text-2xl font-bold text-red-600">
            {fundRequests.filter(r => r.priorityScore >= 80 && r.status !== 'rejected').length}
          </p>
        </div>
        <div className="card p-4">
          <p className="label">Total Sanctioned</p>
          <p className="text-2xl font-bold text-green-600">₹{sanctionedTotal.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: sorted request list */}
        <div className="space-y-3">
          <p className="section-title">Requests — Priority Ranked</p>
          {sorted.map(req => (
            <RequestCard
              key={req.id}
              req={req}
              selected={current?.id === req.id}
              onSelect={() => setSelectedId(req.id)}
            />
          ))}
        </div>

        {/* Right: detail */}
        <div className="lg:col-span-2 space-y-5">
          {current && (
            <>
              {/* Header */}
              <div className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-400">{current.id}</p>
                    <h2 className="font-bold text-gray-900 text-lg mt-0.5">{current.item}</h2>
                    <p className="text-sm text-gray-500">{current.requestorName} · {current.requestorType}</p>
                  </div>
                  <StatusBadge status={current.status} />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="label">Estimated Cost</p>
                    <p className="font-bold text-gray-900">₹{current.estimatedCost.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="label">Students Affected</p>
                    <p className="font-bold text-gray-900">{current.studentsAffected}</p>
                  </div>
                  <div>
                    <p className="label">Urgency</p>
                    <p className={`font-bold capitalize ${
                      current.urgency === 'critical' ? 'text-red-600'
                      : current.urgency === 'high' ? 'text-orange-600'
                      : 'text-gray-900'
                    }`}>{current.urgency}</p>
                  </div>
                </div>
              </div>

              {/* Priority score */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="section-title">Priority Score</p>
                  <span className={`text-2xl font-black ${
                    current.priorityScore >= 80 ? 'text-red-600'
                    : current.priorityScore >= 60 ? 'text-amber-600'
                    : 'text-green-600'
                  }`}>{current.priorityScore}/100</span>
                </div>
                <PriorityBar score={current.priorityScore} />
                <div className="mt-4 space-y-1.5">
                  {current.priorityFactors.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-green-500 font-bold text-sm">+</span>
                      <span className="text-sm text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto checks */}
              <div className="card p-5">
                <p className="section-title mb-3">Automated Verification</p>
                {Object.entries(current.automatedChecks).map(([key, val]) => (
                  <div key={key} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                    {val.passed
                      ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{val.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Faculty recommendation */}
              {current.facultyRecommendation && (
                <div className="card p-5">
                  <p className="section-title mb-2">Faculty Recommendation</p>
                  <span className={`badge ${
                    current.facultyRecommendation === 'APPROVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>{current.facultyRecommendation}</span>
                  {current.facultyNote && (
                    <p className="text-sm text-gray-600 italic mt-2">"{current.facultyNote}"</p>
                  )}
                </div>
              )}

              {/* Rejection note */}
              {current.status === 'rejected' && current.rejectionReason && (
                <div className="card p-5 border-l-4 border-l-red-500">
                  <p className="section-title mb-2 text-red-600">Rejected</p>
                  <p className="text-sm text-gray-600">{current.rejectionReason}</p>
                  <p className="text-xs text-gray-400 mt-2">This request has been removed from the active workflow and is preserved in history.</p>
                </div>
              )}

              {/* Completion checklist */}
              {current.completionChecklist && current.status !== 'rejected' && (
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="section-title">Completion Checklist</p>
                    <span className="text-xs text-gray-400">
                      {Object.values(current.completionChecklist).filter(Boolean).length}/
                      {Object.values(current.completionChecklist).length} done
                    </span>
                  </div>
                  {Object.entries(current.completionChecklist).map(([key, done]) => (
                    <ChecklistItem
                      key={key}
                      label={checklistLabels[key] || key}
                      done={done}
                      canToggle={role === ROLES.ADMIN || role === ROLES.FACULTY || role === ROLES.CLUB_HEAD}
                      onToggle={() => updateChecklistItem(current.id, key, true)}
                    />
                  ))}
                  <div className="mt-4 bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-700">Approval alone does not mark this request as Completed. All checklist items must be confirmed.</p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="card p-5">
                <p className="section-title mb-4">Workflow Timeline</p>
                <WorkflowTimeline steps={current.timeline} />
              </div>

              {/* Actions */}
              {current.status === 'faculty_review' && (role === ROLES.FACULTY || role === ROLES.CLUB_HEAD) && (
                <div className="card p-5">
                  <p className="section-title mb-1">Faculty Actions</p>
                  <p className="text-xs text-gray-400 mb-3">Review the request and forward to Administration or reject.</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleFacultyAction('APPROVE')} className="btn-primary">
                      <Send className="w-4 h-4" /> Forward to Administration
                    </button>
                    <button onClick={() => handleFacultyAction('REJECT')} className="btn-danger">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              )}

              {current.status === 'awaiting_sanction' && role === ROLES.ADMIN && (
                <div className="card p-5 border-2 border-brand-100">
                  <p className="section-title mb-1">Administration — Final Sanction</p>
                  <p className="text-xs text-gray-400 mb-3">Only Administration has the authority to sanction this fund request.</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleAdminAction('APPROVE')} className="btn-success">
                      <CheckCircle2 className="w-4 h-4" /> Sanction
                    </button>
                    <button onClick={() => handleAdminAction('REJECT')} className="btn-danger">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
