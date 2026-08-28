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
    pos: boolean;
    field_service: boolean;
    quality: boolean;
    ecommerce: boolean;
    assets: boolean;
    expenses: boolean;
    contracts: boolean;
    edevlet: boolean;
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
  // Auth & Profile
  userProfile: any | null;
  isLoadingAuth: boolean;
  checkSession: () => Promise<void>;
  setUserProfile: (profile: any) => void;
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
    pos: true,
    field_service: true,
    quality: true,
    ecommerce: true,
    assets: true,
    expenses: true,
    contracts: true,
    edevlet: true,
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
  companyLogo: '/logo.jpg',
  setCompanyLogo: (logo) => set({ companyLogo: logo }),
  companyName: 'NEXUS',
  setCompanyName: (name) => set({ companyName: name }),
  isAuthenticated: false,
  userProfile: null,
  isLoadingAuth: true,
  checkSession: async () => {
    const { supabase } = await import('../lib/supabase');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // Bypass RLS in case of policy recursion bugs by calling an RPC, or just log the error loudly
      const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
      
      if (error) {
        console.error("Profile fetch error:", error);
      }
      
      set({ 
        isAuthenticated: true, 
        userProfile: profile ? { ...profile, email: session.user.email } : null, 
        isLoadingAuth: false 
      });
    } else {
      set({ isAuthenticated: false, userProfile: null, isLoadingAuth: false });
    }
  },
  setUserProfile: (profile) => set({ userProfile: profile }),

  login: () => set({ isAuthenticated: true }),
  logout: () => { import('../lib/supabase').then(m => m.supabase.auth.signOut()); set({ isAuthenticated: false, userProfile: null }); }
}));
