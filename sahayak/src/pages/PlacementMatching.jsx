import React, { useState } from 'react';
import { rankStudents, getCompanies } from '../engine/workflowEngine';
import { Building2, ChevronDown, CheckCircle2, XCircle, Star, Users, TrendingUp, Filter } from 'lucide-react';
import ImportanceBadge from '../components/ui/ImportanceBadge';

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

function EligibilityRow({ label, pass, note }) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      {pass
        ? <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
        : <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />}
      <span className={`text-sm ${pass ? 'text-gray-700' : 'text-red-600'}`}>{note}</span>
    </div>
  );
}

function StudentCard({ rank, result, isExpanded, onToggle }) {
  const { student, score, eligible, eligibilityReasons, matched, missing } = result;
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-500';
  const eligBg = eligible ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200';

  return (
    <div className={`card card-hover border transition-all duration-200 ${!eligible ? 'opacity-70' : ''}`}>
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={onToggle}
      >
        {/* Rank */}
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
          {rank}
        </div>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm shrink-0">
          {student.name.split(' ').map(n => n[0]).join('')}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm">{student.name}</div>
          <div className="text-xs text-gray-500">{student.rollNo} · {student.branch} · CGPA {student.cgpa}</div>
        </div>

        {/* Score bar */}
        <div className="w-48 hidden md:block">
          <ScoreBar score={score} />
        </div>

        {/* Eligibility badge */}
        <span className={`badge border ${eligBg} whitespace-nowrap`}>
          {eligible ? '✓ Eligible' : '✗ Not Eligible'}
        </span>

        {/* Expand */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eligibility */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Eligibility Check</p>
              {Object.entries(eligibilityReasons).map(([k, v]) => (
                <EligibilityRow key={k} {...v} />
              ))}
            </div>
            {/* Skills */}
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

export default function PlacementMatching() {
  const companies = getCompanies();
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const results = rankStudents(selectedCompany?.id || '');
  const filtered = showEligibleOnly ? results.filter(r => r.eligible) : results;
  const eligibleCount = results.filter(r => r.eligible).length;
  const avgScore = results.length ? Math.round(results.reduce((a, b) => a + b.score, 0) / results.length) : 0;

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

      {/* System explanation */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">How this works</p>
            <p className="text-xs text-green-700 mt-0.5">The system automatically compares student profiles — academic records, skills, and portfolios — against company requirements. Students are ranked by match score. No manual shortlisting needed.</p>
          </div>
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <Users className="w-5 h-5 text-brand-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
              <p className="text-xs text-gray-500">Total Candidates</p>
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

          {/* Filter */}
          <div className="flex items-center justify-between">
            <p className="section-title">Candidate Rankings</p>
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

          {/* Student list */}
          <div className="space-y-3">
            {filtered.map((result, idx) => (
              <StudentCard
                key={result.student.id}
                rank={idx + 1}
                result={result}
                isExpanded={expandedId === result.student.id}
                onToggle={() => setExpandedId(expandedId === result.student.id ? null : result.student.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
