// Each config drives both the generic list page (columns) and the generic
// form page (fields) for one entity. Field types are handled by
// FormField.jsx. Fields here are a direct mirror of each Mongoose schema
// in /server/src/models — nothing invented beyond what the backend
// supports. ObjectId-reference array fields (e.g. Technology.relatedProjects,
// Experience.projects, JourneyEntry's linked collections) are intentionally
// left out of these forms for now — they need a searchable picker UI,
// which is a reasonable follow-up rather than part of this pass.

const CATEGORIES = [
  'Programming Languages', 'Frontend', 'Backend', 'Databases', 'Cloud',
  'DevOps', 'APIs', 'AI / ML', 'Tools', 'System Design',
];

export const entityConfigs = {
  technologies: {
    endpoint: '/technologies',
    entityName: 'Technology',
    title: 'Technologies',
    listColumns: [
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'proficiency', label: 'Proficiency' },
      { key: 'monthLearned', label: 'Learned' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: CATEGORIES },
      { name: 'proficiency', label: 'Proficiency', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced'] },
      { name: 'monthLearned', label: 'Month learned', type: 'month', required: true },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'logoUrl', label: 'Logo URL', type: 'url' },
    ],
  },

  dsa: {
    endpoint: '/dsa',
    entityName: 'DSA problem',
    title: 'DSA Problems',
    listColumns: [
      { key: 'problemName', label: 'Problem' },
      { key: 'platform', label: 'Platform' },
      { key: 'difficulty', label: 'Difficulty' },
      { key: 'topic', label: 'Topic' },
      { key: 'dateSolved', label: 'Solved' },
    ],
    fields: [
      { name: 'problemName', label: 'Problem name', type: 'text', required: true },
      { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['LeetCode', 'Codeforces', 'Codewars', 'GeeksforGeeks', 'Other'] },
      { name: 'problemUrl', label: 'Problem URL', type: 'url' },
      { name: 'difficulty', label: 'Difficulty', type: 'select', required: true, options: ['Easy', 'Medium', 'Hard'] },
      { name: 'topic', label: 'Topic', type: 'text', required: true, hint: 'e.g. Arrays, DP, Graphs' },
      { name: 'dateSolved', label: 'Date solved', type: 'date', required: true },
      { name: 'approach', label: 'Approach', type: 'textarea' },
      { name: 'timeComplexity', label: 'Time complexity', type: 'text' },
      { name: 'spaceComplexity', label: 'Space complexity', type: 'text' },
      { name: 'javaSolution', label: 'Java solution', type: 'textarea', rows: 8 },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },

  courses: {
    endpoint: '/courses',
    entityName: 'Course',
    title: 'Courses',
    listColumns: [
      { key: 'courseName', label: 'Course' },
      { key: 'platform', label: 'Platform' },
      { key: 'status', label: 'Status' },
      { key: 'progress', label: 'Progress', render: (c) => `${c.progress ?? 0}%` },
    ],
    fields: [
      { name: 'courseName', label: 'Course name', type: 'text', required: true },
      { name: 'platform', label: 'Platform', type: 'text', required: true },
      { name: 'instructor', label: 'Instructor', type: 'text' },
      { name: 'url', label: 'Course URL', type: 'url' },
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'completionDate', label: 'Completion date', type: 'date' },
      { name: 'progress', label: 'Progress (%)', type: 'number', min: 0, max: 100 },
      { name: 'certificateUrl', label: 'Certificate URL', type: 'url' },
      { name: 'technologies', label: 'Technologies / topics', type: 'tags' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', options: ['Not Started', 'In Progress', 'Completed'] },
    ],
  },

  achievements: {
    endpoint: '/achievements',
    entityName: 'Achievement',
    title: 'Achievements',
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'organization', label: 'Organization' },
      { key: 'date', label: 'Date' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'organization', label: 'Organization', type: 'text' },
      { name: 'url', label: 'URL', type: 'url' },
      { name: 'imageUrl', label: 'Image / certificate URL', type: 'url' },
      {
        name: 'category', label: 'Category', type: 'select', required: true,
        options: ['Certification', 'Hackathon', 'Award', 'Competitive Programming', 'Project Milestone', 'Work Achievement', 'Career Milestone'],
      },
    ],
  },

  experience: {
    endpoint: '/experience',
    entityName: 'Experience',
    title: 'Experience',
    listColumns: [
      { key: 'company', label: 'Company' },
      { key: 'position', label: 'Position' },
      { key: 'startDate', label: 'Start' },
      { key: 'endDate', label: 'End', render: (e) => e.endDate || 'Present' },
    ],
    fields: [
      { name: 'company', label: 'Company', type: 'text', required: true },
      { name: 'position', label: 'Position', type: 'text', required: true },
      { name: 'startDate', label: 'Start date', type: 'month', required: true },
      { name: 'endDate', label: 'End date', type: 'month', hint: 'Leave blank if current' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'employmentType', label: 'Employment type', type: 'select', options: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'] },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'responsibilities', label: 'Responsibilities', type: 'tags' },
      { name: 'technologies', label: 'Technologies', type: 'tags' },
      { name: 'achievements', label: 'Achievements', type: 'tags' },
    ],
  },

  'ai-experiments': {
    endpoint: '/ai-experiments',
    entityName: 'AI Experiment',
    title: 'AI Experiments',
    listColumns: [
      { key: 'name', label: 'Name' },
      { key: 'modelUsed', label: 'Model' },
      { key: 'date', label: 'Date' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'problem', label: 'Problem', type: 'textarea' },
      { name: 'approach', label: 'Approach', type: 'textarea' },
      { name: 'modelUsed', label: 'Model / API used', type: 'text', hint: 'e.g. GPT-4o, Gemini 2.5 Flash, local Llama' },
      { name: 'technologies', label: 'Technologies', type: 'tags' },
      { name: 'architecture', label: 'Architecture', type: 'textarea' },
      { name: 'results', label: 'Results', type: 'textarea' },
      { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
      { name: 'demoUrl', label: 'Demo URL', type: 'url' },
      { name: 'date', label: 'Date', type: 'month', required: true },
      { name: 'whatILearned', label: 'What I learned', type: 'tags' },
    ],
  },
};
