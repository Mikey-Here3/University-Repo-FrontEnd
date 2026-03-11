import { PublicNavbar } from "@/components/layout/public-navbar";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">

      {/* Top accent line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px z-50 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />

      {/* Navbar */}
      <div className="relative z-30">
        <PublicNavbar />
      </div>

      {/* Page content — each page manages its own ambient background */}
      <main className="relative z-10 flex-1">
        {children}
      </main>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Bottom accent line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
    </div>
  );
}