import { create } from 'zustand';

export type DrawerType = 'NONE' | 'NEW_CONTACT' | 'NEW_INVOICE' | 'NEW_DEPOT_TRANSFER' | 'NEW_PURCHASE' | 'NEW_INVENTORY' | 'PROFILE' | 'SETTINGS' | 'CHANGELOG';
export type ThemeColor = string;
export type CurrencyType = 'TRY' | 'USD' | 'EUR';
export type ThemeMode = 'dark' | 'light' | 'system';

interface UIState {
  activeDrawer: DrawerType;
  editingId: number | null;
  openDrawer: (drawer: DrawerType, id?: number) => void;
  closeDrawer: () => void;
  
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  density: 'normal' | 'compact';
  setDensity: (density: 'normal' | 'compact') => void;
  
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;

  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;

  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;

  dashboardWidgets: {
    kpiCards: boolean;
    revenueChart: boolean;
    stockAlerts: boolean;
    recentTransactions: boolean;
  };
  toggleWidget: (widget: keyof UIState['dashboardWidgets']) => void;

  activeModules: {
    sales: boolean;
    purchase: boolean;
    inventory: boolean;
    depot: boolean;
    finance: boolean;
    invoice: boolean;
    contacts: boolean;
    hr: boolean;
    manufacturing: boolean;
    reports: boolean;
    projects: boolean;
    b2b: boolean;
    logistics: boolean;
    banking: boolean;
    tickets: boolean;
    subscriptions: boolean;
    marketing: boolean;
    fleet: boolean;
  };
  toggleModule: (moduleKey: keyof UIState['activeModules']) => void;

  moduleSortPreference: 'default' | 'name' | 'recent';
  setModuleSortPreference: (pref: 'default' | 'name' | 'recent') => void;
  
  favoriteModules: string[];
  toggleFavoriteModule: (moduleKey: string) => void;
  
  moduleUsageStats: Record<string, number>;
  trackModuleUsage: (moduleKey: string) => void;

  companyLogo: string | null;
  setCompanyLogo: (logo: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeDrawer: 'NONE',
  editingId: null,
  openDrawer: (drawer, id = null) => set({ activeDrawer: drawer, editingId: id }),
  closeDrawer: () => set({ activeDrawer: 'NONE', editingId: null }),
  
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  themeMode: 'dark',
  setThemeMode: (themeMode) => set({ themeMode }),

  density: 'normal',
  setDensity: (density) => set({ density }),
  
  themeColor: 'blue',
  setThemeColor: (themeColor) => set({ themeColor }),

  currency: 'TRY',
  setCurrency: (currency) => set({ currency }),

  soundEnabled: true,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),

  dashboardWidgets: {
    kpiCards: true,
    revenueChart: true,
    stockAlerts: true,
    recentTransactions: true
  },
  toggleWidget: (widget) => set((state) => ({
    dashboardWidgets: {
      ...state.dashboardWidgets,
      [widget]: !state.dashboardWidgets[widget]
    }
  })),

  activeModules: {
    sales: true,
    purchase: true,
    inventory: true,
    depot: true,
    finance: true,
    invoice: true,
    contacts: true,
    hr: false,
    manufacturing: false,
    reports: true,
    projects: false,
    b2b: false,
    logistics: false,
    banking: false,
    tickets: false,
    subscriptions: false,
    marketing: false,
    fleet: false,
  },
  toggleModule: (moduleKey) => set((state) => ({
    activeModules: {
      ...state.activeModules,
      [moduleKey]: !state.activeModules[moduleKey]
    }
  })),

  moduleSortPreference: 'default',
  setModuleSortPreference: (pref) => set({ moduleSortPreference: pref }),

  favoriteModules: [],
  toggleFavoriteModule: (moduleKey) => set((state) => ({
    favoriteModules: state.favoriteModules.includes(moduleKey)
      ? state.favoriteModules.filter(k => k !== moduleKey)
      : [...state.favoriteModules, moduleKey]
  })),

  moduleUsageStats: {},
  trackModuleUsage: (moduleKey) => set((state) => ({
    moduleUsageStats: {
      ...state.moduleUsageStats,
      [moduleKey]: Date.now()
    }
  })),
  companyLogo: null,
  setCompanyLogo: (logo) => set({ companyLogo: logo }),
  companyName: 'Nexus Yazılım A.Ş.',
  setCompanyName: (name) => set({ companyName: name }),
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false })
}));
