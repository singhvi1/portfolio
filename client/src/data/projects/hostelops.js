// Real data extracted from uploaded project analysis
// (1786258573301_HMS-Portfolio-Analysis.md)

export default {
  id: 'hostelops',
  name: 'HostelOps — Hostel Operations & Room Allocation Platform',
  shortDescription:
    'A full-stack hostel operations platform that digitizes student accommodation workflows: two-phase room allotment, document verification, complaints, leave management, payments, announcements, and admin reporting.',
  problemSolved:
    'Manual hostel administration (room assignment, verification, complaint tracking, leave requests) is error-prone and doesn\u2019t handle concurrency — two students can be allotted the same room, or a rejected student can leave a room stuck in limbo. This platform brings the whole process into one role-based system with real allocation-state safety.',
  keyFeatures: [
    'Two-phase room allotment workflow with explicit states: PENDING, TEMP_LOCKED, ALLOTTED, CANCELLED, VERIFIED, REJECTED',
    'Atomic room allocation using MongoDB conditional updates to prevent over-allocation under concurrent requests',
    'MongoDB transactions keeping user creation, student registration, and room reservation consistent',
    'Role-based access control for Admin, Staff, and Student via JWT + reusable Express middleware',
    'MongoDB aggregation pipelines for verification-request search, filtering, joining, sorting, pagination',
    'Cloudinary-based document/image upload with validation, size limits, and cleanup',
    'Excel exports (ExcelJS) and server-side PDF generation (Puppeteer) for admin reporting',
    'QR code generation for student-related documents',
    'Complaint/maintenance tracking, leave management, payments, and announcement system',
  ],
  techStack: {
    frontend: ['React 19', 'React Router', 'Redux Toolkit', 'Axios', 'Tailwind CSS', 'Vite', 'Lucide React', 'React Hot Toast'],
    backend: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'bcryptjs'],
    infra: ['Cloudinary', 'Puppeteer', 'ExcelJS', 'QRCode', 'express-rate-limit', 'cookie-parser', 'CORS'],
  },
  tags: ['React', 'Redux Toolkit', 'Node.js', 'Express', 'MongoDB', 'JWT'],
  githubUrl: null, // TODO: add via /admin — not provided
  liveUrl: null, // TODO: add via /admin — not provided
  myRole:
    'Full-stack developer — designed the MongoDB schema and allotment state machine, implemented atomic/transactional allocation logic, built the RBAC auth layer, and built the React frontend with reusable hooks, lazy loading, and pagination.',
  technicalChallenges: [
    {
      problem: 'Two students could request the same room at the same time, risking over-allocation beyond room capacity.',
      approach:
        'Used MongoDB conditional (atomic) updates rather than read-then-write logic, so a room can only be reserved if it still has capacity at the moment of the update — closing the race condition.',
    },
    {
      problem:
        'A multi-step signup involved creating a user, a student record, and a room reservation together — a failure partway through would leave inconsistent data.',
      approach:
        'Wrapped the multi-document writes in a MongoDB transaction so the whole sequence commits or rolls back together.',
    },
    {
      problem: 'Verification-request search needed filtering, joining, sorting, and pagination across related collections.',
      approach: 'Built MongoDB aggregation pipelines instead of application-side joins, backed by compound and partial indexes for performance.',
    },
  ],
  whatILearned: [
    'Moving from CRUD thinking to state-machine thinking for workflows with real business constraints',
    'MongoDB transactions, atomic conditional updates, and aggregation pipelines',
    'Compound, unique, and partial indexes for enforcing business rules at the database layer',
    'Structuring RBAC across three user roles with reusable Express middleware',
    'Production concerns beyond the happy path: rollback on rejection, file cleanup, rate limiting, pagination at scale',
  ],
  featured: true,
  category: 'Full-Stack',
  startDate: null, // TODO: confirm actual date
  completionDate: null,
  month: '2026-08',
};
