// Real data extracted from uploaded project analysis
// (1786258573301_Developer-Portfolio-Project.md — despite the filename,
// this file documents the Netflix-GPT project, not a portfolio site)

export default {
  id: 'netflix-gpt',
  name: 'Netflix-GPT',
  shortDescription:
    'An AI-powered, Netflix-inspired movie discovery platform where natural-language queries are turned into movie recommendations using Google Gemini, then enriched with real metadata and streaming availability.',
  problemSolved:
    'Traditional Netflix clones only replicate the browsing UI. This project instead solves movie discovery: a user can describe what they want in plain language and get back real, verifiable movie recommendations — not just a UI skin.',
  keyFeatures: [
    'Firebase email/password authentication with signup, login, logout, and auth-state persistence',
    'Natural-language movie search powered by Google Gemini (gemini-2.5-flash)',
    'Movie/streaming metadata via RapidAPI Streaming Availability API',
    'YouTube trailer playback via YouTube Data API, with trailer caching in localStorage',
    'Category-based browsing (Popular, Horror, Sci-Fi, Now Playing, Animation) via custom React hooks',
    'Horizontal movie carousels (Swiper) and a movie-details modal',
    'Multilingual GPT search UI',
  ],
  techStack: {
    frontend: ['React 19', 'Vite', 'Tailwind CSS', 'Redux Toolkit', 'React Router DOM'],
    services: ['Firebase Authentication', 'Google Generative AI (Gemini)', 'RapidAPI Streaming Availability', 'YouTube Data API'],
    tools: ['Swiper', 'Lucide React', 'ESLint'],
  },
  // flattened for card/tag-filter UI compatibility
  tags: ['React', 'Redux Toolkit', 'Firebase', 'Gemini AI', 'Tailwind'],
  githubUrl: null, // TODO: add via /admin — not provided
  liveUrl: null, // TODO: add via /admin — not provided
  myRole:
    'Sole developer. Designed the Redux store (5 slices: user, movies, gpt, config, description), built the Gemini → RapidAPI recommendation pipeline, and implemented Firebase auth state syncing with the UI.',
  technicalChallenges: [
    {
      problem:
        'Gemini returns natural-language text, not guaranteed structured output — parsing it with a naive string split was fragile.',
      approach:
        'Constrained the prompt to a strict format and validated the response shape before using it, with a documented plan to move to structured JSON output for reliability.',
    },
    {
      problem:
        'Movie recommendations needed both AI judgment and factual accuracy (posters, cast, streaming links).',
      approach:
        'Split the responsibility in two: Gemini only generates movie titles from intent, then each title is looked up against RapidAPI in parallel (Promise.all) for verified metadata, rendered through the same MovieCard components used elsewhere in the app.',
    },
  ],
  whatILearned: [
    'How to combine an LLM (for intent understanding) with a factual data API (for accuracy) instead of trusting AI-generated metadata directly',
    'Structuring a multi-slice Redux Toolkit store for a data-heavy app',
    'Firebase auth-state-driven routing (onAuthStateChanged as the source of truth, Redux as the UI-facing cache)',
    'Where NOT to call third-party APIs from — this project currently calls RapidAPI and Gemini directly from the frontend, which exposes API keys; the fix (proxy through a backend) is a known next step',
  ],
  featured: true,
  category: 'Full-Stack / AI',
  startDate: null, // TODO: confirm actual date
  completionDate: null,
  month: '2026-08',
};
