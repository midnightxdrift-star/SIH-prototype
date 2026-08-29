import React from 'react';
import { Link } from 'react-router-dom';
import { useRole, ROLES } from '../context/RoleContext';
import { useApp } from '../context/AppContext';
import {
  Users, GraduationCap, Landmark, BookOpen,
  CheckCircle2, Clock, AlertTriangle, TrendingUp,
  ArrowRight, Activity, FileCheck
} from 'lucide-react';

function KPICard({ label, value, sub, icon: Icon, color = 'text-brand-600', bg = 'bg-brand-50' }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ to, title, badge, badgeColor, description, icon: Icon, iconColor, iconBg, actionLabel }) {
  return (
    <Link
      to={to}
      className="card card-hover p-5 flex flex-col gap-3 group transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className={`badge border text-xs ${badgeColor}`}>{badge}</span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
        {actionLabel}
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}

function ActivityItem({ item }) {
  const dotColors = {
    automated: 'bg-blue-400',
    faculty: 'bg-amber-400',
    admin: 'bg-red-400',
  };
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColors[item.actorRole] || 'bg-gray-400'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">{item.message}</p>
        <p className="text-xs text-gray-400 mt-0.5">{item.relativeTime} · {item.actor}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { role } = useRole();
  const { scholarships, fundRequests, activity, activeRequests } = useApp();

  // Compute stats
  const pendingSanction = fundRequests.filter(r => r.status === 'awaiting_sanction').length;
  const highPriority = fundRequests.filter(r => r.priorityScore >= 80 && !['rejected', 'completed'].includes(r.status)).length;
  const facultyReview = scholarships.filter(s => s.status === 'faculty_review').length;
  const completedCount = [
    ...scholarships.filter(s => s.status === 'completed'),
    ...fundRequests.filter(r => r.status === 'completed'),
  ].length;

  const adminKPIs = [
    { label: 'Active Requests', value: activeRequests.length, icon: Clock, color: 'text-brand-600', bg: 'bg-brand-50', sub: 'Across all modules' },
    { label: 'Pending Sanctions', value: pendingSanction, icon: Landmark, color: 'text-red-600', bg: 'bg-red-50', sub: 'Awaiting your action' },
    { label: 'High Priority', value: highPriority, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', sub: 'Priority score ≥ 80' },
    { label: 'Completed', value: completedCount, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', sub: 'This period' },
  ];

  const facultyKPIs = [
    { label: 'Assigned Verifications', value: facultyReview, icon: FileCheck, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Scholarship applications' },
    { label: 'Fund Requests', value: fundRequests.filter(r => r.status === 'faculty_review').length, icon: Landmark, color: 'text-red-600', bg: 'bg-red-50', sub: 'Pending your review' },
    { label: 'Forwarded', value: fundRequests.filter(r => r.facultyRecommendation === 'APPROVE').length, icon: TrendingUp, color: 'text-brand-600', bg: 'bg-brand-50', sub: 'To administration' },
    { label: 'Completed', value: completedCount, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', sub: 'This period' },
  ];

  const studentKPIs = [
    { label: 'My Requests', value: 2, icon: Clock, color: 'text-brand-600', bg: 'bg-brand-50', sub: 'Active' },
    { label: 'Scholarship', value: 'Under Review', icon: GraduationCap, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Faculty review stage' },
    { label: 'Placement Matches', value: 4, icon: Users, color: 'text-green-600', bg: 'bg-green-50', sub: 'Eligible companies' },
    { label: 'Admission Checklist', value: '8/11', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Documents ready' },
  ];

  const kpis = role === ROLES.ADMIN ? adminKPIs
    : role === ROLES.STUDENT ? studentKPIs
    : facultyKPIs;

  const greeting = role === ROLES.ADMIN ? 'Good afternoon, Dean Mehta'
    : role === ROLES.STUDENT ? 'Good afternoon, Arjun'
    : 'Good afternoon, Prof. Kumar';

  const subtitle = role === ROLES.ADMIN
    ? `${pendingSanction} request${pendingSanction !== 1 ? 's' : ''} awaiting your sanction`
    : role === ROLES.STUDENT
    ? 'Track your requests and admission status'
    : `${facultyReview} application${facultyReview !== 1 ? 's' : ''} awaiting your verification`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      {/* How Sahayak works */}
      <div className="card p-5 bg-gradient-to-r from-brand-50 to-white border-brand-100">
        <p className="text-sm font-semibold text-brand-800 mb-3">How Sahayak Works</p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['Automate', 'Verify', 'Escalate', 'Sanction', 'Complete'].map((step, i) => (
            <React.Fragment key={step}>
              <div className="text-center shrink-0">
                <div className="text-xs font-semibold text-brand-700 bg-brand-100 px-3 py-1.5 rounded-full">{step}</div>
              </div>
              {i < 4 && <ArrowRight className="w-3 h-3 text-brand-300 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Sahayak handles routine work automatically and routes decisions to the right human authority.</p>
      </div>

      {/* Workflow modules */}
      <div>
        <h2 className="section-title mb-4">Workflow Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModuleCard
            to="/placement"
            title="Smart Placement Matching"
            badge="Low Importance"
            badgeColor="bg-green-50 text-green-700 border-green-200"
            description="Automated student–company matching based on eligibility, skills and portfolio."
            icon={Users}
            iconColor="text-green-600"
            iconBg="bg-green-50"
            actionLabel="Open Matching"
          />
          <ModuleCard
            to="/scholarship"
            title="Scholarship Verification"
            badge="Moderate Importance"
            badgeColor="bg-amber-50 text-amber-700 border-amber-200"
            description="Automated document checks followed by faculty verification and admin review."
            icon={GraduationCap}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
            actionLabel="View Applications"
          />
          <ModuleCard
            to="/fund-sanctioning"
            title="Smart Fund Sanctioning"
            badge="High Importance"
            badgeColor="bg-red-50 text-red-700 border-red-200"
            description="Priority-ranked institutional resource requests requiring higher-authority sanction."
            icon={Landmark}
            iconColor="text-red-600"
            iconBg="bg-red-50"
            actionLabel="Review Requests"
          />
          <ModuleCard
            to="/admission"
            title="Admission Assist"
            badge="Separate Module"
            badgeColor="bg-purple-50 text-purple-700 border-purple-200"
            description="Personalized guidance for new students on documents and physical reporting."
            icon={BookOpen}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
            actionLabel="Open Guide"
          />
        </div>
      </div>

      {/* Activity + Priority list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity feed */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="section-title">Recent Activity</p>
            <Link to="/activity" className="text-xs text-brand-600 hover:underline font-medium">View all</Link>
          </div>
          <div>
            {activity.slice(0, 5).map(item => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Top priority fund requests */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="section-title">Top Priority Requests</p>
            <Link to="/fund-sanctioning" className="text-xs text-brand-600 hover:underline font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {fundRequests
              .filter(r => !['rejected', 'completed'].includes(r.status))
              .sort((a, b) => b.priorityScore - a.priorityScore)
              .slice(0, 4)
              .map((req, idx) => (
                <div key={req.id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-300 w-4">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{req.item}</p>
                    <p className="text-xs text-gray-400">{req.requestorName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${
                      req.priorityScore >= 80 ? 'text-red-600'
                      : req.priorityScore >= 60 ? 'text-amber-600'
                      : 'text-green-600'
                    }`}>{req.priorityScore}</p>
                    <p className="text-xs text-gray-400">priority</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
