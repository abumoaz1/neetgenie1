"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProfileDropdown } from "@/components/profile-dropdown";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        
        if (token) {
          setIsLoggedIn(true);
          
          if (userString) {
            try {
              const user = JSON.parse(userString);
              setUserName(user.name || '');
            } catch (error) {
              console.error('Error parsing user data', error);
            }
          }
        } else {
          setIsLoggedIn(false);
          setUserName('');
        }
      }
    };

    checkAuthStatus();
    
    // Listen for storage events (for multi-tab support)
    window.addEventListener('storage', checkAuthStatus);
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    // Clear auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('remember_expiry');
    
    // Update state
    setIsLoggedIn(false);
    setUserName('');
    
    // Redirect to home page
    router.push('/');
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/mock-tests", label: "Mock Tests" },
    { href: "/study-materials", label: "Study Materials" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded text-white p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span className="text-xl font-bold ml-1">NEET<span className="text-green-500">Genie</span></span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-blue-600 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>
          <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <ProfileDropdown />
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hover:text-blue-600 transition-colors" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/20" size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="hover:bg-blue-50 transition-colors">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] sm:w-[350px] pr-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <div className="flex flex-col items-center justify-center flex-1 px-6 pt-10">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 mb-8 transition-transform duration-300 hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="bg-blue-600 rounded text-white p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
                  <span className="text-xl font-bold">NEET<span className="text-green-500">Genie</span></span>
                </Link>
                <nav className="flex flex-col w-full">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="py-3 text-center text-lg font-medium border-b border-gray-100 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="flex flex-col w-full gap-3 mt-8">                {isLoggedIn ? (
                    <>
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-16 w-16 rounded-full bg-blue-600 text-white text-xl flex items-center justify-center font-bold border-2 border-blue-200">
                            {userName ? userName.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{userName || 'User'}</div>
                            <div className="text-xs text-muted-foreground capitalize">Student</div>
                          </div>
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="w-full transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600 flex gap-2 items-center justify-center"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  ): (
                    <>
                      <SheetClose asChild>
                        <Button variant="outline" size="lg" className="w-full transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600" asChild>
                          <Link href="/login">Log in</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/20 hover:translate-y-[-2px]" asChild>
                          <Link href="/signup">Sign up</Link>
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}