/**
 * Internationalization (i18n) Service
 * Supports multiple languages with translation files
 */

const translations = {
  en: {
    // Common
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    employees: 'Employees',
    payroll: 'Payroll',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    
    // Navigation
    home: 'Home',
    services: 'Services',
    team: 'Team',
    contact: 'Contact',
    resources: 'Resources',
    templates: 'Templates',
    help: 'Help',
    
    // HR Platform
    hrPlatform: 'HR Platform',
    employeeManagement: 'Employee Management',
    recruitment: 'Recruitment',
    leaveManagement: 'Leave Management',
    performanceReviews: 'Performance Reviews',
    compliance: 'Compliance',
    analytics: 'Analytics',
    
    // Employee Portal
    myProfile: 'My Profile',
    myPayslips: 'My Payslips',
    myLeave: 'My Leave',
    myPerformance: 'My Performance',
    
    // Forms
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    department: 'Department',
    position: 'Position',
    salary: 'Salary',
    startDate: 'Start Date',
    status: 'Status',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    
    // Messages
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    loading: 'Loading...',
    noData: 'No data available',
    
    // Actions
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    submit: 'Submit',
    reset: 'Reset'
  },
  
  fr: {
    // Common
    welcome: 'Bienvenue',
    dashboard: 'Tableau de bord',
    employees: 'Employés',
    payroll: 'Paie',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    login: 'Connexion',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    create: 'Créer',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    
    // Navigation
    home: 'Accueil',
    services: 'Services',
    team: 'Équipe',
    contact: 'Contact',
    resources: 'Ressources',
    templates: 'Modèles',
    help: 'Aide',
    
    // HR Platform
    hrPlatform: 'Plateforme RH',
    employeeManagement: 'Gestion des employés',
    recruitment: 'Recrutement',
    leaveManagement: 'Gestion des congés',
    performanceReviews: 'Évaluations de performance',
    compliance: 'Conformité',
    analytics: 'Analyses',
    
    // Employee Portal
    myProfile: 'Mon profil',
    myPayslips: 'Mes fiches de paie',
    myLeave: 'Mes congés',
    myPerformance: 'Ma performance',
    
    // Forms
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    department: 'Département',
    position: 'Poste',
    salary: 'Salaire',
    startDate: 'Date de début',
    status: 'Statut',
    
    // Status
    active: 'Actif',
    inactive: 'Inactif',
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    
    // Messages
    success: 'Succès',
    error: 'Erreur',
    warning: 'Avertissement',
    info: 'Information',
    loading: 'Chargement...',
    noData: 'Aucune donnée disponible',
    
    // Actions
    view: 'Voir',
    download: 'Télécharger',
    upload: 'Téléverser',
    submit: 'Soumettre',
    reset: 'Réinitialiser'
  },
  
  ib: {
    // Common
    welcome: 'Nnoo',
    dashboard: 'Dashboard',
    employees: 'Ndito',
    payroll: 'Ego ndito',
    settings: 'Ntọọp',
    logout: 'Sop',
    login: 'Kọọp',
    save: 'Kpọp',
    cancel: 'Kpọp',
    delete: 'Kpọp',
    edit: 'Kpọp',
    create: 'Kpọp',
    search: 'Kpọp',
    filter: 'Kpọp',
    export: 'Kpọp',
    import: 'Kpọp',
    
    // Navigation
    home: 'Ufọk',
    services: 'Ntọọp',
    team: 'Ndito',
    contact: 'Kpọp',
    resources: 'Ntọọp',
    templates: 'Ntọọp',
    help: 'Kpọp',
    
    // HR Platform
    hrPlatform: 'Ntọọp HR',
    employeeManagement: 'Kpọp ndito',
    recruitment: 'Kpọp',
    leaveManagement: 'Kpọp',
    performanceReviews: 'Kpọp',
    compliance: 'Kpọp',
    analytics: 'Kpọp',
    
    // Employee Portal
    myProfile: 'Ntọọp mi',
    myPayslips: 'Ego mi',
    myLeave: 'Kpọp mi',
    myPerformance: 'Kpọp mi',
    
    // Forms
    name: 'Enyin',
    email: 'Email',
    phone: 'Foon',
    department: 'Ntọọp',
    position: 'Ntọọp',
    salary: 'Ego',
    startDate: 'Usen',
    status: 'Ntọọp',
    
    // Status
    active: 'Ntọọp',
    inactive: 'Kpọp',
    pending: 'Kpọp',
    approved: 'Kpọp',
    rejected: 'Kpọp',
    
    // Messages
    success: 'Kpọp',
    error: 'Kpọp',
    warning: 'Kpọp',
    info: 'Kpọp',
    loading: 'Kpọp...',
    noData: 'Kpọp',
    
    // Actions
    view: 'Kpọp',
    download: 'Kpọp',
    upload: 'Kpọp',
    submit: 'Kpọp',
    reset: 'Kpọp'
  }
};

class I18nService {
  constructor() {
    this.currentLanguage = typeof window !== 'undefined' 
      ? localStorage.getItem('language') || 'en'
      : 'en';
    this.translations = translations;
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
      
      // Set RTL for Arabic
      if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English
        value = this.translations.en;
        for (const k2 of keys) {
          value = value?.[k2];
        }
        break;
      }
    }
    
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }
    
    return value || key;
  }

  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return new Date(date).toLocaleDateString(this.currentLanguage, {
      ...defaultOptions,
      ...options
    });
  }

  formatCurrency(amount, currency = 'NGN') {
    return new Intl.NumberFormat(this.currentLanguage, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatNumber(number) {
    return new Intl.NumberFormat(this.currentLanguage).format(number);
  }
}

// Create singleton instance
const i18n = typeof window !== 'undefined' 
  ? new I18nService()
  : { t: (key) => key, setLanguage: () => {}, getLanguage: () => 'en' };

module.exports = i18n;

