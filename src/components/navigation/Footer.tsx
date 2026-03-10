import Container from "../layout/Container";

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/5 bg-background">
      <Container>
        <div className="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-sm font-body text-foreground/60">
            &copy; {new Date().getFullYear()} Urinrin Ogidiama. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6 text-sm font-body text-foreground/80">
            <a href="https://github.com/UrinrinO" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
              GitHub
            </a>
            <a href="https://linkedin.com/in/urinrin-ogidiama" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
              LinkedIn
            </a>
            <a href="/engineering-notes" className="hover:text-foreground transition">
              Engineering Notes
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
