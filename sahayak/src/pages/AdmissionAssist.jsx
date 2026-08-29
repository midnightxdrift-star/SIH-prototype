import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronRight, BookOpen, ArrowRight, ClipboardList, Info } from 'lucide-react';
import ImportanceBadge from '../components/ui/ImportanceBadge';

const ALL_DOCUMENTS = [
  { id: 'admission_letter', label: 'Admission Letter / Allotment', copies: 2, purpose: 'Proof of admission', required: true },
  { id: 'class10', label: 'Class 10 Certificate & Marksheet', copies: 2, purpose: 'Educational qualification', required: true },
  { id: 'class12', label: 'Class 12 Certificate & Marksheet', copies: 2, purpose: 'Educational qualification', required: true },
  { id: 'identity', label: 'Government ID Proof (Aadhaar / PAN)', copies: 2, purpose: 'Identity verification', required: true },
  { id: 'photographs', label: 'Passport Size Photographs', copies: 6, purpose: 'Institute ID, records', required: true },
  { id: 'medical', label: 'Medical Fitness Certificate', copies: 1, purpose: 'Hostel/institute health requirement', required: true },
  { id: 'transfer', label: 'Transfer Certificate (TC)', copies: 1, purpose: 'School leaving record', required: true },
  { id: 'migration', label: 'Migration Certificate', copies: 1, purpose: 'Board migration', required: false, condition: 'If from another board' },
  { id: 'fee_receipt', label: 'Fee Payment Receipt', copies: 1, purpose: 'Proof of payment', required: true },
  { id: 'bank', label: 'Bank Account Details', copies: 1, purpose: 'Scholarship / refund', required: false, condition: 'Required if applying for scholarship' },
  { id: 'category', label: 'Category Certificate (SC/ST/OBC)', copies: 2, purpose: 'Category-based reservation', required: false, condition: 'If applicable' },
];

const STEPS = [
  'Physical reporting at institute gate',
  'Document verification at admin desk',
  'Fee confirmation & administrative formalities',
  'Department reporting & faculty introduction',
  'Hostel registration (if applicable)',
  'Student ID card & library card setup',
  'Academic orientation & timetable',
];

function DocItem({ doc, checked, onToggle }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
        checked
          ? 'border-green-200 bg-green-50'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
      onClick={onToggle}
    >
      {checked
        ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
        : <Circle className="w-5 h-5 text-gray-300 mt-0.5 shrink-0" />
      }
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${checked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
          {doc.label}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-gray-400">{doc.copies} cop{doc.copies !== 1 ? 'ies' : 'y'}</span>
          <span className="text-xs text-gray-400">· {doc.purpose}</span>
          {doc.condition && (
            <span className="text-xs text-blue-500 italic">· {doc.condition}</span>
          )}
        </div>
      </div>
      {!doc.required && (
        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded shrink-0">Optional</span>
      )}
    </div>
  );
}

export default function AdmissionAssist() {
  const [answered, setAnswered] = useState(false);
  const [hostelRequired, setHostelRequired] = useState(false);
  const [scholarship, setScholarship] = useState(false);
  const [program, setProgram] = useState('B.Tech');
  const [checkedDocs, setCheckedDocs] = useState(new Set());

  const relevantDocs = ALL_DOCUMENTS.filter(doc => {
    if (doc.id === 'bank' && !scholarship) return false;
    return true;
  });

  const toggleDoc = (id) => {
    setCheckedDocs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = relevantDocs.length > 0
    ? Math.round((checkedDocs.size / relevantDocs.length) * 100)
    : 0;

  if (!answered) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="page-title">Admission Assist</h1>
          <ImportanceBadge level="admission" />
        </div>
        <p className="text-sm text-gray-500">Personalized guidance for newly admitted students preparing for physical reporting.</p>

        <div className="card p-6 space-y-5">
          <p className="section-title">Tell us about your admission</p>

          <div>
            <label className="label">Program</label>
            <select
              className="input"
              value={program}
              onChange={e => setProgram(e.target.value)}
            >
              <option>B.Tech</option>
              <option>M.Tech</option>
              <option>MBA</option>
              <option>MCA</option>
              <option>Ph.D</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="hostel"
              type="checkbox"
              className="w-4 h-4 rounded text-brand-600"
              checked={hostelRequired}
              onChange={e => setHostelRequired(e.target.checked)}
            />
            <label htmlFor="hostel" className="text-sm text-gray-700 cursor-pointer">
              I require hostel accommodation
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="scholarship"
              type="checkbox"
              className="w-4 h-4 rounded text-brand-600"
              checked={scholarship}
              onChange={e => setScholarship(e.target.checked)}
            />
            <label htmlFor="scholarship" className="text-sm text-gray-700 cursor-pointer">
              I am applying for a scholarship
            </label>
          </div>

          <button
            onClick={() => setAnswered(true)}
            className="btn-primary w-full justify-center py-2.5"
          >
            Generate My Checklist
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="page-title">Your Admission Checklist</h1>
            <ImportanceBadge level="admission" />
          </div>
          <p className="text-sm text-gray-500">{program} · {hostelRequired ? 'Hostel required' : 'Day scholar'} · {scholarship ? 'Scholarship applicant' : 'No scholarship'}</p>
        </div>
        <button onClick={() => setAnswered(false)} className="btn-secondary text-xs">
          Change Details
        </button>
      </div>

      {/* Progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="section-title">Progress</p>
          <span className="text-sm font-bold text-brand-600">{checkedDocs.size} / {relevantDocs.length} documents ready</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {progress < 50
            ? 'Collect and organize your documents before reporting day.'
            : progress < 100
            ? "Almost there! Check off remaining documents."
            : "You're ready for physical reporting! 🎉"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document checklist */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-purple-600" />
            <p className="section-title">Physical Reporting Documents</p>
          </div>
          <div className="space-y-2">
            {relevantDocs.map(doc => (
              <DocItem
                key={doc.id}
                doc={doc}
                checked={checkedDocs.has(doc.id)}
                onToggle={() => toggleDoc(doc.id)}
              />
            ))}
          </div>
          <div className="mt-4 bg-blue-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">
                Click any document to mark it as ready. Bring both originals and photocopies.
              </p>
            </div>
          </div>
        </div>

        {/* Reporting guide */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <p className="section-title">What Happens on Reporting Day?</p>
            </div>
            <div className="space-y-3">
              {STEPS.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700 shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card p-5 bg-purple-50 border-purple-100">
            <p className="text-sm font-semibold text-purple-800 mb-3">Reporting Day Tips</p>
            <ul className="space-y-2">
              {[
                'Arrive at least 30 minutes before your assigned reporting time',
                'Carry documents in a proper folder/file',
                'Keep digital copies of all documents on your phone',
                'Bring your parents/guardian if required by your institution',
                'Fee payment receipt is mandatory — confirm payment online before arriving',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-purple-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
