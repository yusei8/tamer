import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Settings, Plus, PhoneCall, MapPin, Edit, Save, X, Users, Building, Globe, MessageSquare, Smartphone, AtSign, Navigation, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Link } from 'react-router-dom';


export const ContactSection: React.FC = () => {
  const { datapJson, dataJson, updateField } = useDashboardStore();
  const [localFields, setLocalFields] = React.useState({
    accroche1: datapJson?.contactAccroche1 || "Prêt à démarrer votre formation professionnelle ?",
    accroche2: datapJson?.contactAccroche2 || "Contactez-nous dès aujourd'hui pour obtenir plus d'informations sur nos programmes ou pour vous inscrire à une formation.",
    titre: datapJson?.contactTitre || "Contactez-nous",
    sousTitre: datapJson?.contactSousTitre || "Informations de contact",
    buttonText: datapJson?.contactButtonText || "Contactez-nous",
    buttonPath: datapJson?.contactButtonPath || "/contact",
    phoneLabel: datapJson?.contactPhoneLabel || "Appelez-nous",
    phone: datapJson?.contactInfo?.phone || "+213 23803732",
    phoneIcon: datapJson?.contactPhoneIcon || "PhoneCall",
    emailLabel: datapJson?.contactEmailLabel || "Envoyez-nous un email",
    email: datapJson?.contactInfo?.email || "s.dg-actl@groupe-logitrans.dz",
    emailIcon: datapJson?.contactEmailIcon || "Mail",
    addressLabel: datapJson?.contactAddressLabel || "Notre adresse",
    address: datapJson?.contactInfo?.address || "Route de la verte Rive Bordj El Kiffan - Alger",
    addressIcon: datapJson?.contactAddressIcon || "MapPin",
  });

  const [newContactItem, setNewContactItem] = React.useState({
    label: "",
    value: "",
    icon: "Phone"
  });

  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  // Initialiser SEULEMENT au premier chargement
  React.useEffect(() => {
    if (!isInitialized && datapJson && dataJson && Object.keys(datapJson).length > 0 && !(window as any)._hasContactChanges) {
      setLocalFields({
        accroche1: dataJson?.contact?.title || "Prêt à démarrer votre formation professionnelle ?",
        accroche2: dataJson?.contact?.description || "Contactez-nous dès aujourd'hui pour obtenir plus d'informations sur nos programmes ou pour vous inscrire à une formation.",
        titre: dataJson?.contact?.contactInfoTitle || "Contactez-nous",
        sousTitre: datapJson?.contactSousTitre || "Informations de contact",
        buttonText: dataJson?.contact?.button?.text || "Contactez-nous",
        buttonPath: dataJson?.contact?.button?.path || "/contact",
        phoneLabel: datapJson?.contactPhoneLabel || "Appelez-nous",
        phone: dataJson?.contact?.info?.phone || "+213 23803732",
        phoneIcon: datapJson?.contactPhoneIcon || "PhoneCall",
        emailLabel: datapJson?.contactEmailLabel || "Envoyez-nous un email",
        email: dataJson?.contact?.info?.email || "s.dg-actl@groupe-logitrans.dz",
        emailIcon: datapJson?.contactEmailIcon || "Mail",
        addressLabel: datapJson?.contactAddressLabel || "Notre adresse",
        address: dataJson?.contact?.info?.address || "Route de la verte Rive Bordj El Kiffan - Alger",
        addressIcon: datapJson?.contactAddressIcon || "MapPin",
      });
      setIsInitialized(true);
    }
  }, [datapJson, dataJson, isInitialized]);

  const handleChange = (field: string, value: string) => {
    // COPIE EXACTE de updateTeamMember qui fonctionne
    const newFields = { ...localFields, [field]: value };
    setLocalFields(newFields);
    
    // Marquer comme modifié pour éviter la réinitialisation
    (window as any)._hasContactChanges = true;
    
    // NOUVELLE APPROCHE : Mise à jour DIRECTE dans data.json (qui est affiché sur le site)
    if (field === 'phone' || field === 'email' || field === 'address') {
      updateField('data', `contact.info.${field}`, value);
    } else if (field === 'accroche1') {
      updateField('data', 'contact.title', value);
    } else if (field === 'accroche2') {
      updateField('data', 'contact.description', value);
    } else if (field === 'buttonText') {
      updateField('data', 'contact.button.text', value);
    } else if (field === 'buttonPath') {
      updateField('data', 'contact.button.path', value);
    } else if (field === 'titre') {
      updateField('data', 'contact.contactInfoTitle', value);
    } else if (field === 'phoneLabel') {
      updateField('datap', 'contactPhoneLabel', value);
      updateField('data', 'contact.labels.phoneLabel', value);
    } else if (field === 'emailLabel') {
      updateField('datap', 'contactEmailLabel', value);
      updateField('data', 'contact.labels.emailLabel', value);
    } else if (field === 'addressLabel') {
      updateField('datap', 'contactAddressLabel', value);
      updateField('data', 'contact.labels.addressLabel', value);
    } else {
      // Pour les champs qui n'existent que dans le dashboard (icônes, etc.)
      updateField('datap', `contact${field.charAt(0).toUpperCase() + field.slice(1)}`, value);
    }
  };

  // Plus besoin de logique de sauvegarde externe - tout se sauvegarde automatiquement

  const iconOptions = [
    { name: 'PhoneCall', component: PhoneCall },
    { name: 'Mail', component: Mail },
    { name: 'MapPin', component: MapPin },
    { name: 'Smartphone', component: Smartphone },
    { name: 'AtSign', component: AtSign },
    { name: 'Navigation', component: Navigation },
    { name: 'Users', component: Users },
    { name: 'Building', component: Building },
    { name: 'Globe', component: Globe },
    { name: 'MessageSquare', component: MessageSquare },
  ];

  const getIcon = (iconName: string) => {
    const iconObj = iconOptions.find(i => i.name === iconName);
    return iconObj ? iconObj.component : PhoneCall;
  };

  // Plus besoin du composant EditableField - on utilise des Input directs

  const IconSelector = ({ fieldKey, currentIcon }: { fieldKey: string, currentIcon: string }) => {
    return (
      <Select value={currentIcon} onValueChange={(value) => handleChange(fieldKey, value)}>
        <SelectTrigger className="w-[100px] bg-white/20 border-white/30 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {iconOptions.map(icon => {
            const IconComponent = icon.component;
            return (
              <SelectItem key={icon.name} value={icon.name}>
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  {icon.name}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="p-6">
      {/* Mode d'édition - AMÉLIORÉ */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-800">Section Contact - Édition en direct</h2>
          <p className="text-sm text-slate-600 mt-1">
            {isEditing ? "🟢 Mode édition ACTIVÉ - Vous pouvez maintenant éditer l'adresse et les contacts" : "⚪ Cliquez sur 'Activer l'édition' pour modifier les informations de contact"}
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
                L'adresse "Route de la verte Rive Bordj El Kiffan - Alger" est maintenant éditable !
                N'oubliez pas de cliquer sur "Sauvegarder" en haut pour enregistrer vos modifications.
              </p>
            </div>
          </div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Interface identique au site web */}
        {/* PREVIEW NON-ÉDITABLE ou MODE ÉDITION */}
        {isEditing ? (
          /* MODE ÉDITION */
          <section className="py-20 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white relative overflow-hidden rounded-2xl">
            {/* Éléments décoratifs */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="mb-6">
                    <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent text-4xl font-bold leading-tight">
                      <Textarea
                        value={localFields.accroche1}
                        onChange={e => handleChange('accroche1', e.target.value)}
                        className="text-4xl font-bold block bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                        rows={2}
                      />
                    </span>
                  </div>
                  <Textarea
                    value={localFields.accroche2}
                    onChange={e => handleChange('accroche2', e.target.value)}
                    className="text-lg mb-8 text-emerald-100/90 leading-relaxed bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                    rows={2}
                  />
                  
                  {/* Bouton Contactez-nous avec lien modifiable */}
                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-emerald-100/70 mb-2">Texte du bouton :</label>
                      <Input
                        value={localFields.buttonText}
                        onChange={e => handleChange('buttonText', e.target.value)}
                        className="text-base bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-emerald-100/70 mb-2">Lien de redirection :</label>
                      <Input
                        value={localFields.buttonPath}
                        onChange={e => handleChange('buttonPath', e.target.value)}
                        className="text-base bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                      />
                    </div>
                    <Button 
                      asChild 
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                    >
                      <Link to={localFields.buttonPath} className="flex items-center">
                        {localFields.buttonText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl">
                  <Input
                    value={localFields.titre}
                    onChange={e => handleChange('titre', e.target.value)}
                    className="text-2xl font-semibold mb-6 text-emerald-100 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                  />
                  <div className="space-y-6">
                    {/* Téléphone */}
                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-500/30 transition-colors duration-300">
                        {React.createElement(getIcon(localFields.phoneIcon), { className: "h-5 w-5 text-emerald-300" })}
                      </div>
                      <div className="flex-1">
                        <Input
                          value={localFields.phoneLabel}
                          onChange={e => handleChange('phoneLabel', e.target.value)}
                          className="font-medium text-emerald-100 mb-1 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                        />
                        <Input
                          value={localFields.phone}
                          onChange={e => handleChange('phone', e.target.value)}
                          className="text-emerald-200 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                        />
                        <div className="mt-2">
                          <IconSelector fieldKey="phoneIcon" currentIcon={localFields.phoneIcon} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-500/30 transition-colors duration-300">
                        {React.createElement(getIcon(localFields.emailIcon), { className: "h-5 w-5 text-emerald-300" })}
                      </div>
                      <div className="flex-1">
                        <Input
                          value={localFields.emailLabel}
                          onChange={e => handleChange('emailLabel', e.target.value)}
                          className="font-medium text-emerald-100 mb-1 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                        />
                        <Input
                          value={localFields.email}
                          onChange={e => handleChange('email', e.target.value)}
                          className="text-emerald-200 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                        />
                        <div className="mt-2">
                          <IconSelector fieldKey="emailIcon" currentIcon={localFields.emailIcon} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Adresse - ÉDITABLE EN MODE ÉDITION */}
                    <div className="flex items-start group border-2 border-yellow-400 p-3 rounded-lg bg-yellow-50/10">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-500/30 transition-colors duration-300">
                        {React.createElement(getIcon(localFields.addressIcon), { className: "h-5 w-5 text-emerald-300" })}
                      </div>
                      <div className="flex-1">
                        <Input
                          value={localFields.addressLabel}
                          onChange={e => handleChange('addressLabel', e.target.value)}
                          className="font-medium text-emerald-100 mb-1 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/20 transition-all"
                          placeholder="Titre de l'adresse"
                        />
                        <Input
                          value={localFields.address}
                          onChange={e => handleChange('address', e.target.value)}
                          className="text-emerald-200 bg-white/10 border-2 border-yellow-400 rounded-md px-3 py-2 text-white placeholder-white/50 focus:border-yellow-300 focus:bg-yellow-50/20 transition-all"
                          placeholder="Route de la verte Rive Bordj El Kiffan - Alger"
                        />
                        <div className="mt-2">
                          <IconSelector fieldKey="addressIcon" currentIcon={localFields.addressIcon} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* PREVIEW NON-ÉDITABLE IDENTIQUE AU SITE */
          <section className="py-20 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white relative overflow-hidden rounded-2xl">
            {/* Éléments décoratifs */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-4xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                    {localFields.accroche1}
                  </h1>
                  <p className="text-lg mb-8 text-emerald-100/90 leading-relaxed">
                    {localFields.accroche2}
                  </p>
                  
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                  >
                    <Link to={localFields.buttonPath} className="flex items-center">
                      {localFields.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl">
                  <h2 className="text-2xl font-semibold mb-6 text-emerald-100">{localFields.titre}</h2>
                  <div className="space-y-6">
                    {/* Téléphone */}
                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-500/30 transition-colors duration-300">
                        {React.createElement(getIcon(localFields.phoneIcon), { className: "h-5 w-5 text-emerald-300" })}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-emerald-100 mb-1">{localFields.phoneLabel}</p>
                        <p className="text-emerald-200">{localFields.phone}</p>
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-500/30 transition-colors duration-300">
                        {React.createElement(getIcon(localFields.emailIcon), { className: "h-5 w-5 text-emerald-300" })}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-emerald-100 mb-1">{localFields.emailLabel}</p>
                        <p className="text-emerald-200">{localFields.email}</p>
                      </div>
                    </div>
                    
                    {/* Adresse */}
                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-500/30 transition-colors duration-300">
                        {React.createElement(getIcon(localFields.addressIcon), { className: "h-5 w-5 text-emerald-300" })}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-emerald-100 mb-1">{localFields.addressLabel}</p>
                        <p className="text-emerald-200">{localFields.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </motion.div>
    </div>
  );
};

