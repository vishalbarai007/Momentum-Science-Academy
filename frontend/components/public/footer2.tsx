"use client"

import Link from "next/link"
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Instagram,
  Linkedin,
} from "lucide-react"
import Image from "next/image"

export function Footer2() {
  return (
    <footer className="relative bg-linear-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative rounded-full flex items-center justify-center shadow-lg">
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
            <div className="flex gap-3">
              {[Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Icon className="w-4 h-4" />
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
              {["JEE Main & Advanced", "NEET Preparation", "MHT-CET Coaching", "Foundation (7-10)", "Board Exam Prep"].map(
                (program) => (
                  <li key={program}>
                    <Link
                      href="/programs"
                      className="text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span>{program}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
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
                <a href="tel:+919823788328" className="text-primary-foreground/80 text-sm hover:text-accent transition-colors">
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
                <span className="text-primary-foreground/80 text-sm">Mon-Sat: 9 AM – 9 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar (inside primary section) */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              &copy; {new Date().getFullYear()} Momentum Science Academy. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-primary-foreground/60">
              <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── METALLIC MOMENTUM SECTION ─────────────────────────────── */}
      <div className="momentum-wrapper w-full bg-[#0a0a0a] border-t border-[#1f1f1f] pt-16 pb-8 overflow-hidden">

        {/* Google Font import */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

          /* ---- base text: dim fill + thin static stroke ---- */
          .momentum-text {
            font-family: 'Bebas Neue', 'Arial Black', sans-serif;
            font-size: clamp(72px, 13.5vw, 200px);
            font-weight: 900;
            line-height: 0.85;
            letter-spacing: -0.01em;
            display: block;
            position: relative;

            /* Muted dark-silver fill — not the star of the show */
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            background-image: linear-gradient(
              180deg,
              #4a4a4a 0%,
              #3a3a3a 40%,
              #505050 60%,
              #383838 100%
            );

            /* Static 1px base stroke — dim silver */
            -webkit-text-stroke: 1px rgba(130, 130, 130, 0.45);

            user-select: none;
          }

          /* ---- soft static glow layer on the stroke ---- */
          .momentum-text::after {
            content: 'MOMENTUM';
            font-family: 'Bebas Neue', 'Arial Black', sans-serif;
            font-size: inherit;
            font-weight: inherit;
            letter-spacing: inherit;
            line-height: inherit;
            position: absolute;
            inset: 0;
            -webkit-text-stroke: 2px rgba(180, 180, 180, 0.35);
            color: transparent;
            filter: blur(1.5px);
          }
        `}</style>

        <div className="container mx-auto px-4">
          {/* Giant metallic text */}
          <div className="overflow-hidden select-none">
            <span className="momentum-text">MOMENTUM</span>
          </div>

          {/* Sub-footer */}
          <div className="mt-10 flex flex-col md:flex-row justify-between items-end border-t border-[#1f1f1f] pt-8 text-[#555]">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Momentum Science Academy. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm font-medium hover:text-[#aaa] transition-colors">Instagram</a>
              <a href="#" className="text-sm font-medium hover:text-[#aaa] transition-colors">LinkedIn</a>
              <a href="/contact" className="text-sm font-medium hover:text-[#aaa] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}