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

      {/* Blog & Newsletter Banner (Above Footer) */}
      <section className="bg-[#F1F5F9] border-t border-brand-border/60 py-12 px-6 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Block: Blog */}
          <div className="flex items-start space-x-6">
            {/* Polaroid photos stack */}
            <div className="relative w-24 h-24 flex-shrink-0 hidden sm:block">
              <div className="absolute inset-0 bg-white p-1 pb-4 shadow-md rotate-[-6deg] border border-brand-border/40 rounded">
                <img 
                  src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=100&q=80" 
                  alt="Trip 1"
                  className="w-full h-16 object-cover rounded-sm"
                />
              </div>
              <div className="absolute inset-0 bg-white p-1 pb-4 shadow-md rotate-[6deg] translate-x-2 border border-brand-border/40 rounded">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=100&q=80" 
                  alt="Trip 2"
                  className="w-full h-16 object-cover rounded-sm"
                />
              </div>
            </div>

            {/* Blog Text */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-brand-text text-sm md:text-base">
                Lisez notre blog Cap Aventure
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed max-w-md">
                En quête d'inspiration ? Retrouvez les meilleurs itinéraires, les meilleurs emplacements de camping et des conseils pour voyager en camping-car sur notre blog.
              </p>
              <Link 
                href="/blog"
                className="text-[#DB2777] font-bold text-xs hover:underline block pt-1"
              >
                Aller au blog
              </Link>
            </div>
          </div>

          {/* Right Block: Newsletter */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="space-y-2">
              <h4 className="font-extrabold text-brand-text text-sm md:text-base">
                Abonnez-vous à notre newsletter
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed max-w-sm">
                Inspiration mensuelle et offres exclusives pour votre prochain voyage en camping-car, directement dans votre boîte mail.
              </p>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center space-x-2 w-full sm:w-auto">
              <input 
                type="email" 
                placeholder="Adresse email"
                className="flex-1 sm:w-48 px-3.5 py-2 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-text focus:outline-none focus:border-brand-accent transition-all"
                required
              />
              <button 
                type="submit"
                className="px-5 py-2 bg-[#DB2777] hover:bg-[#C21D5C] text-white rounded-full text-xs font-bold transition-all shadow-sm"
              >
                S'inscrire
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Redesigned Light Footer */}
      <footer className="bg-[#F8FAFC] border-t border-brand-border/60 py-16 text-brand-text w-full">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Brand Info & Socials (3 Columns wide on large screen) */}
          <div className="lg:col-span-3 space-y-6">
            <CapAventureLogo variant="compact" />
            <p className="text-xs text-brand-muted leading-relaxed max-w-xl">
              Cap Aventure met en relation voyageurs et propriétaires de camping-cars et de caravanes au Royaume-Uni et en Europe grâce à une plateforme sécurisée et fiable. Louez le camping-car de vos rêves avec assurance et assistance routière incluses. Connectez-vous, explorez et rendez chaque voyage inoubliable avec Cap Aventure !
            </p>
            
            {/* Trusted Shops Rating */}
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-text">
              <span className="text-[#F59E0B]">★</span>
              <span>4,8/5 on 387 831 customer reviews on Trusted Shops</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              {['instagram', 'twitter', 'pinterest', 'facebook'].map((social) => (
                <a 
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-sm transition-all"
                >
                  <span className="capitalize text-[10px] font-bold">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Voyageurs */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-muted">
              Voyageurs
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-brand-text/80">
              <li>
                <Link href="/vehicules" className="hover:text-[#DB2777] transition-all">
                  Comment ça fonctionne
                </Link>
              </li>
              <li>
                <Link href="/vehicules" className="hover:text-[#DB2777] transition-all">
                  Louer un véhicule
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#DB2777] transition-all">
                  Premier voyage en van
                </Link>
              </li>
              <li>
                <Link href="/avis" className="hover:text-[#DB2777] transition-all">
                  Avis de nos utilisateurs
                </Link>
              </li>
              <li>
                <Link href="/aide" className="hover:text-[#DB2777] transition-all">
                  Centre d'aide Voyageurs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Propriétaires */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-muted">
              Propriétaires
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-brand-text/80">
              <li>
                <Link href="/proprietaire" className="hover:text-[#DB2777] transition-all">
                  Créer une annonce
                </Link>
              </li>
              <li>
                <Link href="/contrat" className="hover:text-[#DB2777] transition-all">
                  Contrat de location
                </Link>
              </li>
              <li>
                <Link href="/assurance" className="hover:text-[#DB2777] transition-all">
                  Assurance location
                </Link>
              </li>
              <li>
                <Link href="/assistance" className="hover:text-[#DB2777] transition-all">
                  Assistance panne
                </Link>
              </li>
              <li>
                <Link href="/aide" className="hover:text-[#DB2777] transition-all">
                  Centre d'aide Hôtes
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-brand-border/60 text-center text-[10px] font-bold text-brand-muted">
          <p>© {new Date().getFullYear()} Cap Aventure. Tous droits réservés. Réalisé avec excellence.</p>
        </div>
      </footer>
    </div>
  );
}
