import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, PERMISSIONS, ROLE_PERMISSIONS, UserRole } from '../../stores/authStore';
import { X, Plus, Trash2, Edit, Shield, UserCog, Key, Lock, Users, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import toast from 'react-hot-toast';

interface AdminManagementProps {
  onClose: () => void;
}

const AdminManagement: React.FC<AdminManagementProps> = ({ onClose }) => {
  const { 
    admins, 
    currentAdmin, 
    createAdmin, 
    deleteAdmin, 
    updateAdminPin,
    updateAdminRole,
    hasPermission 
  } = useAuthStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [changingPin, setChangingPin] = useState<string | null>(null);
  
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    pin: '',
    role: 'gestionnaire' as UserRole,
    permissions: ROLE_PERMISSIONS.gestionnaire
  });

  const [newPin, setNewPin] = useState('');

  // Vérifier les permissions
  if (!hasPermission(PERMISSIONS.MANAGE_ADMINS)) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4"
        >
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Accès Refusé</h2>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas les permissions nécessaires pour gérer les administrateurs.
            </p>
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleCreateAdmin = () => {
    if (!newAdmin.name || !newAdmin.pin) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (newAdmin.pin.length < 4) {
      toast.error('Le PIN doit contenir au moins 4 chiffres');
      return;
    }

    const success = createAdmin(newAdmin.name, newAdmin.pin, newAdmin.role, newAdmin.permissions);
    
    if (success) {
      toast.success('Utilisateur créé avec succès');
      setNewAdmin({
        name: '',
        pin: '',
        role: 'gestionnaire',
        permissions: ROLE_PERMISSIONS.gestionnaire
      });
      setIsCreating(false);
    } else {
      toast.error('Erreur : PIN déjà utilisé ou permissions insuffisantes');
    }
  };

  const handleDeleteAdmin = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
      const success = deleteAdmin(id);
      if (success) {
        toast.success('Utilisateur supprimé');
      } else {
        toast.error('Impossible de supprimer cet utilisateur');
      }
    }
  };

  const handleUpdatePin = (id: string) => {
    if (!newPin || newPin.length < 4) {
      toast.error('Le PIN doit contenir au moins 4 chiffres');
      return;
    }

    const success = updateAdminPin(id, newPin);
    if (success) {
      toast.success('PIN mis à jour');
      setChangingPin(null);
      setNewPin('');
    } else {
      toast.error('Erreur lors de la mise à jour du PIN');
    }
  };

  const handleUpdateRole = (id: string, role: UserRole, permissions: string[]) => {
    const success = updateAdminRole(id, role, permissions);
    if (success) {
      toast.success('Rôle et permissions mis à jour');
      setEditingId(null);
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    return role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  const getPermissionBadgeColor = (permission: string) => {
    if (permission.startsWith('edit_')) return 'bg-green-100 text-green-800';
    if (permission.startsWith('manage_')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
                <p className="text-sm text-gray-600">Administrez les comptes et permissions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Bouton Créer */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Utilisateurs ({admins.length})</h3>
              <p className="text-sm text-gray-600">Gérez les comptes administrateurs et gestionnaires</p>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Utilisateur
            </Button>
          </div>

          {/* Formulaire de création */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-emerald-200 bg-emerald-50">
                  <CardHeader>
                    <CardTitle className="text-emerald-800 flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      Créer un nouvel utilisateur
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet *
                        </label>
                        <Input
                          value={newAdmin.name}
                          onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                          placeholder="Nom de l'utilisateur"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PIN (4+ chiffres) *
                        </label>
                        <Input
                          type="password"
                          value={newAdmin.pin}
                          onChange={(e) => setNewAdmin({ ...newAdmin, pin: e.target.value })}
                          placeholder="PIN de connexion"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rôle
                      </label>
                      <Select
                        value={newAdmin.role}
                        onValueChange={(value: UserRole) => {
                          const permissions = ROLE_PERMISSIONS[value];
                          setNewAdmin({ ...newAdmin, role: value, permissions });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur (Accès complet)</SelectItem>
                          <SelectItem value="gestionnaire">Gestionnaire (Accès limité)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Permissions personnalisées */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Permissions ({newAdmin.permissions.length})
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                        {Object.entries(PERMISSIONS).map(([key, permission]) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission}
                              checked={newAdmin.permissions.includes(permission)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewAdmin({
                                    ...newAdmin,
                                    permissions: [...newAdmin.permissions, permission]
                                  });
                                } else {
                                  setNewAdmin({
                                    ...newAdmin,
                                    permissions: newAdmin.permissions.filter(p => p !== permission)
                                  });
                                }
                              }}
                            />
                            <label htmlFor={permission} className="text-xs text-gray-600">
                              {key.replace('_', ' ').toLowerCase()}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setIsCreating(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleCreateAdmin} className="bg-emerald-600 hover:bg-emerald-700">
                        Créer l'utilisateur
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Liste des admins */}
          <div className="space-y-4">
            {admins.map((admin) => (
              <Card key={admin.id} className="border-gray-200 hover:border-gray-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        admin.role === 'admin' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {admin.role === 'admin' ? (
                          <Shield className={`w-6 h-6 ${admin.role === 'admin' ? 'text-red-600' : 'text-blue-600'}`} />
                        ) : (
                          <UserCog className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                          <span>{admin.name}</span>
                          {admin.id === currentAdmin?.id && (
                            <Badge variant="outline" className="text-xs">Vous</Badge>
                          )}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleBadgeColor(admin.role)}>
                            {admin.role === 'admin' ? 'Administrateur' : 'Gestionnaire'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {admin.permissions.length} permissions
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {admin.permissions.slice(0, 3).map((permission) => (
                            <Badge
                              key={permission}
                              variant="outline"
                              className={`text-xs ${getPermissionBadgeColor(permission)}`}
                            >
                              {permission.replace('_', ' ')}
                            </Badge>
                          ))}
                          {admin.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                              +{admin.permissions.length - 3} autres
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Changer PIN */}
                      {(admin.id === currentAdmin?.id || hasPermission(PERMISSIONS.MANAGE_ADMINS)) && (
                        <>
                          {changingPin === admin.id ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="password"
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value)}
                                placeholder="Nouveau PIN"
                                className="w-32"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleUpdatePin(admin.id)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                OK
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setChangingPin(null);
                                  setNewPin('');
                                }}
                              >
                                ✕
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setChangingPin(admin.id)}
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      )}

                      {/* Éditer rôle (seulement pour les autres admins) */}
                      {hasPermission(PERMISSIONS.MANAGE_ADMINS) && admin.id !== currentAdmin?.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(editingId === admin.id ? null : admin.id)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Supprimer */}
                      {hasPermission(PERMISSIONS.MANAGE_ADMINS) && admin.id !== currentAdmin?.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Édition des permissions */}
                  <AnimatePresence>
                    {editingId === admin.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <EditPermissions
                          admin={admin}
                          onSave={(role, permissions) => {
                            handleUpdateRole(admin.id, role, permissions);
                          }}
                          onCancel={() => setEditingId(null)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Composant d'édition des permissions
const EditPermissions: React.FC<{
  admin: any;
  onSave: (role: UserRole, permissions: string[]) => void;
  onCancel: () => void;
}> = ({ admin, onSave, onCancel }) => {
  const [role, setRole] = useState<UserRole>(admin.role);
  const [permissions, setPermissions] = useState<string[]>(admin.permissions);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
        <Select
          value={role}
          onValueChange={(value: UserRole) => {
            setRole(value);
            setPermissions(ROLE_PERMISSIONS[value]);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="gestionnaire">Gestionnaire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Permissions ({permissions.length})
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
          {Object.entries(PERMISSIONS).map(([key, permission]) => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox
                id={`edit-${permission}`}
                checked={permissions.includes(permission)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPermissions([...permissions, permission]);
                  } else {
                    setPermissions(permissions.filter(p => p !== permission));
                  }
                }}
              />
              <label htmlFor={`edit-${permission}`} className="text-xs text-gray-600">
                {key.replace('_', ' ').toLowerCase()}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={() => onSave(role, permissions)} className="bg-emerald-600 hover:bg-emerald-700">
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default AdminManagement; 