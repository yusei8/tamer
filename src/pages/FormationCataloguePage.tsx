import React, { useEffect } from 'react';
import FormationCatalogue from '../components/sections/FormationCatalogue';
import { HeroSection } from '../components/sections/HeroSection';
import { FooterSection } from '../components/sections/FooterSection';
import { NavigationSection } from '../components/sections/NavigationSection';

const FormationCataloguePage: React.FC = () => {
  // Scroll automatique fluide vers le titre
  useEffect(() => {
    const scrollToTitle = () => {
      // Attendre que le contenu soit chargé
      setTimeout(() => {
        const titleElement = document.getElementById('catalogue-title');
        if (titleElement) {
          // Calculer la position pour que le titre soit visible en haut de l'écran
          const rect = titleElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = scrollTop + rect.top - 100; // 100px de marge depuis le haut
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
    };

    scrollToTitle();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <NavigationSection />
      <FormationCatalogue 
        title="Catalogue de Formations ACTL"
        description="Découvrez notre gamme complète de formations professionnelles conçues pour développer vos compétences et accélérer votre carrière. Naviguez facilement avec les flèches ou en glissant sur mobile."
      />
      <FooterSection />
    </div>
  );
};

export default FormationCataloguePage; 