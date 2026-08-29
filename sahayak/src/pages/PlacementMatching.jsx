import React, { useState } from 'react';
import { rankStudents, getCompanies } from '../engine/workflowEngine';
import { Building2, ChevronDown, CheckCircle2, XCircle, Star, Users, TrendingUp, Filter, Lock, Eye } from 'lucide-react';
import ImportanceBadge from '../components/ui/ImportanceBadge';
import { useRole, ROLES } from '../context/RoleContext';

function ScoreBar({ score }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-400';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-bold text-gray-900 w-10 text-right">{score}%</span>
    </div>
  );
}

function EligibilityRow({ pass, note }) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      {pass
        ? <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
        : <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />}
      <span className={`text-sm ${pass ? 'text-gray-700' : 'text-red-600'}`}>{note}</span>
    </div>
  );
}

function StudentCard({ rank, result, isExpanded, onToggle, isOwn }) {
  const { student, score, eligible, eligibilityReasons, matched, missing } = result;
  const eligBg = eligible ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200';

  return (
    <div className={`card card-hover border transition-all duration-200 ${!eligible ? 'opacity-70' : ''} ${isOwn ? 'ring-2 ring-brand-400' : ''}`}>
      {isOwn && (
        <div className="bg-brand-50 px-4 py-1.5 border-b border-brand-100 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-brand-600" />
          <span className="text-xs font-semibold text-brand-700">Your Profile</span>
        </div>
      )}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
          {rank}
        </div>
        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm shrink-0">
          {student.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm">{student.name}</div>
          <div className="text-xs text-gray-500">{student.rollNo} · {student.branch} · CGPA {student.cgpa}</div>
        </div>
        <div className="w-48 hidden md:block">
          <ScoreBar score={score} />
        </div>
        <span className={`badge border ${eligBg} whitespace-nowrap`}>
          {eligible ? '✓ Eligible' : '✗ Not Eligible'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Eligibility Check</p>
              {Object.entries(eligibilityReasons).map(([k, v]) => (
                <EligibilityRow key={k} {...v} />
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills Match</p>
              {matched.map(s => (
                <div key={s} className="flex items-center gap-2 py-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span className="text-sm text-gray-700">{s}</span>
                </div>
              ))}
              {missing.map(s => (
                <div key={s} className="flex items-center gap-2 py-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="text-sm text-red-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Blurred placeholder for hidden student rows
function HiddenStudentRow({ rank }) {
  return (
    <div className="card border border-dashed border-gray-200 p-4 flex items-center gap-4 opacity-50">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">{rank}</div>
      <div className="w-10 h-10 rounded-full bg-gray-100" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-gray-200 rounded w-32" />
        <div className="h-2.5 bg-gray-100 rounded w-48" />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Lock className="w-3.5 h-3.5" />
        Confidential
      </div>
    </div>
  );
}

export default function PlacementMatching() {
  const companies = getCompanies();
  const { role, currentUser } = useRole();
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const isAdmin = role === ROLES.ADMIN;
  const isFaculty = role === ROLES.FACULTY;
  const isStudent = role === ROLES.STUDENT;
  const isClubHead = role === ROLES.CLUB_HEAD;

  const allResults = rankStudents(selectedCompany?.id || '');

  // Role-based visibility:
  // Admin → all students
  // Faculty → all students in their department
  // Student → only their own result
  // Club Head → only their own result
  const visibleResults = isAdmin
    ? allResults
    : isFaculty
    ? allResults.filter(r => r.student.branch === currentUser.department)
    : allResults.filter(r => r.student.id === currentUser.id);

  const hiddenCount = allResults.length - visibleResults.length;
  const filtered = showEligibleOnly ? visibleResults.filter(r => r.eligible) : visibleResults;
  const eligibleCount = visibleResults.filter(r => r.eligible).length;
  const avgScore = visibleResults.length
    ? Math.round(visibleResults.reduce((a, b) => a + b.score, 0) / visibleResults.length)
    : 0;

  const myResult = (isStudent || isClubHead)
    ? allResults.find(r => r.student.id === currentUser.id)
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="page-title">Smart Placement Matching</h1>
            <ImportanceBadge level="low" />
          </div>
          <p className="text-sm text-gray-500">Automated student–company eligibility and matching engine</p>
        </div>
      </div>

      {/* Visibility notice */}
      {!isAdmin && (
        <div className={`rounded-xl p-4 border flex items-start gap-3 ${
          isStudent || isClubHead
            ? 'bg-brand-50 border-brand-100'
            : 'bg-amber-50 border-amber-100'
        }`}>
          <Lock className={`w-4 h-4 mt-0.5 shrink-0 ${isStudent || isClubHead ? 'text-brand-500' : 'text-amber-500'}`} />
          <div>
            <p className={`text-sm font-semibold ${isStudent || isClubHead ? 'text-brand-800' : 'text-amber-800'}`}>
              {isStudent || isClubHead
                ? 'You can only view your own placement match results.'
                : `Showing students from ${currentUser.department} department only.`}
            </p>
            <p className={`text-xs mt-0.5 ${isStudent || isClubHead ? 'text-brand-600' : 'text-amber-700'}`}>
              Other students' results are confidential. Administration has full visibility.
            </p>
          </div>
        </div>
      )}

      {/* System explanation */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
          <p className="text-xs text-green-700">
            <span className="font-semibold">How this works: </span>
            The system automatically compares student profiles against company requirements and ranks candidates by match score. No manual shortlisting needed.
          </p>
        </div>
      </div>

      {/* Company selector */}
      <div className="card p-5">
        <p className="label mb-3">Select Company Drive</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {companies.map(co => (
            <button
              key={co.id}
              onClick={() => { setSelectedCompany(co); setExpandedId(null); }}
              className={`text-left p-3 rounded-lg border transition-all duration-150 ${
                selectedCompany?.id === co.id
                  ? 'border-brand-400 bg-brand-50 ring-1 ring-brand-300'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Building2 className={`w-4 h-4 ${selectedCompany?.id === co.id ? 'text-brand-600' : 'text-gray-400'}`} />
                <span className="text-sm font-semibold text-gray-900">{co.name}</span>
              </div>
              <p className="text-xs text-gray-500">{co.role}</p>
              <p className="text-xs text-gray-400 mt-1">{co.ctc} · {co.location}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedCompany && (
        <>
          {/* Company requirements */}
          <div className="card p-5">
            <p className="section-title mb-3">Requirements — {selectedCompany.name}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="label">Eligible Branches</p>
                <p className="text-gray-900 font-medium">{selectedCompany.branches.join(', ')}</p>
              </div>
              <div>
                <p className="label">Min CGPA</p>
                <p className="text-gray-900 font-medium">{selectedCompany.minCGPA}</p>
              </div>
              <div>
                <p className="label">Backlogs</p>
                <p className={`font-medium ${selectedCompany.backlogsAllowed ? 'text-green-600' : 'text-red-500'}`}>
                  {selectedCompany.backlogsAllowed ? 'Allowed (max 1)' : 'Not Allowed'}
                </p>
              </div>
              <div>
                <p className="label">Required Skills</p>
                <div className="flex flex-wrap gap-1">
                  {selectedCompany.requiredSkills.map(s => (
                    <span key={s} className="badge bg-gray-100 text-gray-700">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats — admin/faculty see totals, student sees personal */}
          {isAdmin || isFaculty ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="card p-4 text-center">
                <Users className="w-5 h-5 text-brand-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{visibleResults.length}</p>
                <p className="text-xs text-gray-500">{isFaculty ? 'Your Dept. Candidates' : 'Total Candidates'}</p>
              </div>
              <div className="card p-4 text-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-600">{eligibleCount}</p>
                <p className="text-xs text-gray-500">Eligible</p>
              </div>
              <div className="card p-4 text-center">
                <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
                <p className="text-xs text-gray-500">Avg Match Score</p>
              </div>
            </div>
          ) : myResult ? (
            // Personal stats for student / club head
            <div className="card p-5 bg-brand-50 border-brand-100">
              <p className="text-sm font-semibold text-brand-800 mb-3">Your Match Result — {selectedCompany.name}</p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className={`text-4xl font-black ${myResult.eligible ? 'text-green-600' : 'text-red-500'}`}>
                    {myResult.score}%
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Match Score</p>
                </div>
                <div className="flex-1">
                  <ScoreBar score={myResult.score} />
                  <p className={`text-sm font-semibold mt-2 ${myResult.eligible ? 'text-green-700' : 'text-red-600'}`}>
                    {myResult.eligible ? '✓ You are eligible for this drive' : '✗ You are not eligible for this drive'}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Candidate list */}
          {(isAdmin || isFaculty) && (
            <>
              <div className="flex items-center justify-between">
                <p className="section-title">
                  {isFaculty ? `${currentUser.department} — Candidate Rankings` : 'All Candidate Rankings'}
                </p>
                <button
                  onClick={() => setShowEligibleOnly(!showEligibleOnly)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    showEligibleOnly
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {showEligibleOnly ? 'Eligible Only' : 'All Candidates'}
                </button>
              </div>
              <div className="space-y-3">
                {filtered.map((result, idx) => (
                  <StudentCard
                    key={result.student.id}
                    rank={idx + 1}
                    result={result}
                    isOwn={false}
                    isExpanded={expandedId === result.student.id}
                    onToggle={() => setExpandedId(expandedId === result.student.id ? null : result.student.id)}
                  />
                ))}
                {/* Show blurred rows for hidden students (faculty view) */}
                {isFaculty && hiddenCount > 0 && (
                  <div className="mt-2 space-y-2">
                    {Array.from({ length: Math.min(hiddenCount, 3) }).map((_, i) => (
                      <HiddenStudentRow key={i} rank={filtered.length + i + 1} />
                    ))}
                    {hiddenCount > 3 && (
                      <p className="text-xs text-center text-gray-400 py-2">
                        +{hiddenCount - 3} more students from other departments (not visible to you)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Student/Club Head sees only their own card */}
          {(isStudent || isClubHead) && myResult && (
            <>
              <p className="section-title">Your Result</p>
              <StudentCard
                rank={allResults.findIndex(r => r.student.id === currentUser.id) + 1}
                result={myResult}
                isOwn={true}
                isExpanded={expandedId === myResult.student.id}
                onToggle={() => setExpandedId(expandedId === myResult.student.id ? null : myResult.student.id)}
              />
              <p className="text-xs text-center text-gray-400">
                Your rank among all candidates is shown above. Other candidates' results are confidential.
              </p>
            </>
          )}

          {(isStudent || isClubHead) && !myResult && (
            <div className="card p-8 text-center">
              <XCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">You are not in the candidate pool for this drive.</p>
              <p className="text-sm text-gray-400 mt-1">Branch or graduation year may not match this company's requirements.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
