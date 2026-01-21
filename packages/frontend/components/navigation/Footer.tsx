import Link from "next/link";
import { Container } from "../layout/Container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 py-10">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-lg font-extrabold">
              Footy<span className="text-[var(--accent)]">IQ</span>
            </div>
            <p className="mt-2 max-w-md text-sm text-white/60">
              Football intelligence: news, match tips, and analysis built for
              the thinking fan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-semibold">Explore</div>
              <Link
                className="block text-sm text-white/60 hover:text-white"
                href="/news"
              >
                News
              </Link>
              <Link
                className="block text-sm text-white/60 hover:text-white"
                href="/tips"
              >
                Tips
              </Link>
              <Link
                className="block text-sm text-white/60 hover:text-white"
                href="/shop"
              >
                Shop
              </Link>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold">Account</div>
              <Link
                className="block text-sm text-white/60 hover:text-white"
                href="/signin"
              >
                Sign in
              </Link>
              <Link
                className="block text-sm text-white/60 hover:text-white"
                href="/signup"
              >
                Create account
              </Link>
              <Link
                className="block text-sm text-white/60 hover:text-white"
                href="/pricing"
              >
                Pricing
              </Link>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold">Legal</div>
              <span className="block text-sm text-white/60">
                © {new Date().getFullYear()} FootyIQ
              </span>
              <span className="block text-sm text-white/60">
                Terms • Privacy
              </span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
