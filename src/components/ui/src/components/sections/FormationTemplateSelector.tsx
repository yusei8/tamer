import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Wrench, Briefcase, Settings, CarFront, Wallet, GraduationCap, Users } from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';

// Templates disponibles basés sur les vraies pages de formations
const FORMATION_TEMPLATES = [
  {
    id: 'mecanique',
    name: 'Formation Mécanique Automobile',
    description: 'Template basé sur la page de formation mécanique automobile complète',
    icon: Wrench,
    color: 'from-emerald-500 to-teal-600',
    previewKey: 'mecaniqueFormation',
    componentName: 'MecaniqueFormation'
  },
  {
    id: 'commerce',
    name: 'Formation Commerce & Marketing', 
    description: 'Template basé sur la page de formation commerce et marketing',
    icon: Briefcase,
    color: 'from-blue-500 to-indigo-600',
    previewKey: 'commerceFormation',
    componentName: 'CommerceFormation'
  },
  {
    id: 'diagnostic',
    name: 'Formation Diagnostic Automobile',
    description: 'Template basé sur la page de diagnostic automobile',
    icon: Settings,
    color: 'from-purple-500 to-pink-600',
    previewKey: 'diagnosticFormation',
    componentName: 'DiagnosticFormation'
  },
  {
    id: 'conduite',
    name: 'Formation Brevet Professionnel',
    description: 'Template basé sur la page de formation brevet professionnel',
    icon: CarFront,
    color: 'from-orange-500 to-red-600',
    previewKey: 'conduiteFormation',
    componentName: 'ConduiteFormation'
  },
  {
    id: 'finance',
    name: 'Formation Comptabilité & Finance',
    description: 'Template basé sur la page de formation finance',
    icon: Wallet,
    color: 'from-green-500 to-emerald-600',
    previewKey: 'financeFormation',
    componentName: 'FinanceFormation'
  },
  {
    id: 'rh',
    name: 'Formation Ressources Humaines',
    description: 'Template basé sur la page de formation RH',
    icon: Users,
    color: 'from-violet-500 to-purple-600',
    previewKey: 'rhFormation',
    componentName: 'RHFormation'
  }
];

interface FormationTemplateSelectorProps {
  pageEditData: any;
  handlePageEditChange: (field: string, value: any) => void;
  onTemplateSelected: (template: any) => void;
}

export const FormationTemplateSelector: React.FC<FormationTemplateSelectorProps> = ({
  pageEditData,
  handlePageEditChange,
  onTemplateSelected
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { datapJson } = useDashboardStore();

  const handleSelectTemplate = (template: typeof FORMATION_TEMPLATES[0]) => {
    setSelectedTemplate(template.id);
    
    // Copier les données du template sélectionné
    const templateData = datapJson[template.previewKey];
    if (templateData) {
      // Créer une copie de la formation avec l'ID actuel
      const newFormationKey = `${pageEditData.id}Formation`;
      
      // Copier toute la structure du template
      const clonedData = {
        ...templateData,
        title: pageEditData.title,
        description: pageEditData.description,
        image: pageEditData.image || templateData.image
      };
      
      onTemplateSelected({
        template,
        clonedData,
        formationKey: newFormationKey
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choisir un template de formation
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Sélectionnez un template basé sur nos pages de formations existantes. 
          Vous pourrez ensuite personnaliser entièrement le contenu selon vos besoins.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FORMATION_TEMPLATES.map((template) => {
          const IconComponent = template.icon;
          const isSelected = selectedTemplate === template.id;
          const templateData = datapJson[template.previewKey];
          
          return (
            <Card 
              key={template.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                isSelected ? 'ring-2 ring-emerald-500 shadow-xl' : ''
              }`}
              onClick={() => handleSelectTemplate(template)}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${template.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  {templateData && (
                    <div className="mb-4">
                      <Badge variant="secondary" className="mb-2">
                        Aperçu du contenu
                      </Badge>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• {templateData.programStructure?.length || 0} éléments de programme</p>
                        <p>• {templateData.courseContent?.length || 0} contenus de cours</p>
                        <p>• {templateData.careerOpportunities?.length || 0} débouchés</p>
                      </div>
                    </div>
                  )}

                  <Button 
                    className={`w-full ${
                      isSelected 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : `bg-gradient-to-r ${template.color} hover:opacity-90`
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template);
                    }}
                  >
                    {isSelected ? 'Sélectionné ✓' : 'Utiliser ce template'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedTemplate && (
        <div className="mt-12 text-center">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">
              Template sélectionné !
            </h3>
            <p className="text-emerald-700">
              Le template a été copié. Vous pouvez maintenant personnaliser tous les éléments de la formation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};