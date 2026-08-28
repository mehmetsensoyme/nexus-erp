import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, ArrowRightLeft, FileText, Command, Menu, Package, Handshake, WalletCards, Factory, UserSquare2, PieChart, Briefcase, Globe, Truck, Building2, Ticket, Repeat, Megaphone, Wrench, Star, MonitorSmartphone, FileCheck, ShoppingBag, Archive, Receipt, FileSignature, Landmark } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/useUIStore';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, activeModules, favoriteModules, moduleSortPreference, moduleUsageStats, trackModuleUsage, companyLogo, companyName } = useUIStore();

  // Dinamik Modül Listesi (Store'daki activeModules ile 100% senkronize)
  const allItems = [
    { key: 'dashboard', path: '/ana-ekran', name: 'Ana Ekran', icon: LayoutDashboard, show: true, group: 'none' },
    
    // Temel Ticari
    { key: 'sales', path: '/satis', name: 'Teklif & Sipariş', icon: Handshake, show: activeModules?.sales, group: 'Ticari' },
    { key: 'purchase', path: '/satinalma', name: 'Satınalma', icon: ShoppingCart, show: activeModules?.purchase, group: 'Ticari' },
    { key: 'contacts', path: '/cari', name: 'Cari Kartlar', icon: Users, show: activeModules?.contacts, group: 'Ticari' },
    { key: 'inventory', path: '/stoklar', name: 'Stoklar', icon: Package, show: activeModules?.inventory, group: 'Ticari' },
    { key: 'depot', path: '/depo', name: 'Depo İşlemleri', icon: ArrowRightLeft, show: activeModules?.depot, group: 'Ticari' },
    
    // Finans & e-Dönüşüm
    { key: 'invoice', path: '/fatura', name: 'Fatura (e-Belge)', icon: FileText, show: activeModules?.invoice, group: 'Finans' },
    { key: 'finance', path: '/finans', name: 'Finans & Kasa', icon: WalletCards, show: activeModules?.finance, group: 'Finans' },
    { key: 'edevlet', path: '/edevlet', name: 'e-Devlet İşlemleri', icon: Landmark, show: activeModules?.edevlet, group: 'Finans' },
    { key: 'expenses', path: '/expenses', name: 'Masraf Yönetimi', icon: Receipt, show: activeModules?.expenses, group: 'Finans' },
    { key: 'banking', path: '/bankacilik', name: 'Açık Bankacılık', icon: Building2, show: activeModules?.banking, group: 'Finans' },
    { key: 'contracts', path: '/contracts', name: 'Sözleşmeler', icon: FileSignature, show: activeModules?.contracts, group: 'Finans' },

    // Operasyon & Üretim
    { key: 'manufacturing', path: '/uretim', name: 'Üretim & Reçete', icon: Factory, show: activeModules?.manufacturing, group: 'Operasyon' },
    { key: 'quality', path: '/quality', name: 'Kalite Kontrol', icon: FileCheck, show: activeModules?.quality, group: 'Operasyon' },
    { key: 'fleet', path: '/ikmal', name: 'Araç & Makine İkmal', icon: Truck, show: activeModules?.fleet, group: 'Operasyon' },
    { key: 'assets', path: '/assets', name: 'Demirbaş & Zimmet', icon: Archive, show: activeModules?.assets, group: 'Operasyon' },
    { key: 'logistics', path: '/kargo', name: 'Kargo & Lojistik', icon: Truck, show: activeModules?.logistics, group: 'Operasyon' },
    
    // Saha & Perakende
    { key: 'pos', path: '/pos', name: 'Hızlı Satış (POS)', icon: MonitorSmartphone, show: activeModules?.pos, group: 'Perakende' },
    { key: 'ecommerce', path: '/ecommerce', name: 'E-Ticaret', icon: ShoppingBag, show: activeModules?.ecommerce, group: 'Perakende' },
    { key: 'field_service', path: '/field-service', name: 'Saha Servis', icon: Wrench, show: activeModules?.field_service, group: 'Perakende' },
    { key: 'b2b', path: '/b2b', name: 'B2B Bayi Portalı', icon: Globe, show: activeModules?.b2b, group: 'Perakende' },
    
    // Kurumsal & Yönetim
    { key: 'projects', path: '/projeler', name: 'Görev & Proje', icon: Briefcase, show: activeModules?.projects, group: 'Kurumsal' },
    { key: 'hr', path: '/ik', name: 'İnsan Kaynakları', icon: UserSquare2, show: activeModules?.hr, group: 'Kurumsal' },
    { key: 'tickets', path: '/destek', name: 'Destek & Ticket', icon: Ticket, show: activeModules?.tickets, group: 'Kurumsal' },
    { key: 'subscriptions', path: '/abonelik', name: 'Abonelik Yönetimi', icon: Repeat, show: activeModules?.subscriptions, group: 'Kurumsal' },
    { key: 'marketing', path: '/pazarlama', name: 'Pazarlama', icon: Megaphone, show: activeModules?.marketing, group: 'Kurumsal' },
    { key: 'reports', path: '/raporlar', name: 'Gelişmiş Raporlar', icon: PieChart, show: activeModules?.reports, group: 'Kurumsal' },
  ].filter(item => item.show);

  const dashboardItem = allItems.find(i => i.key === 'dashboard');
  const restItems = allItems.filter(i => i.key !== 'dashboard');

  const favorites = restItems.filter(i => favoriteModules.includes(i.key));
  let others = restItems.filter(i => !favoriteModules.includes(i.key));

  if (moduleSortPreference === 'name') {
    others.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  } else if (moduleSortPreference === 'recent') {
    others.sort((a, b) => (moduleUsageStats[b.key] || 0) - (moduleUsageStats[a.key] || 0));
  }

  const renderNav = (items: typeof allItems) => {
    return items.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={() => trackModuleUsage(item.key)}
        title={!isSidebarOpen ? item.name : undefined}
        className={({ isActive }) =>
          cn(
            "flex items-center justify-between rounded-lg transition-all duration-200 text-sm font-medium mx-3 group",
            isSidebarOpen ? "px-3 py-2.5" : "justify-center p-2.5",
            isActive 
              ? "bg-blue-500/10 text-blue-500 font-semibold" 
              : "hover:bg-[#27272a] hover:text-white text-[#94a3b8]"
          )
        }
      >
        <div className="flex items-center gap-3 truncate">
          <item.icon size={18} className="shrink-0" />
          {isSidebarOpen && <span className="truncate">{item.name}</span>}
        </div>
      </NavLink>
    ));
  };
  
  // Group the remaining active modules dynamically
  const groupedModules = restItems.reduce((acc, curr) => {
    const g = curr.group || 'Diğer';
    if (!acc[g]) acc[g] = [];
    acc[g].push(curr);
    return acc;
  }, {} as Record<string, typeof allItems>);
  

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
      <aside className={cn(
        "bg-[#0a0a0a] border-r border-[#27272a] flex flex-col shrink-0 transition-all duration-300 fixed md:relative inset-y-0 left-0 z-40 h-full", 
        isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
      )}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#27272a]">
        {isSidebarOpen ? (
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-2.5 text-white hover:opacity-80 transition-opacity">
              {companyLogo ? (
                <img src={companyLogo} alt="Logo" className="w-7 h-7 rounded-lg object-contain bg-[#141414] border border-[#27272a] shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                  <Command size={16} className="text-white" />
                </div>
              )}
              <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-[#94a3b8] truncate max-w-[120px]">
                {companyName || 'Nexus'}
              </span>
            </Link>
            <button onClick={toggleSidebar} className="text-[#52525b] hover:text-white transition-colors shrink-0 p-1 rounded-md hover:bg-[#27272a]">
              <Menu size={18} />
            </button>
          </div>
        ) : (
          <button onClick={toggleSidebar} className="mx-auto flex items-center justify-center hover:opacity-80 transition-opacity" title="Menüyü Genişlet">
            {companyLogo ? (
              <img src={companyLogo} alt="Logo" className="w-8 h-8 rounded-xl object-contain bg-[#141414] border border-[#27272a]" />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Command size={16} className="text-white" />
              </div>
            )}
          </button>
        )}
      </div>
      <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {dashboardItem && renderNav([dashboardItem])}
        
        {favorites.length > 0 && (
          <div className="mt-4 mb-2">
            {isSidebarOpen && <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider px-4 flex items-center gap-1 mb-2"><Star size={12} fill="currentColor"/> Sık Kullanılanlar</div>}
            <div className="space-y-1.5">{renderNav(favorites)}</div>
          </div>
        )}

        <div className="mt-4 mb-2">
          {isSidebarOpen && <div className="text-xs font-semibold text-[#52525b] uppercase tracking-wider px-4 mb-2">Tüm Modüller</div>}
          <div className="space-y-1.5">{renderNav(others)}</div>
        </div>
      </nav>
    </aside>
    </>
  );
}
