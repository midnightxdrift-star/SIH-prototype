import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AllRequests from './pages/AllRequests';
import PlacementMatching from './pages/PlacementMatching';
import ScholarshipVerification from './pages/ScholarshipVerification';
import FundSanctioning from './pages/FundSanctioning';
import AdmissionAssist from './pages/AdmissionAssist';
import ActivityFeed from './pages/ActivityFeed';

export default function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <AppProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/requests" element={<AllRequests />} />
              <Route path="/placement" element={<PlacementMatching />} />
              <Route path="/scholarship" element={<ScholarshipVerification />} />
              <Route path="/fund-sanctioning" element={<FundSanctioning />} />
              <Route path="/admission" element={<AdmissionAssist />} />
              <Route path="/activity" element={<ActivityFeed />} />
            </Routes>
          </Layout>
        </AppProvider>
      </RoleProvider>
    </BrowserRouter>
  );
}
