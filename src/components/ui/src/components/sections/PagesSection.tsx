import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export const PagesSection: React.FC = () => {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Pages Internes</span>
            </CardTitle>
            <CardDescription>
              Gestion des pages internes (datap.json)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Section en cours de développement...</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

