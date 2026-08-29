import studentsData from '../data/students.json';
import companiesData from '../data/companies.json';

/**
 * Calculate a match score for a student against company requirements.
 * Returns a score 0-100 and a breakdown.
 */
export function calculateMatchScore(student, company) {
  let score = 0;
  const matched = [];
  const missing = [];
  const breakdown = {};

  // 1. Hard eligibility checks (disqualifiers)
  const branchOk = company.branches.includes(student.branch);
  const cgpaOk = student.cgpa >= company.minCGPA;
  const yearOk = student.graduationYear === company.graduationYear;
  const backlogOk = company.backlogsAllowed ? true : student.backlogs === 0;

  const eligible = branchOk && cgpaOk && yearOk && backlogOk;

  // 2. Skill match (40 points)
  const requiredSkills = company.requiredSkills || [];
  const studentSkills = student.skills || [];
  const matchedSkills = requiredSkills.filter(s => studentSkills.includes(s));
  const skillScore = requiredSkills.length > 0
    ? (matchedSkills.length / requiredSkills.length) * 40
    : 40;
  score += skillScore;
  breakdown.skillMatch = Math.round(skillScore);
  matchedSkills.forEach(s => matched.push(s));
  requiredSkills.filter(s => !studentSkills.includes(s)).forEach(s => missing.push(s));

  // 3. Language match (25 points)
  const requiredLangs = company.requiredLanguages || [];
  const studentLangs = student.languages || [];
  const matchedLangs = requiredLangs.filter(l => studentLangs.includes(l));
  const langScore = requiredLangs.length > 0
    ? (matchedLangs.length / requiredLangs.length) * 25
    : 25;
  score += langScore;
  breakdown.languageMatch = Math.round(langScore);

  // 4. CGPA score (20 points)
  const cgpaScore = cgpaOk
    ? Math.min(20, ((student.cgpa - company.minCGPA) / (10 - company.minCGPA)) * 10 + 15)
    : 0;
  score += cgpaScore;
  breakdown.cgpaMatch = Math.round(cgpaScore);
  if (cgpaOk) matched.push(`CGPA ${student.cgpa}`);

  // 5. Portfolio bonus (15 points)
  const portfolioScore = student.portfolio ? 15 : 0;
  score += portfolioScore;
  breakdown.portfolioBonus = portfolioScore;
  if (student.portfolio) matched.push('Portfolio / Projects');

  // Apply penalty for backlogs if not allowed
  if (!backlogOk) score = Math.min(score, 30);
  // Apply branch penalty
  if (!branchOk) score = Math.min(score, 20);

  const finalScore = Math.min(100, Math.round(score));

  return {
    score: finalScore,
    eligible,
    eligibilityReasons: {
      branch: { pass: branchOk, note: branchOk ? `Branch matches (${student.branch})` : `Branch mismatch — requires ${company.branches.join('/')}` },
      cgpa: { pass: cgpaOk, note: cgpaOk ? `CGPA ${student.cgpa} ≥ ${company.minCGPA}` : `CGPA ${student.cgpa} < required ${company.minCGPA}` },
      backlogs: { pass: backlogOk, note: backlogOk ? (student.backlogs === 0 ? 'No backlogs' : `${student.backlogs} backlog(s) — allowed`) : `${student.backlogs} backlog(s) — not allowed` },
      year: { pass: yearOk, note: yearOk ? `Graduation year matches (${student.graduationYear})` : `Graduation year mismatch` },
    },
    breakdown,
    matched,
    missing,
  };
}

/**
 * Rank all students against a company.
 */
export function rankStudents(companyId) {
  const company = companiesData.find(c => c.id === companyId);
  if (!company) return [];

  return studentsData
    .map(student => ({
      student,
      company,
      ...calculateMatchScore(student, company),
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Get all companies
 */
export function getCompanies() {
  return companiesData;
}

/**
 * Calculate priority score for a fund request.
 */
export function calculatePriorityScore(request) {
  const urgencyMap = { critical: 100, high: 75, moderate: 50, low: 25 };
  const importanceMap = { high: 100, moderate: 60, low: 30 };

  const urgencyScore = urgencyMap[request.urgency] ?? 50;
  const studentImpact = Math.min(100, (request.studentsAffected / 500) * 100);
  const academicScore = importanceMap[request.academicImportance] ?? 50;
  const operationalScore = importanceMap[request.operationalImportance] ?? 50;
  const alternativeScore = request.alternativeAvailable ? 0 : 100;

  const raw =
    urgencyScore * 0.25 +
    studentImpact * 0.25 +
    academicScore * 0.20 +
    operationalScore * 0.15 +
    alternativeScore * 0.15;

  return Math.round(Math.min(100, raw));
}

/**
 * Run automated verification checks for a scholarship application.
 */
export function runScholarshipChecks(application) {
  return Object.entries(application.automatedChecks).map(([key, check]) => ({
    key,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
    ...check,
  }));
}
