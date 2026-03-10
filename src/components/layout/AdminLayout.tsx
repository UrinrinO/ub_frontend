import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import {
  RiDashboardLine,
  RiArticleLine,
  RiFolderLine,
  RiTimeLine,
  RiFileList3Line,
  RiArrowLeftLine,
  RiBookOpenLine,
} from "@remixicon/react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: RiDashboardLine, end: true },
  { to: "/admin/blog", label: "Blog", icon: RiArticleLine, end: false },
  { to: "/admin/projects", label: "Projects", icon: RiFolderLine, end: false },
  { to: "/admin/notes", label: "Eng. Notes", icon: RiBookOpenLine, end: false },
  { to: "/admin/tracker", label: "Tracker", icon: RiTimeLine, end: false },
  { to: "/admin/report", label: "Report", icon: RiFileList3Line, end: false },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-[#f5f4f0]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-foreground flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/" className="block">
            <img src={logo} alt="logo" className="h-10 w-auto object-contain brightness-0 invert" />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition w-full"
          >
            <RiArrowLeftLine size={16} />
            Back to site
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
