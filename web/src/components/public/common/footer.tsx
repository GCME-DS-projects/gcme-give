import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="relative w-48 h-16 mb-4">
              <Image
                src="/logo/gcme-logo-white.png"
                alt="Great Commission Ethiopia Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-neutral-300 text-sm">
              Empowering Ethiopian missionaries to spread hope, love, and
              transformation in communities across all regions of Ethiopia.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary-300">
              Get Involved
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link
                  href="/partnership"
                  className="hover:text-primary-300 transition-colors"
                >
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link
                  href="/missionaries"
                  className="hover:text-primary-300 transition-colors"
                >
                  Support Missionaries
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className="hover:text-primary-300 transition-colors"
                >
                  Fund Projects
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary-300">About Us</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary-300 transition-colors"
                >
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/impact"
                  className="hover:text-primary-300 transition-colors"
                >
                  Our Impact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary-300">Connect</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <a
                  href="mailto:info@greatcommissionethiopia.org"
                  className="hover:text-primary-300 transition-colors"
                >
                  info@greatcommissionethiopia.org
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+251 11 555 0123</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-sm text-neutral-400">
          <p>
            &copy; 2024 Great Commission Ethiopia. All rights reserved. | Tax
            ID: ET-123456789
          </p>
        </div>
      </div>
    </footer>
  );
}
