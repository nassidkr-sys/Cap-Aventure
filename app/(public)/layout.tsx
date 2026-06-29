'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, User } from 'lucide-react';
import CapAventureLogo from '@/components/CapAventureLogo';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/vehicules', label: 'Nos Véhicules' },
    { href: '/reservation', label: 'Réservation' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-brand-beige">
      {/* Navbar flottante */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur border-b border-brand-border py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo — format horizontal sur desktop, compact sur mobile */}
          <Link href="/" className="flex items-center" aria-label="Cap Aventure — Accueil">
            <CapAventureLogo
              variant="horizontal"
              className="hidden md:flex"
            />
            <CapAventureLogo
              variant="compact"
              className="flex md:hidden"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 relative py-1 ${
                    isActive ? 'text-brand-accent font-bold' : 'text-brand-text/80 hover:text-brand-accent'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/contact"
              className="flex items-center space-x-2 text-xs font-bold text-brand-text/70 hover:text-brand-accent transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              <span>+33 6 12 34 56 78</span>
            </Link>
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-2 px-4 py-2 border border-brand-border rounded-xl text-sm font-semibold hover:bg-brand-hover text-brand-text transition-all duration-200 cursor-pointer hover:border-brand-accent/40"
            >
              <User className="w-4 h-4 text-brand-muted" />
              <span>Espace Admin</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-brand-text hover:text-brand-accent transition-colors duration-250 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-brand-border shadow-xl p-6 space-y-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-bold py-2 border-b border-brand-border/50 ${
                    pathname === link.href ? 'text-brand-accent' : 'text-brand-text'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 flex flex-col space-y-3">
              <a
                href="tel:+33612345678"
                className="flex items-center space-x-2 text-sm font-semibold text-brand-text"
              >
                <Phone className="w-4 h-4 text-brand-accent" />
                <span>+33 6 12 34 56 78</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/admin');
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-brand-accent text-white rounded-xl text-sm font-semibold hover:bg-brand-accent-hover transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span>Espace Admin</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-24">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-brand-text text-white border-t border-white/10 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <CapAventureLogo variant="compact" invertText />
            <p className="text-sm text-white/60 leading-relaxed">
              Explorez la liberté sur les routes à bord de notre flotte de vans et camping-cars premium tout confort. Votre voyage commence ici.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider mb-6 text-brand-secondary">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider mb-6 text-brand-secondary">
              Nos Flottes
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="/vehicules?type=van_amenege" className="hover:text-white transition-colors duration-200">
                  Vans Aménagés
                </Link>
              </li>
              <li>
                <Link href="/vehicules?type=camping_car_profile" className="hover:text-white transition-colors duration-200">
                  Camping-cars Profilés
                </Link>
              </li>
              <li>
                <Link href="/vehicules?type=camping_car_integral" className="hover:text-white transition-colors duration-200">
                  Camping-cars Intégraux
                </Link>
              </li>
              <li>
                <Link href="/vehicules?type=fourgon_amenege" className="hover:text-white transition-colors duration-200">
                  Fourgons Aménagés
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider mb-6 text-brand-secondary">
              Contact & Agence
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>14 Avenue de la Liberté, 33000 Bordeaux</li>
              <li>contact@cap-aventure.fr</li>
              <li>+33 5 56 12 34 56</li>
              <li>Lundi - Samedi : 9h00 - 19h00</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} Cap Aventure. Tous droits réservés. Réalisé avec excellence.</p>
        </div>
      </footer>
    </div>
  );
}
