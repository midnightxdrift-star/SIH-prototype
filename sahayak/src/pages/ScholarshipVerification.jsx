import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useRole, ROLES } from '../context/RoleContext';
import { CheckCircle2, XCircle, Lock, Send, ThumbsUp, ThumbsDown, Info, Eye } from 'lucide-react';
import ImportanceBadge from '../components/ui/ImportanceBadge';
import StatusBadge from '../components/ui/StatusBadge';
import WorkflowTimeline from '../components/ui/WorkflowTimeline';

function AutoCheckRow({ check }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
      {check.passed
        ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
        : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
      <div>
        <p className="text-sm font-medium text-gray-800">{check.label}</p>
        <p className="text-xs text-gray-500">{check.note}</p>
      </div>
    </div>
  );
}

function ScholarshipCard({ app, onSelect, selected }) {
  const statusColors = {
    faculty_review: 'bg-amber-50 border-amber-200 text-amber-700',
    admin_review: 'bg-blue-50 border-blue-200 text-blue-700',
    completed: 'bg-green-50 border-green-200 text-green-700',
    rejected: 'bg-red-50 border-red-200 text-red-600',
  };
  const statusLabels = {
    faculty_review: 'Faculty Review',
    admin_review: 'Admin Review',
    completed: 'Completed',
    rejected: 'Rejected',
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left card card-hover p-4 transition-all ${selected ? 'ring-2 ring-brand-400 border-brand-200' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{app.studentName}</p>
          <p className="text-xs text-gray-500 mt-0.5">{app.scholarshipName}</p>
          <p className="text-xs text-gray-400 mt-1">Submitted {app.submittedDate}</p>
        </div>
        <span className={`badge border ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
          {statusLabels[app.status] || app.status}
        </span>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full"
              style={{ width: `${(app.autoVerificationScore / app.autoVerificationTotal) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-green-600">
            {app.autoVerificationScore}/{app.autoVerificationTotal} auto checks
          </span>
        </div>
      </div>
    </button>
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
          placeholder="Add a note (optional)..."
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

// Read-only view for student — their own application
function StudentOwnView({ app, checks }) {
  return (
    <div className="space-y-5">
      {/* Status banner */}
      <div className={`rounded-xl p-4 border flex items-start gap-3 ${
        app.status === 'completed' ? 'bg-green-50 border-green-100'
        : app.status === 'rejected' ? 'bg-red-50 border-red-100'
        : 'bg-brand-50 border-brand-100'
      }`}>
        <Eye className={`w-4 h-4 mt-0.5 shrink-0 ${
          app.status === 'completed' ? 'text-green-600'
          : app.status === 'rejected' ? 'text-red-500'
          : 'text-brand-600'
        }`} />
        <div>
          <p className={`text-sm font-semibold ${
            app.status === 'completed' ? 'text-green-800'
            : app.status === 'rejected' ? 'text-red-700'
            : 'text-brand-800'
          }`}>
            {app.status === 'completed' ? 'Your scholarship has been approved.'
              : app.status === 'rejected' ? 'Your application was not approved.'
              : app.status === 'faculty_review' ? 'Your application is currently with Faculty for verification.'
              : 'Your application is under Administration review.'}
          </p>
          <p className={`text-xs mt-0.5 ${
            app.status === 'completed' ? 'text-green-600'
            : app.status === 'rejected' ? 'text-red-500'
            : 'text-brand-600'
          }`}>
            You will be notified once the decision is made.
          </p>
        </div>
      </div>

      {/* Application summary */}
      <div className="card p-5">
        <p className="section-title mb-3">Your Application</p>
        <div className="grid grid-cols-3 gap-4">
          <div><p className="label">Scholarship</p><p className="font-semibold text-gray-900 text-sm">{app.scholarshipName}</p></div>
          <div><p className="label">Submitted</p><p className="font-semibold text-gray-900 text-sm">{app.submittedDate}</p></div>
          <div><p className="label">Status</p><StatusBadge status={app.status} /></div>
        </div>
      </div>

      {/* Documents — student sees their own docs */}
      <div className="card p-5">
        <p className="section-title mb-3">Your Documents</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(app.documents).map(([key, present]) => (
            <div key={key} className="flex items-center gap-2">
              {present ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-400" />}
              <span className="text-sm text-gray-700">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Automated checks — student can see these, it's about their application */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="section-title">Automated Verification Result</p>
          <span className="badge bg-green-100 text-green-700">
            {app.autoVerificationScore}/{app.autoVerificationTotal} Passed
          </span>
        </div>
        {checks.map(c => <AutoCheckRow key={c.key} check={c} />)}
      </div>

      {/* Timeline */}
      <div className="card p-5">
        <p className="section-title mb-4">Workflow Progress</p>
        <WorkflowTimeline steps={app.timeline} />
      </div>

      {/* Admin/Faculty remarks — only shown if decision made */}
      {app.adminDecision && (
        <div className={`card p-5 border-l-4 ${app.adminDecision === 'APPROVED' ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <p className="section-title mb-2">Administration Decision</p>
          <span className={`badge ${app.adminDecision === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {app.adminDecision}
          </span>
          {app.adminNote && <p className="text-sm text-gray-600 italic mt-2">"{app.adminNote}"</p>}
        </div>
      )}
    </div>
  );
}

export default function ScholarshipVerification() {
  const { scholarships, facultyVerifyScholarship, adminReviewScholarship } = useApp();
  const { role, currentUser } = useRole();
  const [modal, setModal] = useState(null);

  const isAdmin = role === ROLES.ADMIN;
  const isFaculty = role === ROLES.FACULTY;
  const isStudent = role === ROLES.STUDENT;
  const isClubHead = role === ROLES.CLUB_HEAD;

  // Role-based visibility:
  // Admin → all applications
  // Faculty → only applications pending their review
  // Student → only their own application
  // Club Head → no scholarship (or their own if they applied)
  const visibleScholarships = isAdmin
    ? scholarships
    : isFaculty
    ? scholarships.filter(s => ['faculty_review', 'admin_review', 'completed', 'rejected'].includes(s.status))
    : scholarships.filter(s => s.id === currentUser.scholarshipId);

  const [selectedId, setSelectedId] = useState(visibleScholarships[0]?.id);
  const current = scholarships.find(s => s.id === selectedId) || visibleScholarships[0];

  const checks = current ? Object.entries(current.automatedChecks).map(([key, val]) => ({
    key,
    label: {
      documentsComplete: 'All documents submitted',
      eligibilityCheck: 'Income eligibility',
      academicCriteria: 'Academic criteria',
      deadlineCheck: 'Submission deadline',
      duplicateCheck: 'Duplicate application',
      consistencyCheck: 'Information consistency',
    }[key] || key,
    ...val,
  })) : [];

  const handleFacultyAction = (action) => {
    setModal({
      title: action === 'APPROVE' ? 'Confirm Verification'
        : action === 'REJECT' ? 'Confirm Rejection'
        : 'Forward to Administration',
      onSubmit: (note) => {
        if (action === 'FORWARD') {
          facultyVerifyScholarship(current.id, 'APPROVE', note || 'Verified by faculty. Forwarded to administration.');
        } else {
          facultyVerifyScholarship(current.id, action, note);
        }
        setModal(null);
      },
    });
  };

  const handleAdminAction = (decision) => {
    setModal({
      title: decision === 'APPROVED' ? 'Approve Scholarship' : 'Reject Application',
      onSubmit: (note) => {
        adminReviewScholarship(current.id, decision, note || (decision === 'APPROVED' ? 'Approved.' : 'Rejected.'));
        setModal(null);
      },
    });
  };

  // Club head with no scholarship
  if (isClubHead && visibleScholarships.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="page-title">Scholarship Verification</h1>
          <ImportanceBadge level="moderate" />
        </div>
        <div className="card p-10 text-center">
          <Lock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">No scholarship applications found for your profile.</p>
          <p className="text-sm text-gray-400 mt-1">Only your own scholarship applications are visible here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {modal && (
        <ActionModal title={modal.title} onSubmit={modal.onSubmit} onClose={() => setModal(null)} />
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="page-title">Scholarship Verification</h1>
            <ImportanceBadge level="moderate" />
          </div>
          <p className="text-sm text-gray-500">Automated checks followed by faculty verification and administration review</p>
        </div>
      </div>

      {/* Visibility notice */}
      {!isAdmin && (
        <div className={`rounded-xl p-4 border flex items-start gap-3 mb-6 ${
          isStudent ? 'bg-brand-50 border-brand-100' : 'bg-amber-50 border-amber-100'
        }`}>
          <Lock className={`w-4 h-4 mt-0.5 shrink-0 ${isStudent ? 'text-brand-500' : 'text-amber-500'}`} />
          <div>
            <p className={`text-sm font-semibold ${isStudent ? 'text-brand-800' : 'text-amber-800'}`}>
              {isStudent
                ? 'You can only view your own scholarship application.'
                : 'You can view applications assigned for your verification.'}
            </p>
            <p className={`text-xs mt-0.5 ${isStudent ? 'text-brand-600' : 'text-amber-700'}`}>
              Other students' applications are confidential. Administration has full visibility.
            </p>
          </div>
        </div>
      )}

      {/* System info */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Moderate Importance:</span> Automated checks run first. Faculty then verifies documents. Administration takes the final decision.
          </p>
        </div>
      </div>

      {/* Student sees only their own application — single column layout */}
      {isStudent && current ? (
        <div className="max-w-2xl">
          <StudentOwnView app={current} checks={checks} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: list */}
          <div className="space-y-3">
            <p className="section-title">
              Applications ({visibleScholarships.length}
              {isFaculty && <span className="text-gray-400 font-normal"> — assigned to you</span>})
            </p>
            {visibleScholarships.map(app => (
              <ScholarshipCard
                key={app.id}
                app={app}
                selected={current?.id === app.id}
                onSelect={() => setSelectedId(app.id)}
              />
            ))}
          </div>

          {/* Right: detail */}
          {current && (
            <div className="lg:col-span-2 space-y-5">
              <div className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{current.id}</p>
                    <h2 className="font-bold text-gray-900 text-lg">{current.studentName}</h2>
                    <p className="text-sm text-gray-500">{current.scholarshipName}</p>
                  </div>
                  <StatusBadge status={current.status} />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div><p className="label">CGPA</p><p className="font-semibold text-gray-900">{current.cgpa}</p></div>
                  <div><p className="label">Annual Income</p><p className="font-semibold text-gray-900">₹{current.annualIncome.toLocaleString('en-IN')}</p></div>
                  <div><p className="label">Category</p><p className="font-semibold text-gray-900">{current.category}</p></div>
                </div>
              </div>

              <div className="card p-5">
                <p className="section-title mb-3">Document Checklist</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(current.documents).map(([key, present]) => (
                    <div key={key} className="flex items-center gap-2">
                      {present ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-400" />}
                      <span className="text-sm text-gray-700">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="section-title">Automated Verification</p>
                  <span className="badge bg-green-100 text-green-700">
                    {current.autoVerificationScore}/{current.autoVerificationTotal} Passed
                  </span>
                </div>
                {checks.map(c => <AutoCheckRow key={c.key} check={c} />)}
                <div className="mt-4 bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-800 mb-1">What happens next?</p>
                  <p className="text-xs text-blue-700">Automated checks complete. Faculty verification required per institutional policy.</p>
                </div>
              </div>

              {current.facultyRecommendation && (
                <div className="card p-5">
                  <p className="section-title mb-2">Faculty Recommendation</p>
                  <div className={`flex items-center gap-2 mb-2 ${current.facultyRecommendation === 'APPROVE' ? 'text-green-600' : 'text-red-500'}`}>
                    {current.facultyRecommendation === 'APPROVE' ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                    <span className="font-semibold">{current.facultyRecommendation}</span>
                  </div>
                  {current.facultyNote && <p className="text-sm text-gray-600 italic">"{current.facultyNote}"</p>}
                </div>
              )}

              {current.adminDecision && (
                <div className={`card p-5 border-l-4 ${current.adminDecision === 'APPROVED' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <p className="section-title mb-2">Administration Decision</p>
                  <span className={`badge ${current.adminDecision === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {current.adminDecision}
                  </span>
                  {current.adminNote && <p className="text-sm text-gray-600 italic mt-2">"{current.adminNote}"</p>}
                </div>
              )}

              <div className="card p-5">
                <p className="section-title mb-4">Workflow Timeline</p>
                <WorkflowTimeline steps={current.timeline} />
              </div>

              {/* Faculty actions */}
              {current.status === 'faculty_review' && (role === ROLES.FACULTY || role === ROLES.CLUB_HEAD) && (
                <div className="card p-5">
                  <p className="section-title mb-3">Faculty Actions</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleFacultyAction('APPROVE')} className="btn-success">
                      <CheckCircle2 className="w-4 h-4" /> Verify & Approve
                    </button>
                    <button onClick={() => handleFacultyAction('FORWARD')} className="btn-primary">
                      <Send className="w-4 h-4" /> Forward to Administration
                    </button>
                    <button onClick={() => handleFacultyAction('REJECT')} className="btn-danger">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Admin actions */}
              {current.status === 'admin_review' && role === ROLES.ADMIN && (
                <div className="card p-5">
                  <p className="section-title mb-3">Administration Actions</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleAdminAction('APPROVED')} className="btn-success">
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleAdminAction('REJECTED')} className="btn-danger">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Only Administration has final sanctioning authority.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
