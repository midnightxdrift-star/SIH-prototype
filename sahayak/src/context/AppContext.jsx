import React, { createContext, useContext, useState } from 'react';
import scholarshipsData from '../data/scholarships.json';
import fundRequestsData from '../data/fund_requests.json';
import activityData from '../data/activity.json';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [scholarships, setScholarships] = useState(scholarshipsData);
  const [fundRequests, setFundRequests] = useState(fundRequestsData);
  const [activity, setActivity] = useState(activityData);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const addActivity = (entry) => {
    setActivity(prev => [entry, ...prev]);
  };

  // --- SCHOLARSHIP ACTIONS ---
  const updateScholarship = (id, updates) => {
    setScholarships(prev =>
      prev.map(s => s.id === id ? { ...s, ...updates } : s)
    );
  };

  const facultyVerifyScholarship = (id, decision, note) => {
    const timestamp = new Date().toISOString();
    updateScholarship(id, {
      facultyRecommendation: decision,
      facultyNote: note,
      status: decision === 'REJECT' ? 'rejected' : 'admin_review',
      timeline: scholarships.find(s => s.id === id)?.timeline.map(t =>
        t.step === 'Faculty Verification'
          ? { ...t, status: 'done', timestamp }
          : t.step === 'Administration Review' && decision !== 'REJECT'
          ? { ...t, status: 'active' }
          : t
      ),
    });
    addActivity({
      id: `ACT${Date.now()}`,
      requestId: id,
      requestName: `Scholarship — ${scholarships.find(s => s.id === id)?.studentName}`,
      action: decision === 'REJECT' ? 'REJECTED' : 'FACULTY_VERIFIED',
      actor: 'Prof. Ramesh Kumar',
      actorRole: 'faculty',
      timestamp,
      relativeTime: 'Just now',
      message: `${id} ${decision === 'REJECT' ? 'rejected by faculty.' : 'verified by faculty. Forwarded to Administration.'}`,
      category: 'scholarship',
    });
  };

  const adminReviewScholarship = (id, decision, note) => {
    const timestamp = new Date().toISOString();
    updateScholarship(id, {
      adminDecision: decision,
      adminNote: note,
      status: decision === 'APPROVED' ? 'completed' : 'rejected',
      timeline: scholarships.find(s => s.id === id)?.timeline.map(t =>
        t.step === 'Administration Review'
          ? { ...t, status: 'done', timestamp }
          : t.step === 'Completed' && decision === 'APPROVED'
          ? { ...t, status: 'done', timestamp }
          : t
      ),
    });
    addActivity({
      id: `ACT${Date.now()}`,
      requestId: id,
      requestName: `Scholarship — ${scholarships.find(s => s.id === id)?.studentName}`,
      action: decision === 'APPROVED' ? 'APPROVED' : 'REJECTED',
      actor: 'Dean — Dr. Arun Mehta',
      actorRole: 'admin',
      timestamp,
      relativeTime: 'Just now',
      message: `${id} ${decision === 'APPROVED' ? 'approved by Administration.' : 'rejected by Administration.'}`,
      category: 'scholarship',
    });
  };

  // --- FUND REQUEST ACTIONS ---
  const updateFundRequest = (id, updates) => {
    setFundRequests(prev =>
      prev.map(r => r.id === id ? { ...r, ...updates } : r)
    );
  };

  const facultyReviewFund = (id, decision, note) => {
    const timestamp = new Date().toISOString();
    const req = fundRequests.find(r => r.id === id);
    updateFundRequest(id, {
      facultyRecommendation: decision,
      facultyNote: note,
      status: decision === 'REJECT' ? 'rejected' : 'awaiting_sanction',
      timeline: req?.timeline.map(t =>
        t.step === 'Faculty Review'
          ? { ...t, status: 'done', timestamp }
          : t.step === 'Administration Sanction' && decision !== 'REJECT'
          ? { ...t, status: 'active' }
          : t
      ),
    });
    addActivity({
      id: `ACT${Date.now()}`,
      requestId: id,
      requestName: req?.item,
      action: decision === 'REJECT' ? 'REJECTED' : 'FORWARDED_TO_ADMIN',
      actor: 'Prof. Anita Sharma',
      actorRole: 'faculty',
      timestamp,
      relativeTime: 'Just now',
      message: `${id} ${decision === 'REJECT' ? 'rejected by faculty.' : `forwarded to Administration. Faculty recommendation: ${decision}.`}`,
      category: 'fund',
    });
  };

  const adminSanctionFund = (id, decision, note) => {
    const timestamp = new Date().toISOString();
    const req = fundRequests.find(r => r.id === id);
    const isApproved = decision === 'APPROVE';
    updateFundRequest(id, {
      adminDecision: isApproved ? 'APPROVED' : 'REJECTED',
      adminNote: note,
      rejectionReason: !isApproved ? note : undefined,
      status: isApproved ? 'completion_in_progress' : 'rejected',
      completionChecklist: isApproved ? {
        approvalRecorded: true,
        purchaseOrderGenerated: false,
        vendorSelected: false,
        purchaseCompleted: false,
        equipmentReceived: false,
        inventoryUpdated: false,
        requesterConfirmed: false,
      } : null,
      timeline: req?.timeline.map(t =>
        t.step === 'Administration Sanction'
          ? { ...t, status: 'done', timestamp }
          : t.step === 'Completion Checklist' && isApproved
          ? { ...t, status: 'active' }
          : t
      ),
    });
    addActivity({
      id: `ACT${Date.now()}`,
      requestId: id,
      requestName: req?.item,
      action: isApproved ? 'SANCTIONED' : 'REJECTED',
      actor: 'Dean — Dr. Arun Mehta',
      actorRole: 'admin',
      timestamp,
      relativeTime: 'Just now',
      message: isApproved
        ? `${id} sanctioned (₹${req?.estimatedCost?.toLocaleString('en-IN')}). Completion checklist started.`
        : `${id} rejected. Removed from active workflow. Preserved in history.`,
      category: 'fund',
    });
  };

  const updateChecklistItem = (id, itemKey, value) => {
    const req = fundRequests.find(r => r.id === id);
    if (!req?.completionChecklist) return;
    const updated = { ...req.completionChecklist, [itemKey]: value };
    const allDone = Object.values(updated).every(Boolean);
    updateFundRequest(id, {
      completionChecklist: updated,
      status: allDone ? 'completed' : 'completion_in_progress',
      timeline: allDone ? req.timeline.map(t =>
        t.step === 'Completed' ? { ...t, status: 'done', timestamp: new Date().toISOString() }
        : t.step === 'Completion Checklist' ? { ...t, status: 'done', timestamp: new Date().toISOString() }
        : t
      ) : req.timeline,
    });
    if (allDone) {
      addActivity({
        id: `ACT${Date.now()}`,
        requestId: id,
        requestName: req?.item,
        action: 'COMPLETED',
        actor: 'System',
        actorRole: 'automated',
        timestamp: new Date().toISOString(),
        relativeTime: 'Just now',
        message: `${id} marked COMPLETED. All checklist items confirmed.`,
        category: 'fund',
      });
    }
  };

  const activeRequests = [
    ...scholarships.filter(s => !['rejected', 'completed'].includes(s.status)),
    ...fundRequests.filter(r => !['rejected', 'completed'].includes(r.status)),
  ];

  const historyRequests = [
    ...scholarships.filter(s => ['rejected', 'completed'].includes(s.status)),
    ...fundRequests.filter(r => ['rejected', 'completed'].includes(r.status)),
  ];

  return (
    <AppContext.Provider value={{
      scholarships, fundRequests, activity,
      selectedCompanyId, setSelectedCompanyId,
      facultyVerifyScholarship, adminReviewScholarship,
      facultyReviewFund, adminSanctionFund,
      updateChecklistItem,
      activeRequests, historyRequests,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
