"use client";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image

export default function Nav() {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="flex h-20 w-full items-center px-4 md:px-6 bg-gray-900 text-white backdrop-blur-md">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden text-white border-white">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-gray-900 text-white">
          {/* Logo in Mobile Menu */}
          <Link href="/" className="mr-6 flex items-center" prefetch={false}>
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="ml-2 text-lg font-bold">CineGasm</span>
          </Link>
          <div className="grid gap-2 py-6">
            {navItems.map((i) => (
              <Link
                key={i.name}
                href={i.href}
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                {i.name}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Logo in Navbar */}
      <Link href="/" className="mr-6 flex items-center" prefetch={false}>
        <Image src="/logo.png" alt="Logo" width={50} height={50} priority />
        <span className="ml-2 text-lg font-bold">CineGasm</span>
      </Link>

      {/* Navigation Links */}
      <nav className="ml-auto hidden lg:flex gap-6 backdrop-blur-md">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium transition hover:bg-red-500 hover:text-white focus:outline-none"
            prefetch={false}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}

// Menu Icon Component
function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
