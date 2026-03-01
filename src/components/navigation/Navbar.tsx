import { Link } from "react-router-dom";
import Container from "../layout/Container";
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-black/5 bg-background">
      <Container>
        <nav className="h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/">
              <img
                src={logo}
                alt="Urinrin logo"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <ul className="hidden md:flex items-center gap-8 text-md font-body text-foreground/80">
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/tracker">Deep Work</Link>
              </li>
            </ul>
          </div>

          <Link
            to="/contact"
            className="text-md font-body text-foreground hover:opacity-70 transition"
          >
            Book A Call ↗
          </Link>
        </nav>
      </Container>
    </header>
  );
}
