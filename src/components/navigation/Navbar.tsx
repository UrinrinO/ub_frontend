import { useState } from "react";
import { Link } from "react-router-dom";
import { RiMenuLine, RiCloseLine } from "@remixicon/react";
import Container from "../layout/Container";
import logo from "../../assets/images/logo.png";

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/tracker", label: "Deep Work" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-black/5 bg-background">
      <Container>
        <nav className="h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" onClick={() => setOpen(false)}>
              <img
                src={logo}
                alt="Urinrin logo"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <ul className="hidden md:flex items-center gap-8 text-md font-body text-foreground/80">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="hidden md:block text-md font-body text-foreground hover:opacity-70 transition"
            >
              Book A Call ↗
            </Link>

            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-black/5 bg-background">
          <Container>
            <ul className="flex flex-col py-4 font-body text-foreground/80">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-base hover:text-foreground transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 pt-2 border-t border-black/5">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-foreground hover:opacity-70 transition"
                >
                  Book A Call ↗
                </Link>
              </li>
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}
