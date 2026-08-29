import React, { createContext, useContext, useState } from 'react';

const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  CLUB_HEAD: 'club_head',
  ADMIN: 'admin',
};

const ROLE_LABELS = {
  student: 'Student',
  faculty: 'Faculty / HOD',
  club_head: 'Club Head',
  admin: 'Dean / Administration',
};

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRole] = useState(ROLES.ADMIN);

  return (
    <RoleContext.Provider value={{ role, setRole, ROLES, ROLE_LABELS }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

export { ROLES, ROLE_LABELS };
