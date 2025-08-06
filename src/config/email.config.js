// Configuration des services d'email
// Pour activer EmailJS, décommentez et configurez avec vos identifiants

export const EMAIL_CONFIG = {
  // 🚀 EMAILJS (Recommandé - Gratuit 200 emails/mois)
  emailjs: {
    enabled: false, // Changer à true après configuration
    serviceId: 'YOUR_SERVICE_ID',       // Ex: service_abc123
    templateId: 'YOUR_TEMPLATE_ID',     // Ex: template_xyz789  
    publicKey: 'YOUR_PUBLIC_KEY',       // Ex: user_123abc456
    
    // Template variables disponibles :
    // {{to_email}}, {{from_name}}, {{from_email}}, {{subject}}, {{message}}
    // {{reply_to}}, {{original_message}}, {{original_sender}}, {{original_date}}
  },

  // 📨 FORMSPREE (Alternative simple)
  formspree: {
    enabled: false,
    formId: 'YOUR_FORM_ID',            // Ex: xpzgkqbo
    endpoint: 'https://formspree.io/f/YOUR_FORM_ID'
  },

  // 🔧 NODEMAILER (Backend - Configuration server.cjs)
  nodemailer: {
    enabled: false,
    endpoint: '/api/send-email'
  },

  // 📧 Configuration générale
  general: {
    fromName: 'ACTL',
    fromEmail: 'ACTL@site.dz',
    replyTo: 'ACTL@site.dz',
    signature: `
Cordialement,
L'équipe ACTL
ACTL@site.dz
Tél: +213 XXX XXX XXX
    `.trim()
  }
};

// 🚀 Instructions de configuration rapide EmailJS :
/*
1. Créer compte sur https://emailjs.com
2. Add Service: Gmail/Outlook/Yahoo
3. Create Template avec ce contenu :

Subject: {{subject}}
Body:
Bonjour {{to_name}},

{{message}}

{{signature}}

---
Message original de {{original_sender}}:
"{{original_message}}"
Envoyé le: {{original_date}}

4. Copier les IDs dans cette config
5. Changer enabled: true
6. npm install @emailjs/browser
7. Import emailjs dans ContactsManagement.tsx
*/ 