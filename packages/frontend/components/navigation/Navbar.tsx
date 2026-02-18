import Link from "next/link";
import { useRouter } from "next/router";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

const NAV = [
  { label: "HOME", href: "/" },
  { label: "NEWS", href: "/news" },
  { label: "TIPS", href: "/tips" },
  { label: "CONTACT US", href: "/fixtures" },
  { label: "ADVERTISE", href: "/shop" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const router = useRouter();

  return (
    <header className="relative z-50 w-full bg-[#050505]">
      <div className="relative border-b border-white/5">
        {/* Global Bottom Track (The thin line across the screen) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF4800] to-transparent opacity-60" />
        </div>

        {/* Top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/5" />

        <Container>
          <div className="flex h-[px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="FootyIQ"
                className="h-8 w-auto object-contain"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden h-full items-center gap-12 md:flex">
              {NAV.map((item) => {
                const active = isActive(router.pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    // h-[80px] ensures the link hits the bottom of the navbar
                    className={`group relative flex h-[56px] items-center justify-center text-[13px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${
                      active ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    <span className="relative z-10">{item.label}</span>

                    {/* === THE ACTIVE UNDERLINE (No Glow) === */}
                    {active && (
                      // 1. Positioned absolute bottom-0
                      // 2. Centered with left-1/2 -translate-x-1/2
                      // 3. w-[140%] makes it wider than the text
                      // 4. h-[3px] gives it thickness
                      // 5. No shadow or blur classes
                      <span className="absolute bottom-0 left-1/2 z-20 h-[3px] w-[140%] -translate-x-1/2 bg-[#FF4800]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-8">
              <Link
                href="/signin"
                className="hidden text-[13px] font-medium text-white/70 hover:text-white md:inline"
              >
                Sign In
              </Link>

              <Button href="/tips">GET TIPS</Button>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
