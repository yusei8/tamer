// Acceuil.tsx
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  PhoneCall, Mail, MapPin, ArrowRight, Wrench, 
  CarFront, Truck, Briefcase, Users, Wallet, 
  CalendarIcon, FileText, Download, Phone, Clock,
  Menu, X, ChevronDown, GraduationCap, Book
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import { useDashboardStore } from '@/stores/dashboardStore';
import { useRef } from "react";



// --- DÉBUT SKELETON ANIMÉ ---
// Ajoute ce composant utilitaire en haut du fichier :
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded ${className}`}></div>
);
//
// Dans la Navbar, avant le return, ajoute :
// --- CORRECTION SKELETON ---
// Laisse le composant Skeleton en haut du fichier.
// Déplace chaque test if (!dataJson.navbar) à l'intérieur du composant Navbar, idem pour Hero, GallerySection, etc.
// Supprime les tests globaux hors composant.
// --- FIN CORRECTION SKELETON ---

// Navbar Component
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);
  const { dataJson } = useDashboardStore();
  const location = useLocation();
  if (!dataJson.navbar) {
    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-32" />
            </div>
            <nav className="hidden md:flex space-x-2">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-32 mx-2" />)}
            </nav>
            <div className="md:hidden">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </header>
    );
  }
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleFormations = () => setIsFormationsOpen(!isFormationsOpen);

  // Génération dynamique des sous-liens formations
  const formationsSubLinks = (dataJson.formations?.items || [])
    .filter(f => f && f.showOnHome)
    .map(f => ({
      text: f.title,
      path: f.path || `/formations/${f.id}`
    }));
  const catalogueLink = { text: 'Catalogue de formation', path: '/formations/catalogue' };
  const allSubLinks = [catalogueLink, ...formationsSubLinks];
  


  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            {/* Bouton retour circulaire, masqué sur la page d'accueil */}
            {location.pathname !== '/' && (
              <button 
                onClick={() => window.history.back()}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                aria-label="Retour"
              >
                <ArrowRight className="h-5 w-5 rotate-180" />
              </button>
            )}
            
            <Link to="/" className="flex items-center group">
              <img 
                src={dataJson.navbar.logo} 
                alt="ACTL Logo" 
                className="h-12 transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>


          
          <nav className="hidden md:flex space-x-2">
            {dataJson.navbar.links.map((link, index) => (
                            link.text.trim().toLowerCase() === 'formations' ? (
                <div key={index} className="relative">
                  <button 
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:bg-emerald-50 rounded-lg"
                    onClick={toggleFormations}
                  >
                    <span>{link.text}</span>
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${isFormationsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isFormationsOpen && (
                    <div className="absolute left-0 mt-2 w-72 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-3 z-50 border border-emerald-100 animate-in slide-in-from-top-2 duration-200">
                      {allSubLinks.map((subLink, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subLink.path}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 border-l-2 border-transparent hover:border-emerald-400"
                          onClick={() => setIsFormationsOpen(false)}
                        >
                          {subLink.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  key={index}
                  to={link.path} 
                  className="px-4 py-2 rounded-full text-gray-700 hover:text-emerald-400 hover:bg-emerald-50 transition-colors duration-300 font-medium flex items-center group focus:outline-none focus:text-emerald-500 focus:bg-emerald-50 focus:opacity-100 active:opacity-70"
                  style={{ transition: 'color 0.3s, background 0.3s, opacity 0.3s' }}
                >
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {link.text}
                </Link>
              )
            ))}
          </nav>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 flex items-center justify-center transition-all duration-300"
              aria-label="Open Menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-white/95 backdrop-blur-md px-4 pt-2 pb-4 shadow-lg border-t border-emerald-100">
          {dataJson.navbar.links.map((link, index) => (
            link.text.trim().toLowerCase() === 'formations' ? (
              <div key={index}>
                <button 
                  onClick={toggleFormations}
                  className="flex items-center w-full py-3 text-left text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300"
                >
                  <span>{link.text}</span>
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${isFormationsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isFormationsOpen && (
                  <div className="pl-4 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {allSubLinks.map((subLink, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subLink.path}
                        className="block py-2 px-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subLink.text}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={index}
                to={link.path}
                className="block py-3 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </Link>
            )
          ))}
        </nav>
      )}
    </header>
  );
};

// Hero Component
// Hero Component
// Hero Component
export const Hero = () => {
  const { dataJson } = useDashboardStore();
  if (!dataJson.hero) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Skeleton className="h-16 w-2/3" /></div>;
  }
  return (
    <div className="relative min-h-[50vh] overflow-hidden bg-black"> {/* Réduit à 50vh */}
      {/* Background Image avec effet 3D */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-110 transition-transform transition-duration-[10s] hover:scale-125"
        style={{ 
          backgroundImage: `url(${dataJson.hero.backgroundImage})`,
          filter: 'brightness(0.3) contrast(1.3) saturate(1.2) hue-rotate(15deg)'
        }}
      />
      
      {/* Overlay créatif avec formes géométriques */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-emerald-900/60 to-teal-900/70" />
      
      {/* Formes géométriques flottantes créatives */}
      <div className="absolute inset-0 opacity-20">
        {/* Hexagones animés */}
        <div className="absolute top-20 left-20 w-24 h-24 border-2 border-emerald-400/40 transform rotate-45 animate-spin" style={{ animationDuration: '15s', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
        <div className="absolute top-40 right-32 w-16 h-16 border-2 border-teal-400/30 animate-pulse" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
        
        {/* Triangles créatifs */}
        <div className="absolute bottom-32 left-1/4 w-32 h-32 border-2 border-cyan-400/25 animate-bounce" style={{ animationDuration: '4s', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-emerald-300/30 rotate-180" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        
        {/* Cercles avec effet de pulsation */}
        <div className="absolute top-1/2 left-10 w-40 h-40 border border-teal-300/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-10 w-28 h-28 border border-emerald-300/25 rounded-full animate-pulse" />
      </div>
      
      {/* Particules magiques flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float ${
              i % 3 === 0 ? 'w-3 h-3 bg-emerald-400/30' : 
              i % 3 === 1 ? 'w-2 h-2 bg-teal-400/25' : 
              'w-1 h-1 bg-cyan-400/35'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10"> {/* Padding vertical réduit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contenu principal avec animations créatives */}
          <div className="space-y-8 w-full max-w-4xl"> {/* Largeur augmentée */}
            {/* Badge ultra-premium avec effet néon */}
            <div className="group relative inline-flex items-center">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative px-8 py-4 bg-black/50 backdrop-blur-2xl rounded-full border border-emerald-400/50 shadow-2xl">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
                  </div>
                  <GraduationCap className="h-6 w-6 text-emerald-300 group-hover:rotate-12 transition-transform duration-500" />           
                  <span className="block w-full max-w-xl text-white text-xl font-bold tracking-wider bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
                  {dataJson.hero.title2}
                </span>
                </div>
              </div>
            </div>
            
            {/* Titre principal avec largeur augmentée */}
            <div className="space-y-6 w-full">
              <h1 className="text-5xl md:text-6xl font-black leading-tight"> {/* Taille de police ajustée */}
<span className="block w-full max-w-6xl p-6 text-4xl font-bold leading-snug bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent drop-shadow-2xl">
  {dataJson.hero.titleLine1}<br />
  {dataJson.hero.titleLine2}
</span>
              </h1>
            </div>
            
            {/* Description avec barre latérale animée */}
            <div className="relative group">
              <div className="absolute -left-6 top-0 w-2 h-full bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -left-8 top-0 w-6 h-full bg-gradient-to-b from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-full blur-sm" />
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light pl-4">
                {dataJson.hero.description}
              </p>
            </div>
            
            {/* Boutons avec effets créatifs avancés */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              {dataJson.hero.buttons.map((button, index) => (
                <div key={index} className="group relative">
                  {/* Effet de glow animé */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-700 animate-pulse" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <Button 
                    asChild 
                    className={button.variant === "primary" 
                      ? "relative px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-700 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all duration-700 hover:scale-110 border-0 backdrop-blur-sm transform hover:-translate-y-1" 
                      : "relative px-8 py-4 bg-black/30 hover:bg-black/50 text-white font-bold text-lg rounded-full border-2 border-white/40 hover:border-white/70 backdrop-blur-2xl transition-all duration-700 hover:scale-110 transform hover:-translate-y-1"}
                  >
                    <Link to={button.path} className="flex items-center">
                      {button.text}
                      <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-2 transition-transform duration-500" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicateur de scroll créatif */}
      {dataJson.hero.showScrollIndicator && (
        <div 
          className="absolute animate-bounce group cursor-pointer"
          style={{
            left: `${dataJson.hero.scrollPositionX || 50}%`,
            top: `${dataJson.hero.scrollPositionY || 85}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm">
                <div className="w-2 h-4 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full mt-2 animate-pulse" />
              </div>
              <div className="absolute -inset-2 border border-white/20 rounded-full blur-sm animate-ping" />
            </div>
            <div className="text-white/70 text-sm mt-3 group-hover:text-white transition-colors duration-300">
              {dataJson.hero.scrollText || "Découvrir"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// FeaturedFormations Component
export const FeaturedFormations = () => {
  const iconComponents = {
    Wrench, CarFront, Truck, Briefcase, Users, Wallet, Book
  };
  const { dataJson } = useDashboardStore();
  if (!dataJson.formations) {
    return <Skeleton className="h-16 w-2/3" />;
  }
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {dataJson.formations.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {dataJson.formations.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {dataJson.formations.items
            .filter(f => f && f.showOnHome)
            .map((formation) => {
              const IconComponent = iconComponents[formation.icon] || Briefcase;
              if (!iconComponents[formation.icon]) {
                console.warn(`Formation avec id='${formation.id}' a une icône inconnue: '${formation.icon}', icône par défaut utilisée.`);
              }
              return (
                <Card key={formation.id} className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="aspect-w-16 aspect-h-9 relative h-48 overflow-hidden">
                    <img 
                      src={formation.image} 
                      alt={formation.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                        {formation.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">{formation.description}</p>
                    <Link 
                      to={`/formations/${formation.id}`}
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold group-hover:translate-x-1 transition-all duration-300"
                    >
                      En savoir plus 
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
              );
            })}
        </div>

        <div className="text-center mb-16 mt-24">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {dataJson.services.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {dataJson.services.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dataJson.services.items.map((service, index) => (
            <Card key={index} className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <div className="aspect-w-16 aspect-h-9 relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// GallerySection Component
export const GallerySection = () => {
  const { dataJson } = useDashboardStore();
  if (!dataJson.gallery) {
    return <Skeleton className="h-16 w-2/3" />;
  }
  return (
    <section className="py-20 bg-gradient-to-b from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {dataJson.gallery.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {dataJson.gallery.description}
          </p>
        </div>
        
        <div className="mt-12 mb-16 relative mx-auto max-w-5xl">
          <Carousel className="w-full">
            <CarouselContent>
              {dataJson.gallery.images.map((image, index) => (
                <CarouselItem key={index} className="md:basis-full">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-base md:text-lg font-medium leading-relaxed backdrop-blur-sm bg-black/20 p-4 rounded-lg">
                        {image.caption}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-16 w-12 h-12 bg-white/90 hover:bg-white border-2 border-emerald-200 hover:border-emerald-300 text-emerald-600 shadow-lg" />
            <CarouselNext className="hidden md:flex -right-16 w-12 h-12 bg-white/90 hover:bg-white border-2 border-emerald-200 hover:border-emerald-300 text-emerald-600 shadow-lg" />
          </Carousel>
        </div>
        
        <div className="text-center">
          <Link 
            to="/evenements" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {dataJson.gallery.seeMoreText}
            <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// FacilitiesSection Component
export const FacilitiesSection = () => {
  const { dataJson } = useDashboardStore();
  if (!dataJson.facilities) {
    return <Skeleton className="h-16 w-2/3" />;
  }
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {dataJson.facilities.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {dataJson.facilities.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {dataJson.facilities.items.map((facility) => (
            <Card key={facility.id} className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 bg-gradient-to-b from-white to-gray-50">
              <div className="aspect-w-16 aspect-h-12 relative h-48 overflow-hidden">
                <img 
                  src={facility.image} 
                  alt={facility.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg shadow-lg">
                  {facility.id}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                  {facility.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{facility.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// EventsSection Component
export const EventsSection = () => {
  const { datapJson } = useDashboardStore();
  const events = datapJson?.evenements?.events?.filter(e => e.showOnHome) || [];
  if (!datapJson.evenements) {
    return <Skeleton className="h-16 w-2/3" />;
  }
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {datapJson.evenements.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {datapJson.evenements.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <Card key={event.id} className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 ${event.featured ? 'ring-2 ring-emerald-500 bg-gradient-to-br from-emerald-50 to-white' : 'bg-white'}`}>
              <div className="aspect-w-16 aspect-h-9 relative h-64 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {event.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg">
                      Événement phare
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center text-emerald-600 text-sm mb-3 font-medium">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                <Link 
                  to="/evenements" 
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold group-hover:translate-x-1 transition-all duration-300"
                >
                  {datapJson.evenements.detailsText || 'Voir les détails'}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link 
            to="/evenements"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {datapJson.evenements.detailsText || 'Voir tous les événements'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// DownloadsSection Component
export const DownloadsSection = () => {
  const { dataJson } = useDashboardStore();
  if (!dataJson.downloads) {
    return <Skeleton className="h-16 w-2/3" />;
  }
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">{dataJson.downloads.title}</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          {dataJson.downloads.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataJson.downloads.items.map((document) => (
            <Card key={document.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="h-12 w-12 bg-actl-light-green rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <FileText className="h-6 w-6 text-actl-green" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-1">{document.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{document.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {document.fileType} • {document.fileSize}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center"
                        asChild
                      >
                        <a href={document.fileUrl} download>
                          <Download className="h-4 w-4 mr-2" />
                          {dataJson.downloads.downloadText}
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// ContactCTA Component
export const ContactCTA = () => {
  const { dataJson } = useDashboardStore();
  if (!dataJson.contact) {
    return <Skeleton className="h-16 w-2/3" />;
  }
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                {dataJson.contact.title}
              </span>
            </h2>
            <p className="text-lg mb-8 text-emerald-100/90 leading-relaxed">
              {dataJson.contact.description}
            </p>
            <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
              <Link to={dataJson.contact.button.path} className="flex items-center">
                {dataJson.contact.button.text}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-6 text-emerald-100">{dataJson.contact.contactInfoTitle}</h3>
            <div className="space-y-6">
              <div className="flex items-start group">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <PhoneCall className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <p className="font-medium text-emerald-100 mb-1">{dataJson.contact.labels?.phoneLabel || "Appelez-nous"}</p>
                  <p className="text-emerald-200">{dataJson.contact.info.phone}</p>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <Mail className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <p className="font-medium text-emerald-100 mb-1">{dataJson.contact.labels?.emailLabel || "Envoyez-nous un email"}</p>
                  <p className="text-emerald-200">{dataJson.contact.info.email}</p>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <MapPin className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <p className="font-medium text-emerald-100 mb-1">{dataJson.contact.labels?.addressLabel || "Notre adresse"}</p>
                  <p className="text-emerald-200">{dataJson.contact.info.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
export const Footer = () => {
  const { dataJson } = useDashboardStore();
  if (!dataJson.footer) {
    return <Skeleton className="h-16 w-2/3" />;
  }
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="inline-block mb-4 group">
              <img 
                src={dataJson.footer.logo} 
                alt="ACTL Logo" 
                className="h-12 mb-4 transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="mb-4 text-gray-400 leading-relaxed">
              {dataJson.footer.description}
            </p>
            <div className="flex items-center mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <span className="text-sm text-gray-400 mr-3">{dataJson.footer.groupText || "Une filiale du groupe"}</span>
              <img 
                src={dataJson.footer.groupLogo} 
                alt="Logitrans Logo" 
                className="h-8 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-emerald-400 mb-6">{dataJson.footer.titles?.quickLinksTitle || "Liens Rapides"}</h3>
            <ul className="space-y-3">
              {dataJson.footer.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-emerald-400 mb-6">{dataJson.footer.titles?.contactTitle || "Contact"}</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-gray-400 leading-relaxed">{dataJson.footer.contactInfo.address}</span>
              </li>
              <li className="flex items-center group">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-gray-400">{dataJson.footer.contactInfo.phone}</span>
              </li>
              <li className="flex items-center group">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-gray-400">{dataJson.footer.contactInfo.email}</span>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <Clock className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-gray-400 leading-relaxed">{dataJson.footer.contactInfo.hours}</span>
              </li>
            </ul>
            
            <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <h4 className="font-bold text-emerald-400 mb-4">{dataJson.footer.titles?.teamTitle || "Équipe commerciale:"}</h4>
              <div className="space-y-3">
                {dataJson.footer.commercialTeam.map((member, index) => (
                  <div key={index} className="text-sm">
                    <p className="text-emerald-300 font-medium">{member.name} - {member.phone}</p>
                    <p className="text-gray-400">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">{dataJson.footer.copyright || `© ${new Date().getFullYear()} ACTL. Tous droits réservés.`}</p>
        </div>
      </div>
    </footer>
  );
};

// Main Component
const Acceuil = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedFormations />
        <GallerySection />
        <FacilitiesSection />
        <EventsSection />
        <DownloadsSection />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Acceuil;