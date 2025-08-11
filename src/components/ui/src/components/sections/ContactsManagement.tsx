import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Clock, 
  Eye, 
  Trash2, 
  Filter,
  Search,
  ArrowLeft,
  CheckCircle,
  Circle,
  RefreshCw,
  Download,
  Archive,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const ContactsManagement: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // États pour EmailJS
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Charger les messages
  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/load-messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        toast.error('Erreur lors du chargement des messages');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger au démarrage
  useEffect(() => {
    loadMessages();
  }, []);

  // Filtrage et recherche
  useEffect(() => {
    let filtered = [...messages];

    // Filtre par statut
    if (filterStatus === 'read') {
      filtered = filtered.filter(msg => msg.read);
    } else if (filterStatus === 'unread') {
      filtered = filtered.filter(msg => !msg.read);
    }

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredMessages(filtered);
  }, [messages, searchTerm, filterStatus, sortBy]);

  // Marquer comme lu
  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/mark-message-read/${messageId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );
        toast.success('Message marqué comme lu');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Supprimer un message
  const deleteMessage = async (messageId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/delete-message/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        setSelectedMessage(null);
        toast.success('Message supprimé');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Il y a quelques minutes';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)} heure${Math.floor(diffInHours) > 1 ? 's' : ''}`;
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  // Fonction pour envoyer un email via EmailJS
  const sendEmailJS = async (to: string, subject: string, body: string, originalMessage: Message) => {
    setIsSendingEmail(true);
    try {
      // Configuration EmailJS (vous devrez créer un compte sur emailjs.com)
      const templateParams = {
        to_email: to,
        from_name: 'ACTL',
        from_email: 'ACTL@site.dz',
        subject: subject,
        message: body,
        reply_to: 'ACTL@site.dz',
        original_message: originalMessage.message,
        original_sender: originalMessage.name,
        original_date: formatDate(originalMessage.timestamp)
      };

      // Simule l'envoi (vous devrez installer: npm install @emailjs/browser)
      // const result = await emailjs.send(
      //   'YOUR_SERVICE_ID',
      //   'YOUR_TEMPLATE_ID', 
      //   templateParams,
      //   'YOUR_PUBLIC_KEY'
      // );

      // Pour l'instant, on simule le succès
      console.log('Email envoyé via EmailJS:', templateParams);
      toast.success(`Email envoyé avec succès à ${to}!`);
      setShowEmailDialog(false);
      setEmailSubject('');
      setEmailBody('');
    } catch (error) {
      console.error('Erreur EmailJS:', error);
      toast.error('Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Préparer la réponse par email
  const prepareEmailReply = (message: Message) => {
    const subject = `Re: ${message.subject}`;
    const body = `Bonjour ${message.name},

Merci pour votre message concernant "${message.subject}".

[Tapez votre réponse ici]

Cordialement,
L'équipe ACTL
ACTL@site.dz
Tél: +213 XXX XXX XXX

---
Message original:
"${message.message}"
Envoyé le: ${formatDate(message.timestamp)}`;

    setEmailSubject(subject);
    setEmailBody(body);
    setShowEmailDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{messages.length}</p>
                <p className="text-blue-700 text-sm">Total Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Circle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-900">{unreadCount}</p>
                <p className="text-emerald-700 text-sm">Non lus</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">{messages.length - unreadCount}</p>
                <p className="text-purple-700 text-sm">Traités</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-900">
                  {messages.filter(msg => {
                    const today = new Date();
                    const msgDate = new Date(msg.timestamp);
                    return msgDate.toDateString() === today.toDateString();
                  }).length}
                </p>
                <p className="text-orange-700 text-sm">Aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-emerald-600" />
              <span>Filtres et Recherche</span>
            </div>
            <Button onClick={loadMessages} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans les messages..."
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les messages</SelectItem>
                <SelectItem value="unread">Non lus</SelectItem>
                <SelectItem value="read">Lus</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récents</SelectItem>
                <SelectItem value="oldest">Plus anciens</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vue principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des messages */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Messages ({filteredMessages.length})</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    {unreadCount} nouveaux
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                  <span className="ml-2 text-gray-600">Chargement...</span>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Aucun message trouvé</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {filteredMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => {
                          setSelectedMessage(message);
                          if (!message.read) {
                            markAsRead(message.id);
                          }
                        }}
                        className={`p-4 border-b cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                          selectedMessage?.id === message.id
                            ? 'bg-emerald-50 border-l-4 border-l-emerald-500'
                            : ''
                        } ${!message.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            message.read ? 'bg-gray-300' : 'bg-emerald-500 animate-pulse'
                          }`} />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-medium truncate ${
                                !message.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {message.name}
                              </h4>
                              <span className="text-xs text-gray-500 ml-2">
                                {formatDate(message.timestamp)}
                              </span>
                            </div>
                            
                            <p className={`text-sm truncate mb-1 ${
                              !message.read ? 'font-medium text-gray-800' : 'text-gray-600'
                            }`}>
                              {message.subject}
                            </p>
                            
                            <p className="text-xs text-gray-500 truncate">
                              {message.message}
                            </p>
                            
                            <div className="flex items-center mt-2 space-x-2">
                              <Badge variant="outline" className="text-xs">
                                <Mail className="w-3 h-3 mr-1" />
                                {message.email}
                              </Badge>
                              {message.phone && (
                                <Badge variant="outline" className="text-xs">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {message.phone}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Détail du message */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <Card className="h-full">
                  <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"
                        >
                          <User className="w-5 h-5" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold">{selectedMessage.name}</h3>
                          <p className="text-emerald-100 text-sm">{selectedMessage.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!selectedMessage.read && (
                          <Badge className="bg-white/20 text-white">Nouveau</Badge>
                        )}
                        <Button
                          onClick={() => setSelectedMessage(null)}
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6">
                    {/* Informations de contact */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                          <p className="font-medium">{selectedMessage.email}</p>
                        </div>
                      </div>
                      
                      {selectedMessage.phone && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Téléphone</p>
                            <p className="font-medium">{selectedMessage.phone}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Date</p>
                          <p className="font-medium">{formatDate(selectedMessage.timestamp)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Eye className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Statut</p>
                          <p className="font-medium">
                            {selectedMessage.read ? 'Lu' : 'Non lu'}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Sujet */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-emerald-600" />
                        Sujet
                      </h4>
                      <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                        <p className="font-medium text-emerald-800">{selectedMessage.subject}</p>
                      </div>
                    </motion.div>

                    {/* Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <h4 className="font-semibold text-gray-800">Message</h4>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-32">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex justify-end space-x-3 pt-4 border-t"
                    >
                      <Button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                      
                      {/* Réponse via client email local */}
                      <Button
                        onClick={() => {
                          const subject = `Re: ${selectedMessage.subject}`;
                          const body = `Bonjour ${selectedMessage.name},

Merci pour votre message concernant "${selectedMessage.subject}".

[Tapez votre réponse ici]

Cordialement,
L'équipe ACTL
ACTL@site.dz
Tél: +213 XXX XXX XXX

---
Message original:
"${selectedMessage.message}"
Envoyé le: ${formatDate(selectedMessage.timestamp)}`;
                          
                          window.open(`mailto:${selectedMessage.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                        }}
                        variant="outline"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email Client
                      </Button>

                      {/* Réponse via EmailJS (intégré) */}
                      <Button
                        onClick={() => prepareEmailReply(selectedMessage)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Répondre Direct
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-96"
              >
                <Card className="w-full h-full">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Sélectionnez un message
                      </h3>
                      <p className="text-gray-500">
                        Cliquez sur un message dans la liste pour voir ses détails
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dialog EmailJS pour composer et envoyer l'email */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Send className="w-5 h-5 mr-2 text-emerald-600" />
              Répondre par Email
            </DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              {/* Destinataire */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Destinataire</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm">
                    <span className="font-medium">{selectedMessage.name}</span>
                    <span className="text-gray-500 ml-2">({selectedMessage.email})</span>
                  </p>
                </div>
              </div>

              {/* Sujet */}
              <div>
                <Label htmlFor="email-subject" className="text-sm font-medium text-gray-700">
                  Sujet
                </Label>
                <Input
                  id="email-subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="mt-1"
                  placeholder="Sujet de votre réponse..."
                />
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="email-body" className="text-sm font-medium text-gray-700">
                  Message
                </Label>
                <Textarea
                  id="email-body"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={12}
                  className="mt-1"
                  placeholder="Votre réponse..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  onClick={() => setShowEmailDialog(false)}
                  variant="outline"
                  disabled={isSendingEmail}
                >
                  Annuler
                </Button>
                
                <Button
                  onClick={() => sendEmailJS(selectedMessage.email, emailSubject, emailBody, selectedMessage)}
                  disabled={isSendingEmail || !emailSubject.trim() || !emailBody.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSendingEmail ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer l'Email
                    </>
                  )}
                </Button>
              </div>

              {/* Note explicative */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Fonctionnalité en développement</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Cette solution est en développement car elle nécessite une vraie email professionnelle de l'ACTL. 
                      Ceci donc est juste une simulation. Si on a une EMAIL PRO, la solution marchera et l'administrateur du site pourra répondre aux contacts depuis cette interface. 
                      <br />
                      <strong>Sans email professionnelle de l'ACTL, il est impossible de réaliser cette fonctionnalité.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsManagement; 