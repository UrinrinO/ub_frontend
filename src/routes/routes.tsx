import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import AppLayout from "../components/layout/AppLayout";
import AdminLayout from "../components/layout/AdminLayout";
import PasswordGate from "../components/ui/PasswordGate";

import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Projects from "../pages/projects/Projects";
import Blog from "../pages/blog/Blog";
import Contact from "../pages/contact/Contact";
import Tracker from "../pages/tracker/Tracker";
import WeeklyReport from "../pages/tracker/WeeklyReport";
import BlogPost from "../pages/blog/BlogPost";
import ProjectPost from "../pages/projects/ProjectPost";
import Notes from "../pages/notes/Notes";
import SeriesDetail from "../pages/notes/SeriesDetail";
import PartDetail from "../pages/notes/PartDetail";

import Dashboard from "../pages/admin/Dashboard";
import BlogList from "../pages/admin/BlogList";
import BlogEditor from "../pages/admin/BlogEditor";
import ProjectsList from "../pages/admin/ProjectsList";
import ProjectEditor from "../pages/admin/ProjectEditor";
import TrackerView from "../pages/admin/TrackerView";
import AdminReport from "../pages/admin/AdminReport";
import NotesList from "../pages/admin/NotesList";
import PartEditor from "../pages/admin/PartEditor";
import ResourcesList from "../pages/admin/ResourcesList";
import ResourceEditor from "../pages/admin/ResourceEditor";

export default function AppRoutes() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      {/* Public site */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectPost />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/engineering-notes" element={<Notes />} />
        <Route path="/engineering-notes/:slug" element={<SeriesDetail />} />
        <Route path="/engineering-notes/:slug/:partSlug" element={<PartDetail />} />
        <Route
          path="/tracker"
          element={
            <PasswordGate
              storageKey="tracker_auth"
              password={import.meta.env.VITE_TRACKER_PASSWORD ?? ""}
            >
              <Tracker />
            </PasswordGate>
          }
        />
        <Route
          path="/report"
          element={
            <PasswordGate
              storageKey="report_auth"
              password={import.meta.env.VITE_REPORT_PASSWORD ?? ""}
            >
              <WeeklyReport />
            </PasswordGate>
          }
        />
      </Route>

      {/* Admin portal — password protected, own layout */}
      <Route
        path="/admin"
        element={
          <PasswordGate
            storageKey="admin_auth"
            password={import.meta.env.VITE_ADMIN_PASSWORD ?? ""}
          >
            <AdminLayout />
          </PasswordGate>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/new" element={<BlogEditor />} />
        <Route path="blog/:id" element={<BlogEditor />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="projects/new" element={<ProjectEditor />} />
        <Route path="projects/:id" element={<ProjectEditor />} />
        <Route path="tracker" element={<TrackerView />} />
        <Route path="report" element={<AdminReport />} />
        <Route path="notes" element={<NotesList />} />
        <Route path="notes/:seriesId/parts/new" element={<PartEditor />} />
        <Route path="notes/:seriesId/parts/:partId" element={<PartEditor />} />
        <Route path="resources" element={<ResourcesList />} />
        <Route path="resources/new" element={<ResourceEditor />} />
        <Route path="resources/:id" element={<ResourceEditor />} />
      </Route>
    </Routes>

    </>
  );
}
