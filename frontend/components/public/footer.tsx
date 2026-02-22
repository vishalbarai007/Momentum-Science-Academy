"use client";

import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Instagram,
  Linkedin,
  Youtube, // Added Youtube icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Footer() {
  // Define social links for better maintainability
  const socialLinks = [
    {
      Icon: Instagram,
      href: "https://www.instagram.com/momentum_science_acadmey/",
      label: "Instagram",
    },
    {
      Icon: Linkedin,
      href: "https://www.linkedin.com/in/momentum-science-academy-0279aa3a8/",
      label: "LinkedIn",
    },
    {
      Icon: Youtube,
      href: "https://youtube.com/@momentum-science-academy?si=m0DYGXH-pipFUiOh",
      label: "YouTube",
    },
  ];

  return (
    <footer className="relative bg-linear-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
      {/* ... decorative elements stay the same ... */}

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl">
                <Image src="/Logo/logo1.png" alt="logo" width={50} height={50} className="rounded-full" />
              </div>
              <div>
                <div className="font-bold text-lg">Momentum</div>
                <div className="text-xs text-primary-foreground/70">Science Academy</div>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4">
              Empowering students with excellence in science education since 2009. Your trusted partner for JEE, NEET,
              and board exam success.
            </p>

            {/* Updated Social Links Section */}
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank" // Opens in new tab
                  rel="noopener noreferrer" // Security best practice
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/programs", label: "Our Programs" },
                { href: "/faculty", label: "Expert Faculty" },
                { href: "/gallery", label: "Gallery" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-bold text-lg mb-6">Programs</h4>
            <ul className="space-y-3">
              {[
                "JEE Main & Advanced",
                "NEET Preparation",
                "MHT-CET Coaching",
                "Foundation (7-10)",
                "Board Exam Prep",
              ].map((program) => (
                <li key={program}>
                  <Link
                    href="/programs"
                    className="text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{program}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-accent" />
                <span className="text-primary-foreground/80 text-sm">
                  Rashmi Villa Complex 6,
                  <br />
                  Near Agarwal Circle, next to Galaxy Hotel
                  <br />
                  Vasai East, Mumbai - 401208
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <a
                  href="tel:+919823788328"
                  className="text-primary-foreground/80 text-sm hover:text-accent transition-colors"
                >
                  +91 98237 88328
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <a
                  href="mailto:momentumscienceacademy@gmail.com"
                  className="text-primary-foreground/80 text-sm hover:text-accent transition-colors"
                >
                  momentumscienceacademy
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-primary-foreground/80 text-sm">Mon-Sat: 9 AM - 9 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              &copy; {new Date().getFullYear()} Momentum Science Academy. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-primary-foreground/60">
              <Link href="/privacy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
