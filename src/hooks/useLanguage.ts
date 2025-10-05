import { useState, useEffect } from 'react';

const translations = {
  en: {
    hero: {
      title: 'TradeMate - Your Digital Partner for MSMEs',
      subtitle:
        'Manage inventory, track payments, and grow your business with our simple, multilingual platform designed for small businesses.',
      cta: 'Get Started Free',
      login: 'Login',
    },
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      inventory: 'Inventory',
      customers: 'Customers',
      payments: 'Payments',
      orders: 'Orders',
      reports: 'Reports',
      analytics: 'Analytics',
      notifications: 'Notifications',
      settings: 'Settings',
      help: 'Help & Support',
      main: 'Main Navigation',
      business: 'Business Tools',
      other: 'Other',
      tagline: 'Your Digital Partner',
      version: 'Version',
      back: 'Back',
      logout: 'Logout',
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome to TradeMate',
      todaySales: "Today's Sales",
      totalCustomers: 'Total Customers',
      lowStock: 'Low Stock Items',
      recentTransactions: 'Recent Transactions',
    },
    common: {
      search: 'Search',
      cancel: 'Cancel',
      save: 'Save',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      update: 'Update',
    },
    inventory: {
      title: 'Inventory Management',
      addProduct: 'Add Product',
      productName: 'Product Name',
      quantity: 'Quantity',
      price: 'Price',
      category: 'Category',
      stock: 'Stock',
    },
    customers: {
      title: 'Customer Management',
      addCustomer: 'Add Customer',
      customerName: 'Customer Name',
      name: 'Customer Name',
      phone: 'Phone',
      email: 'Email',
      totalSpent: 'Total Spent',
      visits: 'Visits',
    },
    payments: {
      title: 'Payment Tracking',
      addTransaction: 'Add Transaction',
      addPayment: 'Add Payment',
      amount: 'Amount',
      type: 'Type',
      method: 'Method',
      description: 'Description',
      cash: 'Cash',
      digital: 'Digital',
      upi: 'UPI',
      card: 'Card',
      income: 'Income',
      expense: 'Expense',
    },
    home: {
      welcome: 'Welcome to TradeMate',
      subtitle: 'Your complete business management solution',
      quickActions: 'Quick Actions',
      businessOverview: 'Business Overview',
      recentActivity: 'Recent Activity',
      notifications: 'Notifications',
      shortcuts: 'Shortcuts',
      todayStats: "Today's Statistics",
      salesTarget: 'Monthly Sales Target',
      customerSatisfaction: 'Customer Satisfaction',
      inventory: {
        title: 'Inventory Summary',
        totalProducts: 'Total Products',
        outOfStock: 'Out of Stock',
        lowStock: 'Low Stock',
      },
      quickStart: {
        title: 'Quick Start Guide',
        step1: 'Add your products to inventory',
        step2: 'Register your customers',
        step3: 'Start recording transactions',
        step4: 'Monitor your business growth',
      },
    },
  },
  hi: {
    hero: {
      title: 'ट्रेडमेट - MSMEs के लिए आपका डिजिटल साझीदार',
      subtitle:
        'इन्वेंट्री प्रबंधन, पेमेंट ट्रैकिंग, और छोटे व्यवसायों के लिए डिज़ाइन किए गए हमारे सरल, बहुभाषी प्लेटफॉर्म के साथ अपना व्यवसाय बढ़ाएं।',
      cta: 'मुफ़्त में शुरू करें',
      login: 'लॉग इन',
    },
    nav: {
      home: 'होम',
      dashboard: 'डैशबोर्ड',
      inventory: 'इन्वेंट्री',
      customers: 'ग्राहक',
      payments: 'भुगतान',
      orders: 'ऑर्डर',
      reports: 'रिपोर्ट',
      analytics: 'विश्लेषण',
      notifications: 'सूचनाएं',
      settings: 'सेटिंग्स',
      help: 'सहायता और सपोर्ट',
      main: 'मुख्य नेवीगेशन',
      business: 'व्यवसाय उपकरण',
      other: 'अन्य',
      tagline: 'आपका डिजिटल साझीदार',
      version: 'संस्करण',
      back: 'वापस',
      logout: 'लॉगआउट',
    },
    dashboard: {
      title: 'डैशबोर्ड',
      welcome: 'ट्रेडमेट में आपका स्वागत है',
      todaySales: 'आज की बिक्री',
      totalCustomers: 'कुल ग्राहक',
      lowStock: 'कम स्टॉक आइटम',
      recentTransactions: 'हाल के लेनदेन',
    },
    common: {
      search: 'खोजें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      actions: 'कार्य',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      update: 'अपडेट करें',
    },
    inventory: {
      title: 'इन्वेंट्री प्रबंधन',
      addProduct: 'उत्पाद जोड़ें',
      productName: 'उत्पाद का नाम',
      quantity: 'मात्रा',
      price: 'मूल्य',
      category: 'श्रेणी',
      stock: 'स्टॉक',
    },
    customers: {
      title: 'ग्राहक प्रबंधन',
      addCustomer: 'ग्राहक जोड़ें',
      customerName: 'ग्राहक का नाम',
      name: 'ग्राहक का नाम',
      phone: 'फोन',
      email: 'ईमेल',
      totalSpent: 'कुल खर्च',
      visits: 'विज़िट',
    },
    payments: {
      title: 'भुगतान ट्रैकिंग',
      addTransaction: 'लेनदेन जोड़ें',
      addPayment: 'भुगतान जोड़ें',
      amount: 'राशि',
      type: 'प्रकार',
      method: 'तरीका',
      description: 'विवरण',
      cash: 'नकद',
      digital: 'डिजिटल',
      upi: 'UPI',
      card: 'कार्ड',
      income: 'आय',
      expense: 'व्यय',
    },
    home: {
      welcome: 'ट्रेडमेट में आपका स्वागत है',
      subtitle: 'आपका पूर्ण व्यवसाय प्रबंधन समाधान',
      quickActions: 'त्वरित कार्य',
      businessOverview: 'व्यवसाय अवलोकन',
      recentActivity: 'हाल की गतिविधि',
      notifications: 'सूचनाएं',
      shortcuts: 'शॉर्टकट्स',
      todayStats: 'आज के आंकड़े',
      salesTarget: 'मासिक बिक्री लक्ष्य',
      customerSatisfaction: 'ग्राहक संतुष्टि',
      inventory: {
        title: 'इन्वेंट्री सारांश',
        totalProducts: 'कुल उत्पाद',
        outOfStock: 'स्टॉक खत्म',
        lowStock: 'कम स्टॉक',
      },
      quickStart: {
        title: 'त्वरित शुरुआत गाइड',
        step1: 'अपने उत्पादों को इन्वेंट्री में जोड़ें',
        step2: 'अपने ग्राहकों को पंजीकृत करें',
        step3: 'लेनदेन रिकॉर्ड करना शुरू करें',
        step4: 'अपने व्यवसाय की वृद्धि की निगरानी करें',
      },
    },
  },
};

type LanguageHookType = {
  language: 'en' | 'hi';
  setLanguage: (l: 'en' | 'hi') => void;
  t: (key: string) => string;
};

export const useLanguage = (): LanguageHookType => {
  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    try {
      const saved = localStorage.getItem('trademate-language');
      return (saved as 'en' | 'hi') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('trademate-language', language);
    } catch (e) {
      // ignore
    }
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[language as 'en' | 'hi'];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? (value as string) : key;
  };

  return { language, setLanguage, t };
};
