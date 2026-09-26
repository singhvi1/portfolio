export default {
  id: 'dev-portfolio',
  name: 'Developer Portfolio & Journey Platform',
  shortDescription:
    'This site. A React + Redux portfolio that doubles as a monthly engineering journal and a living record of projects, skills, and growth.',
  problemSolved:
    'A static resume goes stale and can\u2019t show trajectory. This platform makes engineering growth visible over time and gives a single, always-current place to point recruiters and interviewers to.',
  keyFeatures: [
    'Monthly developer journal with a git-commit-style timeline',
    'Filterable projects section with tech-tag filtering via Redux',
    'Skills tracking by category and proficiency',
    'Evolving into a full Developer Journey platform with DSA tracking, articles, AI experiments, and an admin dashboard (in progress)',
  ],
  techStack: {
    frontend: ['React 18', 'Redux Toolkit', 'React Router', 'Tailwind CSS', 'Vite'],
  },
  tags: ['React', 'Redux Toolkit', 'Tailwind CSS', 'Vite'],
  githubUrl: 'https://github.com/singhvi1', // profile, not repo-specific — update via /admin if you want the exact repo link
  liveUrl: null,
  myRole: 'Sole developer.',
  technicalChallenges: [],
  whatILearned: [
    'Route-based code splitting with React.lazy + Suspense',
    'Structuring Redux Toolkit slices for shared UI state (filters, nav)',
    'Designing a data model that migrates cleanly from static files to a real backend',
  ],
  featured: false, // not counted among the 5 featured dev projects — kept separate as the portfolio app itself
  isPortfolioApp: true, // lets the UI/admin distinguish this from real showcase projects
  category: 'Full-Stack',
  startDate: '2026-08',
  completionDate: null,
  month: '2026-08',
};
