"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu, X, GraduationCap, ChevronDown } from "lucide-react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState("/")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Set active link based on current path on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActiveLink(window.location.pathname)
    }
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programs" },
    { href: "/faculty", label: "Faculty" },
    { href: "/rankers", label: "Rankers" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ]

  const handleLinkClick = (href: string) => {
    setActiveLink(href)
    setMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-800/50"
          : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" onClick={() => handleLinkClick("/")} className="flex items-center gap-3 group cursor-pointer relative">
            <div className="relative">
              <div className="relative rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Image src="/Logo/logo1.png" alt="Momentum Logo" width={50} height={50} className="rounded-full" />
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="font-bold text-xl tracking-tight text-[#0e266d] group-hover:text-[#163a9c] transition-all duration-300">
                Momentum
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold tracking-wider uppercase">
                Science Academy
              </div>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                  activeLink === link.href
                    ? "text-[#0e266d] dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-300 hover:text-[#0e266d] dark:hover:text-blue-400"
                }`}
              >
                {link.label}

                {/* Active indicator */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#0e266d] dark:bg-blue-500 rounded-full transition-all duration-300 ${
                    activeLink === link.href ? "w-8" : "w-0 group-hover:w-6"
                  }`}
                />

                {/* Hover background */}
                <span className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="/login">
              <Button
                variant="ghost"
                className="font-semibold text-white bg-[#0e266d] hover:bg-[#163a9c] dark:text-white transition-all duration-300"
              >
                Login
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 relative group"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="absolute inset-0 bg-[#0e266d]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700 dark:text-slate-300 relative z-10" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300 relative z-10" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? "max-h-[700px] opacity-100 pb-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-900/50 rounded-2xl px-2">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={`block px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                  activeLink === link.href
                    ? "bg-[#0e266d] text-white shadow-lg shadow-[#0e266d]/20"
                    : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-center justify-between relative z-10">
                  <span>{link.label}</span>
                  {activeLink === link.href && (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </div>
                
                {/* Hover effect */}
                {activeLink !== link.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0e266d]/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </a>
            ))}

            {/* Mobile Auth Section */}
            <div className="pt-4 mt-4 border-t-2 border-slate-200 dark:border-slate-800">
              <a href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  className="w-full font-semibold text-white bg-[#0e266d] hover:bg-[#163a9c] transition-all duration-300 h-12 text-base shadow-lg hover:shadow-xl"
                >
                  Login to Your Account
                </Button>
              </a>
            </div>

            {/* Mobile Menu Footer */}
            <div className="pt-4 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                © 2025 Momentum Science Academy
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}