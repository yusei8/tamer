import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Upload } from 'lucide-react';

export const NavigationSection: React.FC = () => {
  const { datapJson, dataJson, updateField } = useDashboardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);
  
  const [localFields, setLocalFields] = useState({
    logo: datapJson?.navbarLogo || "/rachef-uploads/895b9f7a-e550-40cd-ad1b-42bc954e2f3d.png",
    accueil: datapJson?.navbarAccueil || "Accueil",
    formations: datapJson?.navbarFormations || "Formations", 
    evenements: datapJson?.navbarEvenements || "Événements",
    marches: datapJson?.navbarMarches || "Marchés et Consultations",
    contact: datapJson?.navbarContact || "Contact"
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser SEULEMENT au premier chargement
  React.useEffect(() => {
    if (!isInitialized && datapJson && dataJson && Object.keys(datapJson).length > 0 && !(window as any)._hasNavbarChanges) {
      setLocalFields({
        logo: dataJson?.navbar?.logo || "/rachef-uploads/895b9f7a-e550-40cd-ad1b-42bc954e2f3d.png",
        accueil: dataJson?.navbar?.links?.[0]?.text || "Accueil",
        formations: dataJson?.navbar?.links?.[1]?.text || "Formations",
        evenements: dataJson?.navbar?.links?.[2]?.text || "Événements",
        marches: dataJson?.navbar?.links?.[3]?.text || "Marchés et Consultations",
        contact: dataJson?.navbar?.links?.[4]?.text || "Contact"
      });
      setIsInitialized(true);
    }
  }, [datapJson, dataJson, isInitialized]);

  const handleChange = (field: string, value: string) => {
    // Bloquer la modification du champ "formations" 
    if (field === 'formations') {
      console.log('⚠️ Modification du champ "Formations" bloquée pour préserver le menu déroulant');
      return;
    }

    const newFields = { ...localFields, [field]: value };
    setLocalFields(newFields);
    
    // Marquer comme modifié pour éviter la réinitialisation
    (window as any)._hasNavbarChanges = true;
    
    // Mise à jour DIRECTE dans data.json
    if (field === 'logo') {
      updateField('data', 'navbar.logo', value);
    } else if (field === 'accueil') {
      updateField('data', 'navbar.links.0.text', value);
    } else if (field === 'evenements') {
      updateField('data', 'navbar.links.2.text', value);
    } else if (field === 'marches') {
      updateField('data', 'navbar.links.3.text', value);
    } else if (field === 'contact') {
      updateField('data', 'navbar.links.4.text', value);
    } else {
      // Pour les champs qui n'existent que dans le dashboard
      updateField('datap', `navbar${field.charAt(0).toUpperCase() + field.slice(1)}`, value);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        handleChange('logo', result.imageUrl);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleFormations = () => setIsFormationsOpen(!isFormationsOpen);

  // Génération dynamique des sous-liens formations (automatique depuis les cartes formations)
  const formationsSubLinks = (dataJson.formations?.items || [])
    .filter(f => f && f.showOnHome)
    .map(f => ({
      text: f.title,
      path: f.path || `/formations/${f.id}`
    }));
  const catalogueLink = { text: 'Catalogue de formation', path: '#catalogue-section', isScroll: true };
  const allSubLinks = [catalogueLink, ...formationsSubLinks];

  return (
    <div className="space-y-4">
      {/* Mode d'édition - AMÉLIORÉ */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-800">Navigation Bar - Édition en direct</h2>
          <p className="text-sm text-slate-600 mt-1">
            {isEditing ? "🟢 Mode édition ACTIVÉ - Vous pouvez maintenant éditer tous les champs" : "⚪ Cliquez sur 'Activer l'édition' pour modifier la navigation"}
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={`text-lg px-6 py-3 font-semibold transition-all duration-300 ${
            isEditing 
              ? "bg-red-600 hover:bg-red-700 shadow-lg animate-pulse" 
              : "bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl"
          }`}
        >
          {isEditing ? "🔴 Arrêter l'édition" : "✏️ Activer l'édition"}
        </Button>
      </div>

      {/* Indicateur visuel quand le mode édition est activé */}
      {isEditing && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Mode édition activé !</strong> Vous pouvez maintenant modifier tous les champs. 
                Les champs éditables sont encadrés en bleu. N'oubliez pas de cliquer sur "Sauvegarder" en haut pour enregistrer vos modifications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navbar avec le VRAI design du site */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <img 
                      src={localFields.logo} 
                      alt="ACTL Logo" 
                      className="h-12 border-2 border-blue-300 rounded"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => document.getElementById('navbar-logo-upload')?.click()}
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                    <input
                      id="navbar-logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <img 
                    src={localFields.logo} 
                    alt="ACTL Logo" 
                    className="h-12 transition-transform duration-300 group-hover:scale-110"
                  />
                )}
              </Link>
            </div>

            <nav className="hidden md:flex space-x-2">
              {/* Accueil */}
              <div className="mx-2">
                {isEditing ? (
                  <Input
                    value={localFields.accueil}
                    onChange={(e) => handleChange('accueil', e.target.value)}
                    className="w-32 border-blue-300"
                  />
                ) : (
                  <Link 
                    to="/"
                    className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:bg-emerald-50 rounded-lg"
                  >
                    {localFields.accueil}
                  </Link>
                )}
              </div>

              {/* Formations */}
              <div className="relative mx-2">
                {isEditing ? (
                  <Input
                    value={localFields.formations}
                    onChange={(e) => handleChange('formations', e.target.value)}
                    className="w-32 border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    disabled
                    title="Ce champ n'est pas modifiable pour préserver le fonctionnement du menu déroulant"
                  />
                ) : (
                  <>
                    <button 
                      className="flex items-center px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:bg-emerald-50 rounded-lg"
                      onClick={toggleFormations}
                    >
                      <span>{localFields.formations}</span>
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${isFormationsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isFormationsOpen && (
                      <div className="absolute left-0 mt-2 w-72 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-3 z-50 border border-emerald-100 animate-in slide-in-from-top-2 duration-200">
                        {allSubLinks.map((subLink, subIndex) => (
                          subLink.isScroll ? (
                            <button
                              key={subIndex}
                              onClick={() => {
                                setIsFormationsOpen(false);
                                const element = document.getElementById('catalogue-section');
                                if (element) {
                                  element.scrollIntoView({ 
                                    behavior: 'smooth',
                                    block: 'start'
                                  });
                                }
                              }}
                              className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 border-l-2 border-transparent hover:border-emerald-400"
                            >
                              {subLink.text}
                            </button>
                          ) : (
                            <Link
                              key={subIndex}
                              to={subLink.path}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 border-l-2 border-transparent hover:border-emerald-400"
                              onClick={() => setIsFormationsOpen(false)}
                            >
                              {subLink.text}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Événements */}
              <div className="mx-2">
                {isEditing ? (
                  <Input
                    value={localFields.evenements}
                    onChange={(e) => handleChange('evenements', e.target.value)}
                    className="w-32 border-blue-300"
                  />
                ) : (
                  <Link 
                    to="/evenements"
                    className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:bg-emerald-50 rounded-lg"
                  >
                    {localFields.evenements}
                  </Link>
                )}
              </div>

              {/* Marchés */}
              <div className="mx-2">
                {isEditing ? (
                  <Input
                    value={localFields.marches}
                    onChange={(e) => handleChange('marches', e.target.value)}
                    className="w-48 border-blue-300"
                  />
                ) : (
                  <Link 
                    to="/marches"
                    className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:bg-emerald-50 rounded-lg"
                  >
                    {localFields.marches}
                  </Link>
                )}
              </div>

              {/* Contact */}
              <div className="mx-2">
                {isEditing ? (
                  <Input
                    value={localFields.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                    className="w-32 border-blue-300"
                  />
                ) : (
                  <Link 
                    to="/contact"
                    className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:bg-emerald-50 rounded-lg"
                  >
                    {localFields.contact}
                  </Link>
                )}
              </div>
            </nav>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                aria-label="Open Menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white/95 backdrop-blur-md px-4 pt-2 pb-4 shadow-lg border-t border-emerald-100">
            {/* Accueil mobile */}
            <div className="py-3">
              {isEditing ? (
                <Input
                  value={localFields.accueil}
                  onChange={(e) => handleChange('accueil', e.target.value)}
                  className="w-full border-blue-300"
                />
              ) : (
                <Link
                  to="/"
                  className="block text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {localFields.accueil}
                </Link>
              )}
            </div>

            {/* Formations mobile */}
            <div>
              {isEditing ? (
                <Input
                  value={localFields.formations}
                  onChange={(e) => handleChange('formations', e.target.value)}
                  className="w-full border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed mb-3"
                  disabled
                  title="Ce champ n'est pas modifiable pour préserver le fonctionnement du menu déroulant"
                />
              ) : (
                <>
                  <button 
                    onClick={toggleFormations}
                    className="flex items-center w-full py-3 text-left text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300"
                  >
                    <span>{localFields.formations}</span>
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
                </>
              )}
            </div>

            {/* Autres liens mobiles */}
            {[
              { field: 'evenements', path: '/evenements' },
              { field: 'marches', path: '/marches' },
              { field: 'contact', path: '/contact' }
            ].map(({ field, path }) => (
              <div key={field} className="py-3">
                {isEditing ? (
                  <Input
                    value={localFields[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full border-blue-300"
                  />
                ) : (
                  <Link
                    to={path}
                    className="block text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {localFields[field]}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}
      </header>

      {/* Info sur la génération automatique */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">ℹ️ Information</h3>
        <p className="text-sm text-blue-700">
          <strong>Titres principaux :</strong> Vous pouvez modifier les noms des sections principales de la navigation.
        </p>
        <p className="text-sm text-blue-700 mt-1">
          <strong>Sous-menus formations :</strong> Générés automatiquement depuis vos cartes de formations. 
          Pour les modifier, allez dans la section "Formations" du dashboard.
        </p>
      </div>
    </div>
  );
};

