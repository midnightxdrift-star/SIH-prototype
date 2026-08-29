import React, { useState } from 'react';
import { useRole, ROLES, ROLE_LABELS } from '../../context/RoleContext';
import { ChevronDown, User } from 'lucide-react';

const ROLE_ORDER = [
  { key: ROLES.STUDENT, label: 'Student', desc: 'Submit & track requests' },
  { key: ROLES.FACULTY, label: 'Faculty / HOD', desc: 'Verify & forward requests' },
  { key: ROLES.CLUB_HEAD, label: 'Club Head', desc: 'Submit fund requests' },
  { key: ROLES.ADMIN, label: 'Dean / Administration', desc: 'Final sanctioning authority' },
];

export default function TopBar() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);

  const currentRole = ROLE_ORDER.find(r => r.key === role) || ROLE_ORDER[0];

  return (
    <header className="h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40">
      <div />

      <div className="flex items-center gap-4">
        {/* Demo tag */}
        <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
          Demo Prototype
        </span>

        {/* Role switcher */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-sm"
          >
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-medium text-gray-700">{currentRole.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Demo Role Switcher</p>
                  <p className="text-xs text-gray-400 mt-0.5">Switch perspective for demo</p>
                </div>
                {ROLE_ORDER.map(r => (
                  <button
                    key={r.key}
                    onClick={() => { setRole(r.key); setOpen(false); }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                      r.key === role ? 'bg-brand-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${r.key === role ? 'text-brand-700' : 'text-gray-800'}`}>
                          {r.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                      </div>
                      {r.key === role && (
                        <div className="w-2 h-2 rounded-full bg-brand-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
