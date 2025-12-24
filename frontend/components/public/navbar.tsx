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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programs" },
    { href: "/faculty", label: "Faculty" },
    { href: "/rankers", label: "Rankers" },
    { href: "/gallery", label: "Gallery" },
    // { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-800/50"
        : "bg-white/60 dark:bg-slate-950/60 backdrop-blur-md"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <a href="/" className="flex items-center gap-3 group cursor-pointer relative">
            <div className="relative">
              {/* Animated background glow */}
              {/* <div className="absolute -inset-2 bg-[#0e266d] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500 animate-pulse" /> */}

              {/* Logo container */}
              <div className="relative  rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl">
                <Image src="/Logo/logo1.png" alt={"logo"} width={50} height={50} className=" rounded-full" /> 
              </div>
            </div>


            <div className="hidden sm:block">
              <div className="font-bold text-xl tracking-tight bg-[#0e266d] bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-300">
                Momentum
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold tracking-wider uppercase">
                Science Academy
              </div>
            </div>
          </a>

          {/* Enhanced Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group ${activeLink === link.href
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
              >
                {link.label}

                {/* Active indicator */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ${activeLink === link.href ? "w-8" : "w-0 group-hover:w-6"
                    }`}
                />

                {/* Hover background */}
                <span className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </a>
            ))}
          </div>

          {/* Enhanced Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="/login">
              <Button
                variant="ghost"
                className="font-semibold text-white bg-[#0e266d] hover:bg-[#163a9c] dark:text-white transition-all duration-300"
              >
                Login
              </Button>
            </a>
            {/* <a href="/login?register=true">
              <Button className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group border-0">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ChevronDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </a> */}
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 relative group"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700 dark:text-slate-300 relative z-10" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300 relative z-10" />
            )}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? "max-h-[600px] opacity-100 mb-6" : "max-h-0 opacity-0"
            }`}
        >
          <div className="py-4 space-y-1">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.href)
                  setMobileMenuOpen(false)
                }}
                className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${activeLink === link.href
                  ? "bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-4 border-transparent"
                  }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: mobileMenuOpen ? "slideIn 0.3s ease-out forwards" : "none"
                }}
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-800 mt-4">
              <a href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full font-semibold border-2 border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                >
                  Login
                </Button>
              </a>
              {/* <a href="/login?register=true" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                  Get Started
                </Button>
              </a> */}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  )
}