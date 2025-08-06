import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useAuthStore } from '@/stores/authStore';
import { MapPin, Phone, Mail, Clock, Building2, Users, ExternalLink, Plus, Trash2, Settings, MessageSquare, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ContactsManagement from './ContactsManagement';

export const UserContactSection: React.FC = () => {
  const { datapJson, dataJson, updateField } = useDashboardStore();
  const { hasPermission, currentAdmin } = useAuthStore();
  const { toast } = useToast();
  
  // État pour l'édition des champs
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({
    title: datapJson?.contact?.title || "Contactez-nous",
    subtitle: datapJson?.contact?.subtitle || "Nous sommes là pour vous aider",
    description: datapJson?.contact?.description || "N'hésitez pas à nous contacter pour toute information.",
    address: datapJson?.contact?.address || "123 Rue de l'ACTL, Alger",
    phone: datapJson?.contact?.phone || "+213 123 456 789",
    email: datapJson?.contact?.email || "contact@actl.dz",
    hours: datapJson?.contact?.hours || "Lun-Ven: 8h00-17h00"
  });

  // Vérifications des permissions
  const canEditContent = hasPermission('edit_contact') && hasPermission('edit_pages');
  const canManageMessages = hasPermission('manage_contacts');

  const handleFieldChange = (field: string, value: string) => {
    if (!canEditContent) {
      toast({
        title: "Accès interdit",
        description: "Vous n'avez pas les permissions pour éditer le contenu.",
        variant: "destructive",
      });
      return;
    }
    
    setEditedFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!canEditContent) {
      toast({
        title: "Accès interdit",
        description: "Vous n'avez pas les permissions pour sauvegarder.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Sauvegarder dans datapJson
      await updateField('datap', 'contact', editedFields);
      setIsEditing(false);
      toast({
        title: "Succès",
        description: "Les informations de contact ont été mises à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditedFields({
      title: datapJson?.contact?.title || "Contactez-nous",
      subtitle: datapJson?.contact?.subtitle || "Nous sommes là pour vous aider",
      description: datapJson?.contact?.description || "N'hésitez pas à nous contacter pour toute information.",
      address: datapJson?.contact?.address || "123 Rue de l'ACTL, Alger",
      phone: datapJson?.contact?.phone || "+213 123 456 789",
      email: datapJson?.contact?.email || "contact@actl.dz",
      hours: datapJson?.contact?.hours || "Lun-Ven: 8h00-17h00"
    });
    setIsEditing(false);
  };

  // Si aucune permission, afficher message d'accès interdit
  if (!canEditContent && !canManageMessages) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Accès Restreint</h3>
          <p className="text-gray-500">Vous n'avez pas les permissions pour accéder à cette section.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Page Contact Utilisateur</h2>
          <p className="text-gray-600">Gérez le contenu de la page contact et les messages reçus</p>
          {currentAdmin?.role === 'gestionnaire' && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600">
              <Shield className="w-4 h-4" />
              <span>Accès gestionnaire : Gestion des contacts uniquement</span>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue={canEditContent ? "content" : "messages"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {canEditContent ? (
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Édition de la page</span>
            </TabsTrigger>
          ) : (
            <TabsTrigger 
              value="content" 
              disabled 
              className="flex items-center space-x-2 opacity-50 cursor-not-allowed"
            >
              <Shield className="w-4 h-4" />
              <span>Édition (Accès restreint)</span>
            </TabsTrigger>
          )}
          
          {canManageMessages ? (
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Gestion des Contacts</span>
            </TabsTrigger>
          ) : (
            <TabsTrigger 
              value="messages" 
              disabled 
              className="flex items-center space-x-2 opacity-50 cursor-not-allowed"
            >
              <Shield className="w-4 h-4" />
              <span>Contacts (Accès restreint)</span>
            </TabsTrigger>
          )}
        </TabsList>

        {canEditContent && (
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Contenu de la page contact</CardTitle>
                  <div className="space-x-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave} size="sm">
                          Sauvegarder
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          Annuler
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => canEditContent && setIsEditing(true)} 
                        size="sm"
                        disabled={!canEditContent}
                      >
                        Modifier
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Titre principal</label>
                    <Input
                      value={editedFields.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      disabled={!isEditing || !canEditContent}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Sous-titre</label>
                    <Input
                      value={editedFields.subtitle}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      disabled={!isEditing || !canEditContent}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <Textarea
                    value={editedFields.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    disabled={!isEditing || !canEditContent}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Adresse</label>
                    <Input
                      value={editedFields.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      disabled={!isEditing || !canEditContent}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Téléphone</label>
                    <Input
                      value={editedFields.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      disabled={!isEditing || !canEditContent}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      value={editedFields.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      disabled={!isEditing || !canEditContent}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Heures d'ouverture</label>
                    <Input
                      value={editedFields.hours}
                      onChange={(e) => handleFieldChange('hours', e.target.value)}
                      disabled={!isEditing || !canEditContent}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aperçu */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu de la page</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{editedFields.title}</h3>
                  <h4 className="text-lg text-gray-700 mb-4">{editedFields.subtitle}</h4>
                  <p className="text-gray-600 mb-6">{editedFields.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm">{editedFields.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm">{editedFields.phone}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm">{editedFields.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm">{editedFields.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {!canEditContent && (
          <TabsContent value="content">
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Accès Restreint</h3>
                  <p className="text-gray-500">Vous n'avez pas les permissions pour éditer le contenu de la page.</p>
                  <p className="text-gray-400 text-sm mt-2">Contactez un administrateur pour obtenir l'accès.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canManageMessages && (
          <TabsContent value="messages">
            <ContactsManagement />
          </TabsContent>
        )}

        {!canManageMessages && (
          <TabsContent value="messages">
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Accès Restreint</h3>
                  <p className="text-gray-500">Vous n'avez pas les permissions pour gérer les contacts.</p>
                  <p className="text-gray-400 text-sm mt-2">Contactez un administrateur pour obtenir l'accès.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}; 