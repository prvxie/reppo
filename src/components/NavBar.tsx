import { Link, useLocation } from "wouter";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/faq", label: "FAQ" },
];

export function NavBar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/8 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center text-xl font-black tracking-tighter uppercase">
          <span className="text-white">ivera</span>
          <span className="text-white/25 font-light">.priv</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = location === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                  active ? "text-white" : "text-white/40 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
