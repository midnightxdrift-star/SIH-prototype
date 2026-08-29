import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  List,
  Users,
  GraduationCap,
  Landmark,
  BookOpen,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/requests', label: 'All Requests', icon: List },
];

const WORKFLOW_ITEMS = [
  { path: '/placement', label: 'Smart Placement Matching', icon: Users, color: 'text-green-600', dot: 'bg-green-500' },
  { path: '/scholarship', label: 'Scholarship Verification', icon: GraduationCap, color: 'text-amber-600', dot: 'bg-amber-500' },
  { path: '/fund-sanctioning', label: 'Smart Fund Sanctioning', icon: Landmark, color: 'text-red-600', dot: 'bg-red-500' },
  { path: '/admission', label: 'Admission Assist', icon: BookOpen, color: 'text-purple-600', dot: 'bg-purple-500' },
];

const BOTTOM_ITEMS = [
  { path: '/activity', label: 'Activity Feed', icon: Activity },
];

function NavItem({ path, label, icon: Icon }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `sidebar-nav-item ${isActive ? 'active' : ''}`
      }
      end={path === '/'}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { role } = useRole();

  return (
    <aside className="w-60 shrink-0 h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-100 flex justify-center">
        <img
          src="/logo.png"
          alt="Sahayak — Smart Institutional Workflow"
          className="h-20 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <NavItem key={item.path} {...item} />
        ))}

        {/* Workflow categories */}
        <div className="pt-4 pb-1 px-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Workflow Modules</p>
        </div>

        {WORKFLOW_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.dot}`} />
            <item.icon className={`w-4 h-4 shrink-0 ${item.color}`} />
            <span className="text-sm leading-tight">{item.label}</span>
          </NavLink>
        ))}

        {/* Bottom */}
        <div className="pt-4 pb-1 px-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">System</p>
        </div>
        {BOTTOM_ITEMS.map(item => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      {/* Role info at bottom */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">
            {role === 'student' ? 'S' : role === 'faculty' ? 'F' : role === 'club_head' ? 'C' : 'D'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">
              {role === 'student' ? 'Student'
                : role === 'faculty' ? 'Faculty / HOD'
                : role === 'club_head' ? 'Club Head'
                : 'Dean / Admin'}
            </p>
            <p className="text-[10px] text-gray-400">Demo session</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
