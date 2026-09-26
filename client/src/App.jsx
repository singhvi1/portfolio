import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './admin/components/ProtectedRoute.jsx'
import AdminLayout from './admin/components/AdminLayout.jsx'
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
// Route-based code splitting: each page ships as its own chunk,
// only loaded when the user actually navigates there.
const Home = lazy(() => import('./pages/Home.jsx'))
const Projects = lazy(() => import('./pages/Projects.jsx'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'))
const Journey = lazy(() => import('./pages/Journey.jsx'))
const Dsa = lazy(() => import('./pages/Dsa.jsx'))
const Technologies = lazy(() => import('./pages/Technologies.jsx'))
const Experience = lazy(() => import('./pages/Experience.jsx'))
const AiLab = lazy(() => import('./pages/AiLab.jsx'))
const Articles = lazy(() => import('./pages/Articles.jsx'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail.jsx'))
const About = lazy(() => import('./pages/About.jsx'))

// Superseded by Journey/Technologies above. Redirected rather than
// deleted outright, so no bookmarked/shared URL 404s — but the old
// static-data pages themselves are removed from the bundle since nothing
// renders them anymore.

// Admin
const Login = lazy(() => import('./admin/pages/Login.jsx'))
const Dashboard = lazy(() => import('./admin/pages/Dashboard.jsx'))
const EntityList = lazy(() => import('./admin/pages/EntityList.jsx'))
const EntityForm = lazy(() => import('./admin/pages/EntityForm.jsx'))
const ProjectList = lazy(() => import('./admin/pages/projects/ProjectList.jsx'))
const ProjectForm = lazy(() => import('./admin/pages/projects/ProjectForm.jsx'))
const ArticleList = lazy(() => import('./admin/pages/articles/ArticleList.jsx'))
const ArticleForm = lazy(() => import('./admin/pages/articles/ArticleForm.jsx'))
const JourneyList = lazy(() => import('./admin/pages/journey/JourneyList.jsx'))
const JourneyForm = lazy(() => import('./admin/pages/journey/JourneyForm.jsx'))

function PageFallback() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 font-mono text-sm text-text-muted">
      loading...
    </div>
  )
}

function AdminPageFallback() {
  return (
    <div className="px-6 py-24 font-mono text-sm text-text-muted">
      loading...
    </div>
  )
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public site — Navbar + Footer */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
        <Route path="/projects/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
        <Route path="/journey" element={<PublicLayout><Journey /></PublicLayout>} />
        <Route path="/dsa" element={<PublicLayout><Dsa /></PublicLayout>} />
        <Route path="/technologies" element={<PublicLayout><Technologies /></PublicLayout>} />
        <Route path="/experience" element={<PublicLayout><Experience /></PublicLayout>} />
        <Route path="/ai-lab" element={<PublicLayout><AiLab /></PublicLayout>} />
        <Route path="/articles" element={<PublicLayout><Articles /></PublicLayout>} />
        <Route path="/articles/:slug" element={<PublicLayout><ArticleDetail /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />

        {/* Superseded routes — redirected, not deleted, so no old URL 404s */}
        <Route path="/log" element={<Navigate to="/journey" replace />} />
        <Route path="/log/:slug" element={<Navigate to="/journey" replace />} />
        <Route path="/skills" element={<Navigate to="/technologies" replace />} />

        {/* Admin — no public Navbar/Footer, its own layout + auth guard */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminPageFallback />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Suspense fallback={<AdminPageFallback />}>
                  <Routes>
                    <Route index element={<Dashboard />} />

                    {/* Projects has its own richer form/list (all schema fields) */}
                    <Route path="projects" element={<ProjectList />} />
                    <Route path="projects/new" element={<ProjectForm />} />
                    <Route path="projects/:id" element={<ProjectForm />} />

                    {/* Articles has its own list/form for publish/draft handling */}
                    <Route path="articles" element={<ArticleList />} />
                    <Route path="articles/new" element={<ArticleForm />} />
                    <Route path="articles/:id" element={<ArticleForm />} />

                    {/* Journey is keyed by month, not a Mongo id */}
                    <Route path="journey" element={<JourneyList />} />
                    <Route path="journey/new" element={<JourneyForm />} />
                    <Route path="journey/:month" element={<JourneyForm />} />

                    {/* Remaining 6 entities: config-driven generic list/form */}
                    <Route path=":entity" element={<EntityList />} />
                    <Route path=":entity/new" element={<EntityForm />} />
                    <Route path=":entity/:id" element={<EntityForm />} />
                    {/* Admin fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        {/* Public fallback — LAST */}
        <Route path="*"
          element={<PublicLayout><NotFound /></PublicLayout>
          }
        />
      </Routes>
    </Suspense>
  )
}
