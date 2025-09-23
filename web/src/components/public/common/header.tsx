import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage }: HeaderProps) {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/strategies", label: "Strategies" },
    { href: "/missionaries", label: "Missionaries" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm shadow-sm ">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <div className="relative w-32 h-12 md:w-48 md:h-16">
            <Image
              src="/logo/gcme-logo.png"
              alt="Great Commission Ethiopia Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors font-medium relative ${
                currentPage === item.label.toLowerCase()
                  ? "text-primary-600 font-semibold after:absolute after:bottom-[-0.5rem] after:left-0 after:right-0 after:h-0.5 after:bg-primary-600"
                  : "text-neutral-600 hover:text-primary-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
