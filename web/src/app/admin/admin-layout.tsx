"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Activity, Users, Target, TrendingUp, User, LogOut } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: Activity },
  { href: "/admin/missionaries", label: "Missionaries", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: Target },
  { href: "/admin/strategies", label: "Strategies", icon: TrendingUp },
];

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  active: boolean;
}

function SidebarLink({ href, label, icon: Icon, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition duration-200 space-x-3
        ${
          active
            ? "bg-white bg-opacity-20 text-[#001F54] shadow-md"
            : "text-white text-opacity-80 hover:bg-white hover:bg-opacity-20 hover:text-[#001F54]"
        }
      `}
    >
      <Icon className={`w-5 h-5 ${active ? "text-[#001F54]" : "text-white"}`} />
      <span>{label}</span>
    </Link>
  );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, isPending: isLoading } = authClient.useSession();
  const user = session?.user;
  const [isMobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f8fb]">
        <div className="text-[#001F54] text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f4f8fb]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#001F54] text-white shadow-xl flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 z-20
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-8 text-center">
          <Image
            src="/logo/gcme-logo-white.png"
            alt="GCME Logo"
            width={128}
            height={128}
            className="mx-auto object-contain"
          />
          </div>
          <nav className="flex-1 space-y-2">
            {navLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                active={pathname === link.href}
              />
            ))}
          </nav>
          <div className="mt-auto pt-6 border-t border-white border-opacity-10">
            <div className="text-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
              <p className="text-xs opacity-70">{user?.email}</p>
              <button
                onClick={handleSignOut}
                className="mt-3 flex items-center justify-center w-full px-3 py-2 text-sm text-white bg-red-600 bg-opacity-90 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-[#001F54] text-white md:hidden"
      >
        <span className="sr-only">Toggle sidebar</span>
        <div className="w-6 h-0.5 bg-white mb-1"></div>
        <div className="w-6 h-0.5 bg-white mb-1"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </button>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
