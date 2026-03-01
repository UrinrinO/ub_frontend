import { Routes, Route } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import PasswordGate from "../components/ui/PasswordGate";

import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Projects from "../pages/projects/Projects";
import Blog from "../pages/blog/Blog";
import Contact from "../pages/contact/Contact";
import Tracker from "../pages/tracker/Tracker";
import WeeklyReport from "../pages/tracker/WeeklyReport";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
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
    </Routes>
  );
}
