import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/stores/dashboardStore';
import { GraduationCap, ArrowRight, Upload, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const { datapJson, dataJson, updateField } = useDashboardStore();
  const [localFields, setLocalFields] = React.useState({
    backgroundImage: datapJson?.heroBackgroundImage || "/rachef-uploads/1753620600260-03feee7d926f2913.jpeg",
    title2: datapJson?.heroTitle2 || "Académie de Transport & Logistique",
    titleLine1: datapJson?.heroTitleLine1 || "Centre d'excellence en",
    titleLine2: datapJson?.heroTitleLine2 || "Formation professionnelle",
    description: datapJson?.heroDescription || "ACTL propose une gamme complète de formations professionnelles dans divers secteurs : automobile, logistique, commerce, finances et ressources humaines, pour préparer les experts de demain.",
    scrollText: datapJson?.heroScrollText || "Découvrir",
    showScrollIndicator: datapJson?.heroShowScrollIndicator !== false,
    scrollPositionX: datapJson?.heroScrollPositionX || 50, // Position en pourcentage (50 = centre)
    scrollPositionY: datapJson?.heroScrollPositionY || 85, // Position en pourcentage (85 = près du bas)
    buttons: datapJson?.heroButtons || [
      {
        text: "Découvrez nos formations",
        path: "/formations/catalogue",
        variant: "primary"
      },
      {
        text: "Contactez-nous",
        path: "/contact",
        variant: "secondary"
      }
    ]
  });

  const [isEditing, setIsEditing] = React.useState(false);
  const [newButton, setNewButton] = React.useState({
    text: "",
    path: "/",
    variant: "primary"
  });

  const [isInitialized, setIsInitialized] = React.useState(false);

  // Initialiser SEULEMENT au premier chargement
  React.useEffect(() => {
    if (!isInitialized && datapJson && dataJson && Object.keys(datapJson).length > 0 && !(window as any)._hasHeroChanges) {
      setLocalFields({
        backgroundImage: dataJson?.hero?.backgroundImage || "/rachef-uploads/1753620600260-03feee7d926f2913.jpeg",
        title2: dataJson?.hero?.title2 || "Académie de Transport & Logistique",
        titleLine1: dataJson?.hero?.titleLine1 || "Centre d'excellence en",
        titleLine2: dataJson?.hero?.titleLine2 || "Formation professionnelle",
        description: dataJson?.hero?.description || "ACTL propose une gamme complète de formations professionnelles dans divers secteurs : automobile, logistique, commerce, finances et ressources humaines, pour préparer les experts de demain.",
        scrollText: dataJson?.hero?.scrollText || "Découvrir",
        showScrollIndicator: dataJson?.hero?.showScrollIndicator !== false,
        scrollPositionX: dataJson?.hero?.scrollPositionX || 50,
        scrollPositionY: dataJson?.hero?.scrollPositionY || 85,
        buttons: dataJson?.hero?.buttons || [
          {
            text: "Découvrez nos formations",
            path: "/formations/catalogue",
            variant: "primary"
          },
          {
            text: "Contactez-nous",
            path: "/contact",
            variant: "secondary"
          }
        ]
      });
      setIsInitialized(true);
    }
  }, [datapJson, dataJson, isInitialized]);

  const handleChange = (field: string, value: any) => {
    const newFields = { ...localFields, [field]: value };
    setLocalFields(newFields);
    
    // Marquer comme modifié pour éviter la réinitialisation
    (window as any)._hasHeroChanges = true;
    
    // Mise à jour DIRECTE dans data.json (qui est affiché sur le site)
    if (field === 'backgroundImage') {
      updateField('data', 'hero.backgroundImage', value);
    } else if (field === 'title2') {
      updateField('data', 'hero.title2', value);
    } else if (field === 'titleLine1') {
      updateField('data', 'hero.titleLine1', value);
    } else if (field === 'titleLine2') {
      updateField('data', 'hero.titleLine2', value);
    } else if (field === 'description') {
      updateField('data', 'hero.description', value);
    } else if (field === 'scrollText') {
      updateField('data', 'hero.scrollText', value);
    } else if (field === 'showScrollIndicator') {
      updateField('data', 'hero.showScrollIndicator', value);
    } else if (field === 'scrollPositionX') {
      updateField('data', 'hero.scrollPositionX', value);
    } else if (field === 'scrollPositionY') {
      updateField('data', 'hero.scrollPositionY', value);
    } else if (field === 'buttons') {
      updateField('data', 'hero.buttons', value);
    } else {
      // Pour les champs qui n'existent que dans le dashboard
      updateField('datap', `hero${field.charAt(0).toUpperCase() + field.slice(1)}`, value);
    }
  };

  const addButton = () => {
    if (newButton.text && newButton.path) {
      const updatedButtons = [...localFields.buttons, { ...newButton }];
      handleChange('buttons', updatedButtons);
      setNewButton({ text: "", path: "/", variant: "primary" });
    }
  };

  const removeButton = (index: number) => {
    const updatedButtons = localFields.buttons.filter((_, i) => i !== index);
    handleChange('buttons', updatedButtons);
  };

  const updateButton = (index: number, field: string, value: string) => {
    const updatedButtons = [...localFields.buttons];
    updatedButtons[index] = { ...updatedButtons[index], [field]: value };
    handleChange('buttons', updatedButtons);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file); // Correct field name

    try {
      const response = await fetch('/api/upload', { // Correct API endpoint
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const imageUrl = result.filePath; // Correct response field
        handleChange('backgroundImage', imageUrl);
        console.log('Image uploadée avec succès:', imageUrl);
      } else {
        const error = await response.json();
        console.error('Erreur serveur:', error);
        alert('Erreur lors de l\'upload: ' + (error.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur réseau lors de l\'upload de l\'image');
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode d'édition - AMÉLIORÉ */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-800">Section Hero - Édition en direct</h2>
          <p className="text-sm text-slate-600 mt-1">
            {isEditing ? "🟢 Mode édition ACTIVÉ - Vous pouvez maintenant éditer tous les champs" : "⚪ Cliquez sur 'Activer l'édition' pour modifier la bannière principale"}
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

      {/* Section Hero avec le VRAI design du site */}
      <div className="relative min-h-[50vh] overflow-hidden bg-black">
        {/* Background Image avec effet 3D */}
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-110 transition-transform transition-duration-[10s] hover:scale-125"
          style={{ 
            backgroundImage: `url(${localFields.backgroundImage})`,
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contenu principal avec animations créatives */}
            <div className="space-y-8 w-full max-w-4xl">
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
                    {isEditing ? (
                      <Input
                        value={localFields.title2}
                        onChange={(e) => handleChange('title2', e.target.value)}
                        className="bg-white/10 border border-white/30 text-white text-xl font-bold tracking-wider"
                        placeholder="Badge"
                      />
                    ) : (
                      <span className="block w-full max-w-xl text-white text-xl font-bold tracking-wider bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
                        {localFields.title2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Titre principal avec largeur augmentée */}
              <div className="space-y-6 w-full">
                <h1 className="text-5xl md:text-6xl font-black leading-tight">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={localFields.titleLine1}
                        onChange={(e) => handleChange('titleLine1', e.target.value)}
                        className="bg-white/10 border border-white/30 text-white text-4xl font-bold"
                        placeholder="Ligne 1"
                      />
                      <Input
                        value={localFields.titleLine2}
                        onChange={(e) => handleChange('titleLine2', e.target.value)}
                        className="bg-white/10 border border-white/30 text-white text-4xl font-bold"
                        placeholder="Ligne 2"
                      />
                    </div>
                  ) : (
                    <span className="block w-full max-w-6xl p-6 text-4xl font-bold leading-snug bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent drop-shadow-2xl">
                      {localFields.titleLine1}<br />
                      {localFields.titleLine2}
                    </span>
                  )}
                </h1>
              </div>
              
              {/* Description avec barre latérale animée */}
              <div className="relative group">
                <div className="absolute -left-6 top-0 w-2 h-full bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -left-8 top-0 w-6 h-full bg-gradient-to-b from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-full blur-sm" />
                {isEditing ? (
                  <Textarea
                    value={localFields.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="bg-white/10 border border-white/30 text-white text-xl pl-4 min-h-[100px]"
                    placeholder="Description"
                  />
                ) : (
                  <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light pl-4">
                    {localFields.description}
                  </p>
                )}
              </div>
              
              {/* Boutons avec effets créatifs avancés */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                {localFields.buttons.map((button, index) => (
                  <div key={index} className="group relative">
                    {/* Effet de glow animé */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-700 animate-pulse" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {isEditing ? (
                      <div className="relative bg-white/10 p-4 rounded-lg border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-emerald-200">Bouton {index + 1}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeButton(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Input
                            value={button.text}
                            onChange={(e) => updateButton(index, 'text', e.target.value)}
                            className="bg-white/10 border border-white/30 text-white text-sm"
                            placeholder="Texte"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Select
                              value={button.path}
                              onValueChange={(value) => updateButton(index, 'path', value)}
                            >
                              <SelectTrigger className="bg-white/10 border border-white/30 text-white text-xs">
                                <SelectValue placeholder="Page" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="/">Accueil</SelectItem>
                                <SelectItem value="/formations/catalogue">Catalogue</SelectItem>
                                <SelectItem value="/contact">Contact</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={button.variant}
                              onValueChange={(value) => updateButton(index, 'variant', value)}
                            >
                              <SelectTrigger className="bg-white/10 border border-white/30 text-white text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="primary">Principal</SelectItem>
                                <SelectItem value="secondary">Secondaire</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ) : (
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
                    )}
                  </div>
                ))}
                
                {/* Ajouter un bouton */}
                {isEditing && (
                  <div className="relative">
                    <Button
                      onClick={() => {
                        setNewButton({ ...newButton, text: "Nouveau bouton" });
                        setTimeout(() => addButton(), 100);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Indicateur de scroll créatif */}
        {localFields.showScrollIndicator && (
          <div 
            className="absolute animate-bounce group cursor-pointer"
            style={{
              left: `${localFields.scrollPositionX}%`,
              top: `${localFields.scrollPositionY}%`,
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
              {isEditing ? (
                <Input
                  value={localFields.scrollText}
                  onChange={(e) => handleChange('scrollText', e.target.value)}
                  className="bg-white/10 border border-white/30 text-white text-sm mt-3 w-24 text-center"
                  placeholder="Texte"
                />
              ) : (
                <div className="text-white/70 text-sm mt-3 group-hover:text-white transition-colors duration-300">
                  {localFields.scrollText}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

             {/* Panneau d'édition avancée */}
       {isEditing && (
         <div className="bg-white p-6 rounded-lg shadow-lg border">
           <h3 className="text-lg font-semibold mb-4">Édition avancée</h3>
           
           <div className="space-y-6">
             {/* Image de fond */}
             <div>
               <label className="block text-sm font-medium mb-2">Image de fond</label>
               <div className="space-y-3">
                 <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                   <img 
                     src={localFields.backgroundImage} 
                     alt="Background Preview" 
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                     <Button
                       onClick={() => document.getElementById('hero-image-upload')?.click()}
                       variant="secondary"
                       className="bg-white/90 hover:bg-white"
                     >
                       <Upload className="h-4 w-4 mr-2" />
                       Changer l'image
                     </Button>
                   </div>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Input
                     value={localFields.backgroundImage}
                     onChange={(e) => handleChange('backgroundImage', e.target.value)}
                     className="flex-1"
                     placeholder="Ou entrez l'URL de l'image"
                   />
                   <Button
                     onClick={() => document.getElementById('hero-image-upload')?.click()}
                     variant="outline"
                     size="sm"
                   >
                     <Upload className="h-4 w-4" />
                   </Button>
                 </div>
                 <input
                   id="hero-image-upload"
                   type="file"
                   accept="image/*"
                   onChange={handleImageUpload}
                   className="hidden"
                 />
               </div>
             </div>

                           {/* Indicateur de scroll (souris flottante) */}
              <div>
                <label className="block text-sm font-medium mb-2">Indicateur de scroll (souris flottante)</label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={localFields.showScrollIndicator}
                      onChange={(e) => handleChange('showScrollIndicator', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700">Afficher l'indicateur de scroll</label>
                  </div>
                  
                  {localFields.showScrollIndicator && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Texte de l'indicateur</label>
                        <Input
                          value={localFields.scrollText}
                          onChange={(e) => handleChange('scrollText', e.target.value)}
                          placeholder="Découvrir"
                          className="w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Position horizontale (X%)</label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={localFields.scrollPositionX}
                              onChange={(e) => handleChange('scrollPositionX', parseInt(e.target.value) || 0)}
                              className="w-full"
                            />
                            <span className="text-xs text-gray-500">%</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">0 = gauche, 50 = centre, 100 = droite</div>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Position verticale (Y%)</label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={localFields.scrollPositionY}
                              onChange={(e) => handleChange('scrollPositionY', parseInt(e.target.value) || 0)}
                              className="w-full"
                            />
                            <span className="text-xs text-gray-500">%</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">0 = haut, 50 = centre, 100 = bas</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-2">Positions prédéfinies :</div>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              handleChange('scrollPositionX', 50);
                              handleChange('scrollPositionY', 85);
                            }}
                            className="text-xs"
                          >
                            Centre-Bas
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              handleChange('scrollPositionX', 10);
                              handleChange('scrollPositionY', 50);
                            }}
                            className="text-xs"
                          >
                            Gauche-Centre
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              handleChange('scrollPositionX', 90);
                              handleChange('scrollPositionY', 50);
                            }}
                            className="text-xs"
                          >
                            Droite-Centre
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
           </div>
         </div>
       )}
    </div>
  );
};

