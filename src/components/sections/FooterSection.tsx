import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Users, Building, Globe, Plus, Upload, Image as ImageIcon, ArrowRight, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { uploadImage } from '../../lib/uploadUtils';

export const FooterSection: React.FC = () => {
  const { datapJson, dataJson, updateField } = useDashboardStore();
  const [localFields, setLocalFields] = React.useState({
    // Logo et description
    logoUrl: datapJson?.footerLogo || "/rachef-uploads/895b9f7a-e550-40cd-ad1b-42bc954e2f3d.png",
    description: datapJson?.footerDescription || "École de formation professionnelle spécialisée dans le domaine de l'automobile et de la logistique.",
    groupText: datapJson?.footerGroupText || "Une filiale du groupe",
    groupLogoUrl: datapJson?.footerGroupLogo || "/rachef-uploads/logitrans-logo.png",
    
    // Liens rapides
    quickLinksTitle: datapJson?.footerQuickLinksTitle || "Liens Rapides",
    quickLinks: datapJson?.footerQuickLinks || [
      { text: "Accueil", path: "/" },
      { text: "Formations", path: "/formations" },
      { text: "Événements", path: "/evenements" },
      { text: "Marchés et Consultations", path: "/marches" },
      { text: "Contact", path: "/contact" }
    ],
    
    // Contact - récupérer depuis datap.json (dashboard) ou data.json (site) 
    contactTitle: datapJson?.footerContactTitle || "Contact",
    address: datapJson?.footerAddress || dataJson?.footer?.contactInfo?.address || "Route de la verte Rive Bordj El Kiffan - Alger",
    phone: datapJson?.footerPhone || dataJson?.footer?.contactInfo?.phone || "+213 21 21 11",
    email: datapJson?.footerEmail || dataJson?.footer?.contactInfo?.email || "s.dg-actl@groupe-logitrans.dz",
    hours: datapJson?.footerHours || dataJson?.footer?.contactInfo?.hours || "Heures d'ouverture: Dimanche au Jeudi, 09h00 à 17h00",
    
    // Équipe commerciale
    teamTitle: datapJson?.footerTeamTitle || "Équipe commerciale:",
    team: datapJson?.footerTeam || [
      { name: "HANIZ LIAS", phone: "0770768368", role: "DIRECTEUR DE LA FORMATION ET DE LA PEDAGOGIE" },
      { name: "KHEROUANI ADEL", phone: "0780563447", role: "DIRECTEUR COMMERCIAL" },
      { name: "BOUCHENAK AMER", phone: "0770289968", role: "COMMERCIAL" },
      { name: "DAMICHZ ZINAB", phone: "0780803591", role: "COMMERCIAL" }
    ],
    
    // Copyright
    copyright: datapJson?.footerCopyright || "© 2025 ACTL. Tous droits réservés."
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const groupFileInputRef = React.useRef<HTMLInputElement>(null);

  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  // Initialiser SEULEMENT au premier chargement
  React.useEffect(() => {
    if (!isInitialized && datapJson && dataJson && Object.keys(datapJson).length > 0 && !(window as any)._hasFooterChanges) {
      setLocalFields({
        logoUrl: dataJson?.footer?.logo || "/rachef-uploads/895b9f7a-e550-40cd-ad1b-42bc954e2f3d.png",
        description: dataJson?.footer?.description || "École de formation professionnelle spécialisée dans le domaine de l'automobile et de la logistique.",
        groupText: dataJson?.footer?.groupText || "Une filiale du groupe",
        groupLogoUrl: dataJson?.footer?.groupLogo || "/rachef-uploads/d30e9f68-60af-4517-a13f-dc4c3610eb9a.png",
        quickLinksTitle: datapJson?.footerQuickLinksTitle || "Liens Rapides",
        quickLinks: datapJson?.footerQuickLinks || [
          { text: "Accueil", path: "/" },
          { text: "Formations", path: "/formations" },
          { text: "Événements", path: "/evenements" },
          { text: "Marchés et Consultations", path: "/marches" },
          { text: "Contact", path: "/contact" }
        ],
        contactTitle: datapJson?.footerContactTitle || "Contact",
        address: dataJson?.footer?.contactInfo?.address || "Route de la verte Rive Bordj El Kiffan - Alger",
        phone: dataJson?.footer?.contactInfo?.phone || "+213 21 21 11",
        email: dataJson?.footer?.contactInfo?.email || "s.dg-actl@groupe-logitrans.dz",
        hours: dataJson?.footer?.contactInfo?.hours || "Heures d'ouverture: Dimanche au Jeudi, 09h00 à 17h00",
        teamTitle: datapJson?.footerTeamTitle || "Équipe commerciale:",
            team: dataJson?.footer?.commercialTeam || [
      { name: "HANIZ LIAS", phone: "0770768368", role: "DIRECTEUR DE LA FORMATION ET DE LA PEDAGOGIE" },
      { name: "KHEROUANI ADEL", phone: "0780563447", role: "DIRECTEUR COMMERCIAL" },
      { name: "BOUCHENAK AMER", phone: "0770289968", role: "COMMERCIAL" },
      { name: "DAMICHZ ZINAB", phone: "0780803591", role: "COMMERCIAL" }
    ],
    copyright: dataJson?.footer?.copyright || "© 2025 ACTL. Tous droits réservés."
      });
      
              // Plus besoin de forcer la sauvegarde dans datap.json puisqu'on lit/écrit directement dans data.json
      
      setIsInitialized(true);
    }
  }, [datapJson, dataJson, isInitialized]);

  const handleChange = (field: string, value: any) => {
    // COPIE EXACTE de updateTeamMember qui fonctionne  
    const newFields = { ...localFields, [field]: value };
    setLocalFields(newFields);
    
    // Marquer comme modifié pour éviter la réinitialisation
    (window as any)._hasFooterChanges = true;
    
    // NOUVELLE APPROCHE : Mise à jour DIRECTE dans data.json (qui est affiché sur le site)
    if (field === 'address' || field === 'phone' || field === 'email' || field === 'hours') {
      updateField('data', `footer.contactInfo.${field}`, value);
    } else if (field === 'description') {
      updateField('data', 'footer.description', value);
    } else if (field === 'copyright') {
      updateField('data', 'footer.copyright', value);
    } else if (field === 'logoUrl') {
      updateField('data', 'footer.logo', value);
    } else if (field === 'groupLogoUrl') {
      updateField('data', 'footer.groupLogo', value);
    } else if (field === 'quickLinks') {
      updateField('data', 'footer.quickLinks', value);
    } else if (field === 'team') {
      updateField('data', 'footer.commercialTeam', value);
    } else if (field === 'groupText') {
      updateField('data', 'footer.groupText', value);
    } else if (field === 'quickLinksTitle') {
      // Titre "Liens Rapides" - maintenant sauvegardé dans data.json pour être affiché sur le site
      updateField('datap', 'footerQuickLinksTitle', value);
      updateField('data', 'footer.titles.quickLinksTitle', value);
    } else if (field === 'contactTitle') {
      // Titre "Contact" - maintenant sauvegardé dans data.json pour être affiché sur le site
      updateField('datap', 'footerContactTitle', value);
      updateField('data', 'footer.titles.contactTitle', value);
    } else if (field === 'teamTitle') {
      // Titre "Équipe commerciale" - maintenant sauvegardé dans data.json pour être affiché sur le site
      updateField('datap', 'footerTeamTitle', value);
      updateField('data', 'footer.titles.teamTitle', value);
    } else {
      // Autres champs dashboard
      updateField('datap', `footer${field.charAt(0).toUpperCase() + field.slice(1)}`, value);
    }
  };

  // Plus besoin de logique de sauvegarde externe - tout se sauvegarde automatiquement

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGroupLogo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadImage(file);
    
    if (result.success && result.filename) {
      const imageUrl = `/rachef-uploads/${result.filename}`;
      
      if (isGroupLogo) {
        handleChange('groupLogoUrl', imageUrl);
      } else {
        handleChange('logoUrl', imageUrl);
      }
      
      toast.success('Logo uploadé avec succès !');
    } else {
      toast.error(`Erreur upload: ${result.error}`);
    }
  };

  // Plus besoin du composant EditableField - on utilise des Input directs

  const addTeamMember = () => {
    const newTeam = [...localFields.team, { name: "", phone: "", role: "" }];
    handleChange('team', newTeam);
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newTeam = [...localFields.team];
    newTeam[index] = { ...newTeam[index], [field]: value };
    
    // Mise à jour locale
    setLocalFields(prev => ({ ...prev, team: newTeam }));
    
    // Marquer comme modifié pour éviter la réinitialisation
    (window as any)._hasFooterChanges = true;
    
    // Mise à jour DIRECTE dans data.json (site principal)
    updateField('data', `footer.commercialTeam.${index}.${field}`, value);
  };

  const removeTeamMember = (index: number) => {
    const newTeam = localFields.team.filter((_, i) => i !== index);
    handleChange('team', newTeam);
  };

  return (
    <div className="p-6">
      {/* Mode d'édition - AMÉLIORÉ */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-800">Section Footer - Édition en direct</h2>
          <p className="text-sm text-slate-600 mt-1">
            {isEditing ? "🟢 Mode édition ACTIVÉ - Vous pouvez maintenant éditer tous les champs" : "⚪ Cliquez sur 'Activer l'édition' pour modifier le footer"}
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

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        {/* PREVIEW NON-ÉDITABLE ou MODE ÉDITION */}
        {isEditing ? (
          /* MODE ÉDITION COMPLET */
          <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden rounded-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Section 1: Logo et description */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Logo ACTL :</label>
                  <div className="flex items-center gap-4">
                    <img 
                      src={localFields.logoUrl} 
                      alt="ACTL Logo" 
                      className="h-12 mb-4 transition-transform duration-300 hover:scale-105"
                    />
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/10 border border-white/30 hover:bg-white/20"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Parcourir
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="hidden"
                  />
                </div>
                
                <Textarea
                  value={localFields.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className="mb-4 text-gray-400 leading-relaxed bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                  rows={2}
                />
                
                <div className="flex items-center mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <Input
                    value={localFields.groupText}
                    onChange={e => handleChange('groupText', e.target.value)}
                    className="text-sm text-gray-400 mr-3 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                  />
                  <div className="flex items-center gap-2">
                    <img 
                      src={localFields.groupLogoUrl} 
                      alt="Logitrans Logo" 
                      className="h-8 transition-transform duration-300 hover:scale-105"
                    />
                    <Button 
                      size="sm"
                      onClick={() => groupFileInputRef.current?.click()}
                      className="bg-white/10 border border-white/30 hover:bg-white/20 text-xs"
                    >
                      <Upload className="w-3 h-3" />
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={groupFileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* Section 2: Liens Rapides */}
              <div>
                <Input
                  value={localFields.quickLinksTitle}
                  onChange={e => handleChange('quickLinksTitle', e.target.value)}
                  className="text-xl font-bold text-emerald-400 mb-6 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                />
                <ul className="space-y-3">
                  {localFields.quickLinks.map((link, index) => (
                    <li key={index} className="flex items-center justify-between group">
                      <div className="flex-1 mr-4">
                        <Input
                          value={link.text}
                          onChange={e => {
                            const newLinks = [...localFields.quickLinks];
                            newLinks[index] = { ...newLinks[index], text: e.target.value };
                            handleChange('quickLinks', newLinks);
                          }}
                          className="mb-2 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                        />
                        <div className="flex flex-col space-y-2">
                          <Select
                            value={link.path}
                            onValueChange={(value) => {
                              const newLinks = [...localFields.quickLinks];
                              newLinks[index] = { ...newLinks[index], path: value };
                              handleChange('quickLinks', newLinks);
                            }}
                          >
                            <SelectTrigger className="w-full bg-white/10 border border-white/30 text-white text-xs">
                              <SelectValue placeholder="Sélectionner une page" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="/">Accueil</SelectItem>
                              <SelectItem value="/formations/catalogue">Catalogue de formation</SelectItem>
                              <SelectItem value="/formations/mecanique">Mécanique Automobile</SelectItem>
                              <SelectItem value="/formations/diagnostic">Diagnostic Automobile</SelectItem>
                              <SelectItem value="/formations/conduite">Brevet Professionnel</SelectItem>
                              <SelectItem value="/formations/commerce">Commerce & Marketing</SelectItem>
                              <SelectItem value="/formations/finance">Comptabilité & Finance</SelectItem>
                              <SelectItem value="/evenements">Événements</SelectItem>
                              <SelectItem value="/marches">Marchés et Consultations</SelectItem>
                              <SelectItem value="/contact">Contact</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={link.path}
                            onChange={e => {
                              const newLinks = [...localFields.quickLinks];
                              newLinks[index] = { ...newLinks[index], path: e.target.value };
                              handleChange('quickLinks', newLinks);
                            }}
                            className="text-xs bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                            placeholder="Ou saisir un chemin personnalisé"
                          />
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newLinks = localFields.quickLinks.filter((_, i) => i !== index);
                          handleChange('quickLinks', newLinks);
                        }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Section 3: Contact */}
              <div>
                <Input
                  value={localFields.contactTitle}
                  onChange={e => handleChange('contactTitle', e.target.value)}
                  className="text-xl font-bold text-emerald-400 mb-6 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                />
                <ul className="space-y-4">
                  <li className="flex items-start group">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-emerald-500/30 transition-colors duration-300">
                      <MapPin className="h-4 w-4 text-emerald-400" />
                    </div>
                    <Input
                      value={localFields.address}
                      onChange={e => handleChange('address', e.target.value)}
                      className="text-gray-400 leading-relaxed flex-1 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                    />
                  </li>
                  <li className="flex items-center group">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-emerald-500/30 transition-colors duration-300">
                      <Phone className="h-4 w-4 text-emerald-400" />
                    </div>
                    <Input
                      value={localFields.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      className="text-gray-400 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                    />
                  </li>
                  <li className="flex items-center group">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-emerald-500/30 transition-colors duration-300">
                      <Mail className="h-4 w-4 text-emerald-400" />
                    </div>
                    <Input
                      value={localFields.email}
                      onChange={e => handleChange('email', e.target.value)}
                      className="text-gray-400 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                    />
                  </li>
                  <li className="flex items-start group">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-emerald-500/30 transition-colors duration-300">
                      <Clock className="h-4 w-4 text-emerald-400" />
                    </div>
                    <Input
                      value={localFields.hours}
                      onChange={e => handleChange('hours', e.target.value)}
                      className="text-gray-400 leading-relaxed flex-1 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                    />
                  </li>
                </ul>
                
                {/* Équipe commerciale */}
                <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                  <Input
                    value={localFields.teamTitle}
                    onChange={e => handleChange('teamTitle', e.target.value)}
                    className="font-bold text-emerald-400 mb-4 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                  />
                  <div className="space-y-3">
                    {localFields.team.map((member, index) => (
                      <div key={index} className="space-y-2 p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex gap-2">
                          <Input
                            value={member.name}
                            onChange={e => updateTeamMember(index, 'name', e.target.value)}
                            placeholder="Nom"
                            className="bg-white/10 border border-white/30 text-emerald-300 font-medium text-sm"
                          />
                          <Input
                            value={member.phone}
                            onChange={e => updateTeamMember(index, 'phone', e.target.value)}
                            placeholder="Téléphone"
                            className="bg-white/10 border border-white/30 text-emerald-300 font-medium text-sm"
                          />
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => removeTeamMember(index)}
                          >
                            ×
                          </Button>
                        </div>
                        <Input
                          value={member.role}
                          onChange={e => updateTeamMember(index, 'role', e.target.value)}
                          placeholder="Rôle"
                          className="bg-white/10 border border-white/30 text-gray-400 text-sm"
                        />
                      </div>
                    ))}
                    <Button 
                      onClick={addTeamMember}
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter membre
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="border-t border-slate-700 mt-12 pt-8 text-center">
              <Input
                value={localFields.copyright}
                onChange={e => handleChange('copyright', e.target.value)}
                className="text-gray-400 text-center bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
              />
            </div>
          </div>
        </section>
        ) : (
          /* PREVIEW NON-ÉDITABLE IDENTIQUE AU SITE */
          <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden rounded-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                
                {/* Section 1: Logo et description */}
                <div>
                  <img 
                    src={localFields.logoUrl} 
                    alt="ACTL Logo" 
                    className="h-12 mb-4 transition-transform duration-300 hover:scale-105"
                  />
                  <p className="mb-4 text-gray-400 leading-relaxed">{localFields.description}</p>
                  
                  <div className="flex items-center mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <span className="text-sm text-gray-400 mr-3">{localFields.groupText}</span>
                    <img 
                      src={localFields.groupLogoUrl} 
                      alt="Logitrans Logo" 
                      className="h-8 transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
                
                {/* Section 2: Liens Rapides */}
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-6">{localFields.quickLinksTitle}</h3>
                  <ul className="space-y-3">
                    {localFields.quickLinks.map((link, index) => (
                      <li key={index}>
                        <Link 
                          to={link.path} 
                          className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group"
                        >
                          <ArrowRight className="w-4 h-4 mr-2 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Section 3: Contact et Équipe commerciale */}
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-6">{localFields.contactTitle}</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-emerald-500 mr-3 mt-0.5" />
                      <p className="text-gray-300">{localFields.address}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-emerald-500 mr-3" />
                      <p className="text-gray-300">{localFields.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-emerald-500 mr-3" />
                      <p className="text-gray-300">{localFields.email}</p>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-emerald-500 mr-3 mt-0.5" />
                      <p className="text-gray-300 text-sm">{localFields.hours}</p>
                    </div>
                  </div>
                  
                  {/* Équipe commerciale */}
                  <h4 className="text-lg font-semibold text-emerald-300 mb-4">{localFields.teamTitle}</h4>
                  <div className="space-y-3">
                    {localFields.team.map((member, index) => (
                      <div key={index} className="bg-slate-800/30 p-3 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">{member.name}</p>
                            <p className="text-sm text-emerald-400">{member.role}</p>
                          </div>
                          <a 
                            href={`tel:${member.phone}`}
                            className="text-emerald-500 hover:text-emerald-400 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{member.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Copyright */}
              <div className="border-t border-slate-700 mt-12 pt-8 text-center">
                <p className="text-gray-400">{localFields.copyright}</p>
              </div>
            </div>
          </section>
        )}
      </motion.div>
    </div>
  );
}; 