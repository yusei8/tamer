// Acceuil.tsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  PhoneCall, Mail, MapPin, ArrowRight, Wrench, 
  CarFront, Truck, Briefcase, Users, Wallet, 
  CalendarIcon, FileText, Download, Phone, Clock,
  Menu, X, ChevronDown, GraduationCap, Calendar
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
import data from './data.json';

// Navbar Component
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleFormations = () => setIsFormationsOpen(!isFormationsOpen);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={data.navbar.logo} 
                alt="ACTL Logo" 
                className="h-12 mr-2"
              />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {data.navbar.links.map((link, index) => (
              link.subLinks ? (
                <div key={index} className="relative">
                  <button 
                    className="flex items-center text-gray-700 hover:text-actl-green transition-colors"
                    onClick={toggleFormations}
                  >
                    <span>{link.text}</span>
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isFormationsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isFormationsOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                      {link.subLinks.map((subLink, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subLink.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-actl-light-green hover:text-actl-green"
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
                  className="text-gray-700 hover:text-actl-green transition-colors"
                >
                  {link.text}
                </Link>
              )
            ))}
          </nav>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-actl-green"
              aria-label="Open Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-white px-4 pt-2 pb-4 shadow-md">
          {data.navbar.links.map((link, index) => (
            link.subLinks ? (
              <div key={index}>
                <button 
                  onClick={toggleFormations}
                  className="flex items-center w-full py-2 text-left text-gray-700 hover:text-actl-green"
                >
                  <span>{link.text}</span>
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isFormationsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFormationsOpen && (
                  <div className="pl-4 space-y-2">
                    {link.subLinks.map((subLink, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subLink.path}
                        className="block py-2 text-gray-700 hover:text-actl-green"
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
                className="block py-2 text-gray-700 hover:text-actl-green"
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
export const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500">
      <div
  className="absolute inset-0 opacity-30 bg-cover bg-center"
  style={{ backgroundImage: `url(${data.hero.backgroundImage})` }}
></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {data.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            {data.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {data.hero.buttons.map((button, index) => (
              <Button 
                key={index}
                asChild 
                className={button.variant === "primary" 
                  ? "bg-white hover:bg-gray-100 text-gray-700 font-medium" 
                  : "border-white text-white hover:bg-white/20"}
              >
                <Link to={button.path}>{button.text}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// FeaturedFormations Component
export const FeaturedFormations = () => {
  const iconComponents = {
    Wrench, CarFront, Truck, Briefcase, Users, Wallet
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">{data.formations.title}</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          {data.formations.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {data.formations.items.map((formation) => {
            const IconComponent = iconComponents[formation.icon];
            return (
              <Card key={formation.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-w-16 aspect-h-9 relative h-48">
                  <img 
                    src={formation.image} 
                    alt={formation.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className="h-5 w-5 text-actl-green" />
                    <h3 className="text-xl font-bold text-gray-800">{formation.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{formation.description}</p>
                  <Link 
                    to={`/formations/${formation.id}`}
                    className="text-actl-green hover:text-actl-green/80 font-medium flex items-center"
                  >
                    En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        <h2 className="text-3xl font-bold text-center mt-20 mb-4">{data.services.title}</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          {data.services.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.services.items.map((service, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-w-16 aspect-h-9 relative h-48">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
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
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">{data.gallery.title}</h2>
        <p className="text-lg mb-10 text-gray-600 max-w-3xl">
          {data.gallery.description}
        </p>
        
        <div className="mt-10 mb-16 relative mx-auto max-w-4xl">
          <Carousel className="w-full">
            <CarouselContent>
              {data.gallery.images.map((image, index) => (
                <CarouselItem key={index} className="md:basis-full">
                  <div className="relative rounded-xl overflow-hidden">
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full aspect-[16/9] object-cover rounded-xl shadow-md" 
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white backdrop-blur-sm">
                      <p className="text-sm md:text-base">{image.caption}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>
        
        <div className="text-center">
          <Link 
            to="/evenements" 
            className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            {data.gallery.seeMoreText}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// FacilitiesSection Component
export const FacilitiesSection = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">{data.facilities.title}</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          {data.facilities.description}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {data.facilities.items.map((facility) => (
            <Card key={facility.id} className="overflow-hidden transition-transform hover:scale-105">
              <div className="aspect-w-16 aspect-h-12 relative h-48">
                <img 
                  src={facility.image} 
                  alt={facility.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{facility.title}</h3>
                <p className="text-sm text-gray-600">{facility.description}</p>
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
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">{data.events.title}</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          {data.events.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.events.items.filter(event => (event as any).showOnHome).map((event) => (
            <Card key={event.id} className={`overflow-hidden transition-all hover:shadow-lg ${event.featured ? 'border-actl-green border-2' : ''}`}>
              <div className="aspect-w-16 aspect-h-9 relative h-64">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {event.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-actl-green hover:bg-actl-green/90">Événement phare</Badge>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <Link 
                  to="/evenements" 
                  className="text-actl-green hover:underline font-medium"
                >
                   {data.events.detailsText}
                </Link>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/evenements"
            className="inline-flex items-center justify-center px-6 py-3 border border-actl-green rounded-md font-medium text-actl-green hover:bg-actl-light-green transition-colors"
          >
              {data.events.detailsText}
          </Link>
        </div>
      </div>
    </section>
  );
};

// DownloadsSection Component
export const DownloadsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">{data.downloads.title}</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          {data.downloads.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.downloads.items.map((document) => (
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
                          {data.downloads.downloadText}
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
  return (
    <section className="py-16 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              {data.contact.title}
            </h2>
            <p className="text-lg mb-8 text-white/90">
              {data.contact.description}
            </p>
            <Button asChild className="bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-600">
              <Link to={data.contact.button.path}>{data.contact.button.text}</Link>
            </Button>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">{data.contact.contactInfoTitle}</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <PhoneCall className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <p>{data.contact.info.phone}</p>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <p>{data.contact.info.email}</p>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <p>{data.contact.info.address}</p>
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
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="inline-block mb-2">
              <img 
                src={data.footer.logo} 
                alt="ACTL Logo" 
                className="h-12 mb-3"
              />
            </Link>
            <p className="mb-2">
              {data.footer.description}
            </p>
            <div className="flex items-center mt-4">
              <span className="text-sm text-gray-600 mr-2">Une filiale du groupe</span>
              <img 
                src={data.footer.groupLogo} 
                alt="Logitrans Logo" 
                className="h-8"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-actl-green mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              {data.footer.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="hover:text-actl-green transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-actl-green mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                <span>{data.footer.contactInfo.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-actl-green flex-shrink-0" />
                <span>{data.footer.contactInfo.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-actl-green flex-shrink-0" />
                <span>{data.footer.contactInfo.email}</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-2 text-actl-green flex-shrink-0 mt-0.5" />
                <span>{data.footer.contactInfo.hours}</span>
              </li>
            </ul>
            
            <div className="mt-5 space-y-3 border-t pt-4">
              <h4 className="font-bold">Équipe commerciale:</h4>
              {data.footer.commercialTeam.map((member, index) => (
                <p key={index} className="text-sm">
                  {member.name} - {member.phone}<br/>{member.role}
                </p>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} ACTL. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Component
const Acceuil = () => {
  // Section événements sur l'accueil
  const featuredEvents = (data.evenements?.events || []).filter(e => e.featured);

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