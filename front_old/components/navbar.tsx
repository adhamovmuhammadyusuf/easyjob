'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Bell, Settings, Briefcase, ChevronDown } from "lucide-react";
import { getAuthState, logout } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authState, setAuthState] = useState(getAuthState());
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthState(getAuthState());
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    setAuthState(getAuthState());
  };

  const menuItems = [
    { href: "/", label: "Bosh sahifa" },
    { href: "/jobs", label: "Vakansiyalar" },
    { href: "/companies", label: "Kompaniyalar" },
    { href: "/contact", label: "Aloqa" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-lg backdrop-blur-lg' 
        : 'bg-white/70 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900 transition-all duration-300">
                EasyJob
              </span>
            </Link>
          </div>

          {isMobile ? (
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          ) : (
            <>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="relative group px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hidden md:flex items-center">
                {mounted && (
                  <div className="flex items-center space-x-4">
                    {authState.isAuthenticated ? (
                      <>
                        <button className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110">
                          <Bell className="h-5 w-5" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:bg-gray-50 rounded-full px-4 py-2">
                            <User className="h-5 w-5" />
                            <span>{authState.user?.first_name} {authState.user?.last_name}</span>
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem asChild>
                              <Link href="/profile" className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span>Profile</span>
                              </Link>
                            </DropdownMenuItem>
                            {authState.user?.user_type === 'job_seeker' ? (
                              <DropdownMenuItem asChild>
                                <Link href="/applications" className="flex items-center">
                                  <Briefcase className="h-4 w-4 mr-2" />
                                  <span>My Applications</span>
                                </Link>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem asChild>
                                <Link href="/dashboard" className="flex items-center">
                                  <Briefcase className="h-4 w-4 mr-2" />
                                  <span>Dashboard</span>
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <Link href="/settings" className="flex items-center">
                                <Settings className="h-4 w-4 mr-2" />
                                <span>Settings</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={handleLogout}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              <span>Chiqish</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-50 rounded-full"
                        >
                          Kirish
                        </Link>
                        <Link
                          href="/signup"
                          className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Ro'yxatdan o'tish
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isMobile && isOpen && mounted && (
        <div
          className="md:hidden bg-white/95 backdrop-blur-lg border-t shadow-lg transition-all duration-300 ease-in-out"
          style={{
            opacity: isOpen ? 1 : 0,
            maxHeight: isOpen ? '1000px' : '0',
            overflow: 'hidden'
          }}
        >
          <div className="px-4 pt-2 pb-3 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {authState.isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5 mr-2" />
                  <span>{authState.user?.first_name} {authState.user?.last_name}</span>
                </Link>
                {authState.user?.user_type === 'job_seeker' ? (
                  <Link
                    href="/applications"
                    className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span>My Applications</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={(e) => {
                    handleLogout(e);
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Chiqish</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Kirish
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

