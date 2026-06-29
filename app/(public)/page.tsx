'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  Users,
  Flame,
  Award,
  HeartHandshake,
  CheckCircle2,
  Check
} from 'lucide-react';
import { getVehicles, MOCK_VEHICLES } from '@/services/db';
import { Vehicle } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // États de recherche de type Yescapa
  const [searchLocation, setSearchLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Comment ça marche - tab state
  const [howItWorksTab, setHowItWorksTab] = useState<'renter' | 'owner'>('renter');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getVehicles();
        setVehicles(data.slice(0, 3)); // 3 vedettes
      } catch (err) {
        console.error(err);
        setVehicles(MOCK_VEHICLES.slice(0, 3));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let queryStr = '?';
    if (searchLocation) queryStr += `location=${encodeURIComponent(searchLocation)}&`;
    if (startDate) queryStr += `startDate=${startDate}&`;
    if (endDate) queryStr += `endDate=${endDate}&`;
    router.push(`/vehicules${queryStr.slice(0, -1)}`);
  };

  const categories = [
    {
      type: 'van_amenege',
      name: 'camping-car',
      subtitle: 'Agile et aventureux',
      desc: "Petit, facile à manœuvrer et plein de charme, le camping-car est idéal pour les voyageurs en quête d'aventures spontanées en pleine nature ou en ville.",
      cta: 'Louez un camping-car',
      bgColor: 'bg-pink-100/60',
      illustration: 'poptop'
    },
    {
      type: 'camping_car_integral',
      name: 'grand camping-car',
      subtitle: 'Spacieux et polyvalent',
      desc: "Idéal pour les couples ou les courts séjours en famille, ce grand camping-car offre un espace pratique et la liberté d'explorer facilement tous les endroits.",
      cta: 'Louez un grand camping-car',
      bgColor: 'bg-blue-100/60',
      illustration: 'grand'
    },
    {
      type: 'fourgon_amenege',
      name: 'camping-car discret',
      subtitle: 'Élégant et bien équipé',
      desc: "Compact mais entièrement équipé, le design élégant et discret de ce camping-car permet d'économiser du carburant, de s'adapter aux rues de la ville et de vous garantir des aventures sans tracas.",
      cta: 'Louez un camping-car discret',
      bgColor: 'bg-yellow-100/60',
      illustration: 'discreet'
    },
    {
      type: 'camping_car_profile',
      name: 'camping-car profilé',
      subtitle: 'Spacieux et idéal pour voyager',
      desc: "Idéal pour les familles ou les groupes plus importants, ce camping-car profilé est spacieux et confortable, faisant des voyages en voiture un véritable plaisir pour les adultes comme pour les enfants.",
      cta: 'Louez un camping-car profilé',
      bgColor: 'bg-pink-100/60',
      illustration: 'profile'
    }
  ];

  return (
    <main className="flex-1 flex flex-col">
      {/* 1. Hero Section avec barre de recherche en pilule Yescapa */}
      <section className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-text/95 via-brand-text/65 to-brand-text/30" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white/10 text-brand-secondary text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>Louez votre liberté en toute confiance</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Location de vans et <br className="hidden md:inline" />
            <span className="text-brand-secondary">camping-cars premium</span>
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto font-medium">
            Explorez les routes d'Europe avec la plus grande flotte de véhicules tout équipés.
          </p>

          {/* Barre de recherche style Yescapa (pill form) */}
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur border border-brand-border/30 p-2 rounded-2xl md:rounded-full shadow-2xl text-brand-text max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-2 items-center text-left"
          >
            {/* Localisation */}
            <div className="px-5 py-2.5 border-b md:border-b-0 md:border-r border-brand-border/60">
              <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider mb-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-brand-accent" />
                Départ
              </label>
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-brand-text focus:outline-none focus:ring-0 border-none p-0 cursor-pointer"
              >
                <option value="">Où voulez-vous partir ?</option>
                <option value="Bordeaux">Bordeaux (Aquitaine)</option>
                <option value="Paris">Paris (Île-de-France)</option>
                <option value="Lyon">Lyon (Rhône-Alpes)</option>
                <option value="Toulouse">Toulouse (Midi-Pyrénées)</option>
              </select>
            </div>

            {/* Date début */}
            <div className="px-5 py-2.5 border-b md:border-b-0 md:border-r border-brand-border/60">
              <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider mb-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-brand-accent" />
                Début location
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-brand-text focus:outline-none border-none p-0 cursor-pointer"
              />
            </div>

            {/* Date fin */}
            <div className="px-5 py-2.5">
              <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider mb-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-brand-accent" />
                Fin location
              </label>
              <input
                type="date"
                min={startDate || new Date().toISOString().split('T')[0]}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-brand-text focus:outline-none border-none p-0 cursor-pointer"
              />
            </div>

            {/* Bouton recherche */}
            <div className="p-1.5">
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-4 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl md:rounded-full font-bold shadow-md btn-transition cursor-pointer"
              >
                <span>Rechercher</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Grandes Villes Section */}
      <section className="py-12 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-brand-muted">
          <span>Destinations de départ populaires :</span>
          {['Bordeaux', 'Paris', 'Lyon', 'Toulouse'].map((city) => (
            <button
              key={city}
              onClick={() => router.push(`/vehicules?location=${city}`)}
              className="px-4 py-2 bg-brand-beige hover:bg-brand-accent hover:text-white rounded-full border border-brand-border/60 transition-all duration-200 cursor-pointer"
            >
              📍 {city}
            </button>
          ))}
        </div>
      </section>

      {/* Cartes Promo & Avis (Yescapa Style) */}
      <section className="py-16 bg-[#FAFBF9] px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carte 1 */}
          <div className="bg-white border border-brand-border rounded-[2rem] overflow-hidden hover-lift shadow-sm flex flex-col justify-between h-full">
            <div className="relative h-56 overflow-hidden bg-brand-hover">
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" 
                alt="Offres exceptionnelles" 
                className="w-full h-full object-cover"
              />
              <svg 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none" 
                className="absolute bottom-0 left-0 w-full h-8 text-white fill-current translate-y-[1px]"
              >
                <path d="M0 12 C 30 0, 70 0, 100 12 Z" />
              </svg>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-brand-text leading-tight">
                  Des offres exceptionnelles toute l'année
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  Le camping-car est le meilleur moyen de voyager{' '}
                  <span className="font-bold bg-[#FEF08A] px-1.5 py-0.5 rounded text-brand-text">
                    sans se ruiner !
                  </span>
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/vehicules"
                  className="inline-flex items-center space-x-1 px-6 py-3 bg-[#FDF2F8] hover:bg-[#FCE7F3] text-[#DB2777] rounded-full text-xs font-bold transition-all duration-200 cursor-pointer"
                >
                  <span>Toutes les meilleures offres</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Carte 2 */}
          <div className="bg-white border border-brand-border rounded-[2rem] overflow-hidden hover-lift shadow-sm flex flex-col justify-between h-full">
            <div className="relative h-56 overflow-hidden bg-brand-hover">
              <img 
                src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80" 
                alt="Avis Cap Aventure" 
                className="w-full h-full object-cover"
              />
              <svg 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none" 
                className="absolute bottom-0 left-0 w-full h-8 text-white fill-current translate-y-[1px]"
              >
                <path d="M0 12 C 30 0, 70 0, 100 12 Z" />
              </svg>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-brand-text leading-tight">
                  Avis sur Cap Aventure, une histoire sans fin
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex text-[#F59E0B]">
                    <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
                    <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
                    <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
                    <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
                    <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
                  </div>
                  <span className="text-base font-extrabold text-brand-text">4,9/5</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-brand-muted">
                    Voici comment nos utilisateurs évaluent Cap Aventure !
                  </p>
                  <p className="text-[10px] text-brand-muted/70">
                    Note de 4,9 sur 5 basée sur 387 831 avis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Carte 3 */}
          <div className="bg-brand-accent border border-brand-accent/50 rounded-[2rem] overflow-hidden hover-lift shadow-lg flex flex-col justify-between h-full text-white">
            <div className="relative h-56 overflow-hidden bg-brand-hover">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80" 
                alt="Propriétaire Cap Aventure" 
                className="w-full h-full object-cover"
              />
              <svg 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none" 
                className="absolute bottom-0 left-0 w-full h-8 text-brand-accent fill-current translate-y-[1px]"
              >
                <path d="M0 12 C 30 0, 70 0, 100 12 Z" />
              </svg>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                  Êtes-vous propriétaire ?
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  Louez votre véhicule et tirez-en le meilleur parti en toute confiance.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-1 px-6 py-3 bg-[#DB2777] hover:bg-[#C21D5C] text-white rounded-full text-xs font-bold transition-all duration-200 shadow-md cursor-pointer"
                >
                  <span>En savoir plus</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Catégories Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full space-y-16">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 lg:gap-16">
          <div className="lg:w-5/12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-text tracking-tight leading-tight">
              Vous recherchez un camping-car ou un fourgon aménagé ?
            </h2>
          </div>
          <div className="lg:w-6/12">
            <p className="text-sm md:text-base text-brand-muted leading-relaxed">
              Les meilleurs road trips commencent par les bonnes questions. Pour la location d'un camping-car ou d'un fourgon aménagé, chaque projet de voyage a son véhicule. Nous vous aiderons à choisir celui qui vous convient le mieux, pour que votre voyage commence du bon pied.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.type}
              className="group flex flex-col bg-white border border-brand-border rounded-[2rem] p-6 justify-between h-full hover-lift shadow-sm transition-all duration-300"
            >
              {/* Image / Illustration Container */}
              <div className="relative h-44 flex items-center justify-center overflow-visible mb-6">
                {/* Background Decor Card */}
                <div className={`w-28 h-28 ${cat.bgColor} rounded-[2rem] absolute transition-transform duration-300 group-hover:scale-105`} />
                
                {/* Inline SVG Illustrations */}
                {cat.illustration === 'poptop' && (
                  <svg viewBox="0 0 200 120" className="w-48 h-28 z-10 drop-shadow-md select-none pointer-events-none transition-transform duration-300 group-hover:translate-y-[-4px]">
                    <path d="M 45 42 L 135 20 L 130 42 Z" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M 130 20 L 133 42" stroke="#1E293B" strokeWidth="1.5" />
                    <line x1="43" y1="42" x2="142" y2="42" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M 32 82 L 32 46 C 32 44, 34 42, 37 42 L 152 42 C 160 42, 166 48, 168 56 L 172 74 C 173 78, 171 82, 167 82 Z" fill="#2DD4BF" stroke="#1E293B" strokeWidth="2" />
                    <rect x="42" y="48" width="34" height="15" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <rect x="84" y="48" width="34" height="15" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 126 48 L 152 48 C 156 48, 159 51, 160 55 L 162 63 L 126 63 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="62" cy="82" r="14" fill="#1E293B" />
                    <circle cx="62" cy="82" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="138" cy="82" r="14" fill="#1E293B" />
                    <circle cx="138" cy="82" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <line x1="32" y1="69" x2="171" y2="69" stroke="#1E293B" strokeWidth="1.5" />
                  </svg>
                )}
                {cat.illustration === 'grand' && (
                  <svg viewBox="0 0 200 120" className="w-48 h-28 z-10 drop-shadow-md select-none pointer-events-none transition-transform duration-300 group-hover:translate-y-[-4px]">
                    <path d="M 20 54 L 32 54 M 20 66 L 32 66 M 22 50 L 22 70" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="22" cy="54" r="3" stroke="#475569" strokeWidth="1.5" fill="none" />
                    <circle cx="22" cy="66" r="3" stroke="#475569" strokeWidth="1.5" fill="none" />
                    <path d="M 32 82 L 32 40 C 32 38, 34 36, 37 36 L 152 36 C 158 36, 164 41, 166 48 L 172 74 C 173 78, 171 82, 167 82 Z" fill="#64748B" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 37 36 C 37 33, 42 30, 48 30 L 140 30 C 145 30, 148 33, 148 36 Z" fill="#64748B" stroke="#1E293B" strokeWidth="2" />
                    <rect x="42" y="44" width="42" height="15" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <rect x="92" y="44" width="30" height="15" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 130 44 L 154 44 C 158 44, 161 47, 162 51 L 164 59 L 130 59 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="62" cy="82" r="14" fill="#1E293B" />
                    <circle cx="62" cy="82" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="138" cy="82" r="14" fill="#1E293B" />
                    <circle cx="138" cy="82" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <line x1="32" y1="66" x2="171" y2="66" stroke="#1E293B" strokeWidth="1.5" />
                  </svg>
                )}
                {cat.illustration === 'discreet' && (
                  <svg viewBox="0 0 200 120" className="w-48 h-28 z-10 drop-shadow-md select-none pointer-events-none transition-transform duration-300 group-hover:translate-y-[-4px]">
                    <path d="M 32 82 L 32 42 C 32 40, 34 38, 37 38 L 150 38 C 156 38, 162 43, 164 50 L 170 74 C 171 78, 169 82, 165 82 Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 37 38 L 140 38 L 140 34 C 140 34, 138 32, 134 32 L 44 32 C 40 32, 37 34, 37 34 Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />
                    <rect x="44" y="44" width="38" height="15" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <rect x="90" y="44" width="34" height="15" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 132 44 L 154 44 C 157 44, 159 47, 160 50 L 162 59 L 132 59 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="62" cy="82" r="14" fill="#1E293B" />
                    <circle cx="62" cy="82" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="138" cy="82" r="14" fill="#1E293B" />
                    <circle cx="138" cy="82" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <line x1="32" y1="67" x2="168" y2="67" stroke="#1E293B" strokeWidth="1.5" />
                  </svg>
                )}
                {cat.illustration === 'profile' && (
                  <svg viewBox="0 0 200 120" className="w-48 h-28 z-10 drop-shadow-md select-none pointer-events-none transition-transform duration-300 group-hover:translate-y-[-4px]">
                    <path d="M 68 36 C 68 36, 74 30, 84 30 L 144 30 C 150 30, 156 34, 158 40 L 166 60 L 140 60 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 28 82 L 28 36 C 28 34, 30 32, 34 32 L 142 32 L 142 82 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 142 82 L 142 52 L 158 52 C 162 52, 166 56, 168 62 L 172 74 C 173 78, 171 82, 167 82 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />
                    <rect x="38" y="40" width="40" height="15" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <rect x="88" y="40" width="34" height="15" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 144 54 L 158 54 C 160 54, 162 56, 163 59 L 165 67 L 144 67 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 30 70 Q 70 56, 110 70 T 142 66 L 142 72 Q 100 78, 30 75 Z" fill="#3B82F6" opacity="0.8" />
                    <circle cx="58" cy="82" r="14" fill="#1E293B" />
                    <circle cx="58" cy="82" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="130" cy="82" r="14" fill="#1E293B" />
                    <circle cx="130" cy="82" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                  </svg>
                )}
              </div>

              {/* Text Area */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="font-extrabold text-brand-text text-lg group-hover:text-brand-accent transition-colors duration-200">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-brand-accent font-bold tracking-wide uppercase">
                    {cat.subtitle}
                  </p>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                  <Link 
                    href={`/vehicules?type=${cat.type}`}
                    className="text-xs font-extrabold text-[#DB2777] hover:text-[#BE185D] hover:underline transition-colors duration-200"
                  >
                    {cat.cta}
                  </Link>
                  <ArrowRight className="w-3.5 h-3.5 text-[#DB2777] transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Véhicules Vedettes / Featured Section */}
      <section className="bg-white border-y border-brand-border py-24 px-6 w-full">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="text-brand-accent font-extrabold text-xs uppercase tracking-widest block">Les Incontournables</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-text tracking-tight">
                Véhicules disponibles à la location
              </h2>
            </div>
            <Link 
              href="/vehicules"
              className="inline-flex items-center space-x-2 text-sm font-bold text-brand-accent hover:underline"
            >
              <span>Voir tout le catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-brand-beige border border-brand-border rounded-2xl p-6 space-y-4 animate-pulse">
                  <div className="h-48 bg-brand-border/40 rounded-xl"></div>
                  <div className="h-6 bg-brand-border/40 rounded w-3/4"></div>
                  <div className="h-4 bg-brand-border/40 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              vehicles.map((veh) => (
                <div 
                  key={veh.id}
                  className="group flex flex-col bg-brand-beige border border-brand-border rounded-2xl overflow-hidden hover-lift shadow-sm"
                >
                  <div className="relative h-56 overflow-hidden bg-brand-hover">
                    <img 
                      src={veh.images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'} 
                      alt={veh.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Badge catégorie */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-accent border border-brand-border/50">
                      {veh.type === 'van_amenege' ? 'Van' :
                       veh.type === 'camping_car_profile' ? 'CC Profilé' :
                       veh.type === 'camping_car_integral' ? 'CC Intégral' : 'Fourgon'}
                    </div>

                    {/* Propriétaire avatar style Yescapa */}
                    <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full border border-brand-border/40">
                      <img 
                        src={veh.owner.avatar} 
                        alt={veh.owner.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-[10px] font-bold text-brand-text pr-2">Hôte: {veh.owner.name}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-brand-muted font-bold flex items-center">
                          📍 {veh.location}
                        </span>
                        {/* Notes style Yescapa */}
                        <div className="flex items-center text-xs font-bold text-brand-text">
                          <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B] mr-1" />
                          <span>{veh.rating}</span>
                          <span className="text-brand-muted font-normal ml-1">({veh.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-extrabold text-brand-text">{veh.name}</h3>
                      <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                        {veh.description}
                      </p>
                    </div>

                    {/* Caractéristiques rapides */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-brand-border text-xs text-brand-text">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-brand-accent" />
                        <span>{veh.seats} Places Route</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Compass className="w-4 h-4 text-brand-accent" />
                        <span>{veh.beds} Couchages</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <span className="text-2xl font-extrabold text-brand-text font-mono">{veh.pricePerDay}€</span>
                        <span className="text-xs text-brand-muted"> / jour</span>
                      </div>
                      <Link
                        href={`/vehicule/${veh.slug}`}
                        className="px-4 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-bold shadow-sm btn-transition"
                      >
                        Détails & Réserver
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. Comment ça marche Section (Dynamic tab) */}
      <section className="py-24 px-6 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <span className="text-brand-accent font-extrabold text-xs uppercase tracking-widest block">Fonctionnement</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-text tracking-tight">
            Comment fonctionne Cap Aventure ?
          </h2>
          <div className="flex justify-center mt-6">
            <div className="bg-brand-beige border border-brand-border p-1 rounded-full inline-flex">
              <button
                onClick={() => setHowItWorksTab('renter')}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  howItWorksTab === 'renter' 
                    ? 'bg-brand-accent text-white shadow-md' 
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Je souhaite louer
              </button>
              <button
                onClick={() => setHowItWorksTab('owner')}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  howItWorksTab === 'owner' 
                    ? 'bg-brand-accent text-white shadow-md' 
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Je souhaite proposer mon véhicule
              </button>
            </div>
          </div>
        </div>

        {howItWorksTab === 'renter' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {[
              { num: '1', title: 'Choisissez votre véhicule', desc: 'Faites votre recherche parmi des centaines de camping-cars et vans selon vos critères.' },
              { num: '2', title: 'Faites votre demande', desc: 'Sélectionnez vos dates, contactez le propriétaire et validez votre demande.' },
              { num: '3', title: 'Prenez la route', desc: 'Réalisez l\'état des lieux depuis l\'application et partez en vacances l\'esprit tranquille.' }
            ].map((step) => (
              <div key={step.num} className="bg-white border border-brand-border p-8 rounded-3xl space-y-4 text-center shadow-sm relative overflow-hidden">
                <span className="absolute top-4 left-4 text-6xl font-black text-brand-accent/5 font-mono select-none">{step.num}</span>
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mx-auto text-lg font-bold">
                  {step.num}
                </div>
                <h4 className="font-extrabold text-brand-text text-base pt-2">{step.title}</h4>
                <p className="text-xs text-brand-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {[
              { num: '1', title: 'Publiez votre annonce', desc: 'Enregistrez votre véhicule gratuitement, téléversez vos photos et définissez vos tarifs.' },
              { num: '2', title: 'Validez les demandes', desc: 'Échangez avec les locataires et choisissez librement à qui vous louez votre véhicule.' },
              { num: '3', title: 'Encaissez vos revenus', desc: 'Recevez votre rémunération de manière sécurisée. Nous fournissons l\'assurance multirisque.' }
            ].map((step) => (
              <div key={step.num} className="bg-white border border-brand-border p-8 rounded-3xl space-y-4 text-center shadow-sm relative overflow-hidden">
                <span className="absolute top-4 left-4 text-6xl font-black text-brand-accent/5 font-mono select-none">{step.num}</span>
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mx-auto text-lg font-bold">
                  {step.num}
                </div>
                <h4 className="font-extrabold text-brand-text text-base pt-2">{step.title}</h4>
                <p className="text-xs text-brand-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. Pourquoi louer chez nous (Value Prop) */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-t border-brand-border">
        <div className="space-y-6">
          <span className="text-brand-accent font-extrabold text-xs uppercase tracking-widest block">Notre Promesse</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-text tracking-tight">
            Préparez votre roadtrip en toute sérénité
          </h2>
          <p className="text-sm md:text-base text-brand-muted leading-relaxed">
            Louer un camping-car ou un van chez Cap Aventure, c'est s'assurer d'un service irréprochable et d'équipements de première classe. Toutes nos réservations incluent automatiquement :
          </p>

          <div className="space-y-4 pt-4">
            {[
              { icon: ShieldCheck, title: 'Assurance tous risques incluse', desc: 'Voyagez protégé. Assistance dépannage 24/7 sur toutes les routes européennes.' },
              { icon: Award, title: 'Véhicules récents et entretenus', desc: 'Toute notre flotte a moins de 2 ans et fait l\'objet de contrôles techniques réguliers.' },
              { icon: HeartHandshake, title: 'Service tout inclus d\'office', desc: 'Cuisine complète équipée, raccordements, cales de mise à niveau et tuyaux fournis gratuitement.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-text text-sm">{item.title}</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-brand-border">
          <img 
            src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80" 
            alt="Camping sauvage premium" 
            className="w-full h-full object-cover"
          />
          {/* Overlay de citation premium */}
          <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-brand-border/40 text-brand-text space-y-2">
            <div className="flex text-[#F59E0B]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs font-semibold italic text-brand-text/90 leading-relaxed">
              "Une expérience inoubliable ! Le van était impeccable, très propre et la communication avec l'équipe de Cap Aventure a été parfaite du début à la fin. Nous reviendrons l'année prochaine !"
            </p>
            <p className="text-[10px] font-bold text-brand-accent uppercase tracking-wider">
              — Sophie & Marc, roadtrip de 2 semaines en Bretagne
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
