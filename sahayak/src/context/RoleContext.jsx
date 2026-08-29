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

// Demo user profiles for each role
const DEMO_USERS = {
  student: {
    id: 'STU001',
    name: 'Arjun Sharma',
    branch: 'Computer Science',
    scholarshipId: 'SCH001', // Arjun's scholarship application
  },
  faculty: {
    id: 'FAC001',
    name: 'Prof. Ramesh Kumar',
    department: 'Computer Science',
    // Faculty sees all CS-related items pending review
  },
  club_head: {
    id: 'STU007',
    name: 'Vikram Patel',
    branch: 'Information Technology',
    clubId: 'CLUB002',       // Coding Club
    fundRequestIds: ['FND004'], // Only Coding Club's requests
    scholarshipId: null,
  },
  admin: {
    id: 'ADM001',
    name: 'Dr. Arun Mehta',
    title: 'Dean',
    // Admin sees everything
  },
};

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRole] = useState(ROLES.ADMIN);

  const currentUser = DEMO_USERS[role];

  return (
    <RoleContext.Provider value={{ role, setRole, ROLES, ROLE_LABELS, currentUser, DEMO_USERS }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

export { ROLES, ROLE_LABELS, DEMO_USERS };
