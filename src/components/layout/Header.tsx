import { Search, Bell, User, Settings, LogOut, ChevronDown, CheckCircle2, FileText, Box, Maximize, AlertCircle, Trash2, CheckSquare, Package, Menu, MonitorSmartphone, Wrench, FileCheck, ShoppingBag, Archive, Receipt, FileSignature, Landmark, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from '../../hooks/useClickOutside';
import { toast } from 'sonner';
import { useDataStore } from '../../store/useDataStore';
import { useUIStore } from '../../store/useUIStore';

export default function Header() {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Click outside refs
  const userMenuRef = useClickOutside(() => setUserMenuOpen(false));
  const notifMenuRef = useClickOutside(() => setNotifMenuOpen(false));
  const searchRef = useClickOutside(() => {
    setSearchFocused(false);
    setSelectedIndex(-1);
  });

  // Global Data & UI
  const { contacts, invoices, depots, inventory, notifications, addNotification, markAllNotificationsRead, markNotificationRead, deleteNotification, clearAllNotifications } = useDataStore();
  const { openDrawer, toggleSidebar, logout, userProfile } = useUIStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  // Live Notification Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      addNotification({
        title: 'Sistem Bağlantısı Testi',
        message: 'GİB entegrasyonu başarılı şekilde doğrulandı.',
        time: 'Şimdi',
        read: false,
        type: 'success',
        link: '/fatura'
      });
      toast.success('GİB entegrasyonu başarılı şekilde doğrulandı.');
    }, 60000); 
    return () => clearInterval(interval);
  }, [addNotification]);

  // Supabase Async Search Logic
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      
      const { supabase } = await import('../../lib/supabase');
      const query = `%${searchQuery}%`;
      
      try {
        const APP_MODULES = [
          { id: 'm-dash', title: 'Ana Ekran', subtitle: 'Modül', icon: Maximize, path: '/' },
          { id: 'm-cari', title: 'Cari Kartlar', subtitle: 'Modül', icon: User, path: '/cari' },
          { id: 'm-stok', title: 'Stok ve Ürünler', subtitle: 'Modül', icon: Package, path: '/stoklar' },
          { id: 'm-fatura', title: 'Faturalar', subtitle: 'Modül', icon: FileText, path: '/fatura' },
          { id: 'm-satis', title: 'Satış Yönetimi', subtitle: 'Modül', icon: ShoppingCart, path: '/satis' },
          { id: 'm-alim', title: 'Satınalma', subtitle: 'Modül', icon: ShoppingBag, path: '/satin-alma' },
          { id: 'm-pos', title: 'Hızlı Satış (POS)', subtitle: 'Modül', icon: MonitorSmartphone, path: '/pos' },
          { id: 'm-field', title: 'Saha Servis', subtitle: 'Modül', icon: Wrench, path: '/field-service' },
          { id: 'm-quality', title: 'Kalite Kontrol', subtitle: 'Modül', icon: FileCheck, path: '/quality' },
          { id: 'm-ecommerce', title: 'E-Ticaret & Pazaryeri', subtitle: 'Modül', icon: ShoppingBag, path: '/ecommerce' },
          { id: 'm-assets', title: 'Demirbaş & Zimmet', subtitle: 'Modül', icon: Archive, path: '/assets' },
          { id: 'm-expenses', title: 'Masraf Yönetimi', subtitle: 'Modül', icon: Receipt, path: '/expenses' },
          { id: 'm-contracts', title: 'Sözleşme Yönetimi', subtitle: 'Modül', icon: FileSignature, path: '/contracts' },
          { id: 'm-edevlet', title: 'e-Devlet', subtitle: 'Modül', icon: Landmark, path: '/edevlet' },
          { id: 'm-ayarlar', title: 'Sistem Ayarları', subtitle: 'Menü', icon: Settings, path: '#settings' }
        ];

        const matchedModules = APP_MODULES.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

        // Parallel fetch from all connected modules (Currently Contacts, Inventory, Invoices)
        const [contactsRes, inventoryRes, invoicesRes] = await Promise.all([
          supabase.from('contacts').select('id, name').ilike('name', query).limit(3),
          supabase.from('inventory_items').select('id, name, code').ilike('name', query).limit(3),
          supabase.from('invoices').select('id, invoice_number').ilike('invoice_number', query).limit(3)
        ]);

        const results = [...matchedModules];
        
        if (contactsRes.data) {
          results.push(...contactsRes.data.map(c => ({ id: `c-${c.id}`, title: c.name, subtitle: 'Cari Kart', icon: User, path: '/cari' })));
        }
        if (inventoryRes.data) {
          results.push(...inventoryRes.data.map(i => ({ id: `i-${i.id}`, title: i.name, subtitle: `Stok - ${i.code}`, icon: Package, path: '/stoklar' })));
        }
        if (invoicesRes.data) {
          results.push(...invoicesRes.data.map(inv => ({ id: `inv-${inv.id}`, title: inv.invoice_number, subtitle: 'Fatura', icon: FileText, path: '/fatura' })));
        }
        
        setSearchResults(results.slice(0, 8));
      } catch (err) {
        console.error("Arama hatası:", err);
      } finally {
        setIsSearching(false);
      }
    };
    
    // Simple debounce
    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchFocused || searchResults.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const targetIndex = selectedIndex >= 0 ? selectedIndex : 0; // Default to first if none selected
      const result = searchResults[targetIndex];
      if (result) {
        if (result.path === '#settings') {
          openDrawer('SETTINGS');
        } else {
          navigate(result.path);
          toast.success(`${result.title} ekranına gidildi.`);
        }
        setSearchFocused(false);
        setSearchQuery('');
        setSelectedIndex(-1);
      }
    }
  };

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  return (
    <header className="h-16 border-b border-[#27272a] bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-3 md:px-6 sticky top-0 z-40 shrink-0 gap-2">
      
      {/* Sol Alan (Araçlar) */}
      <div className="flex items-center gap-2 md:w-1/4">
        <button onClick={toggleSidebar} className="md:hidden p-2 text-[#94a3b8] hover:text-white rounded-lg hover:bg-[#27272a] transition-colors">
          <Menu size={20} />
        </button>
        <button 
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              if (document.exitFullscreen) document.exitFullscreen();
            }
          }}
          className="hidden md:flex w-8 h-8 rounded-lg hover:bg-[#27272a] text-[#94a3b8] hover:text-white transition-colors items-center justify-center border border-transparent hover:border-[#52525b]"
          title="Tam Ekran"
        >
          <Maximize size={16} />
        </button>
      </div>

      {/* Merkez Alan (İşlevsel Arama Kutusu) */}
      <div className="flex-1 flex justify-center relative" ref={searchRef}>
        <div className={`flex items-center bg-[#141414] border transition-all rounded-md px-3 md:px-4 py-2 w-full max-w-2xl z-50 ${searchFocused ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-[#27272a]'}`}>
          <Search size={16} className={searchFocused ? 'text-blue-500 mr-2 md:mr-3' : 'text-[#64748b] mr-2 md:mr-3'} />
          <input 
            type="text" 
            placeholder="Ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-[#52525b]"
          />
        </div>
        
        {/* Arama Sonuçları Dropdown */}
        {searchFocused && searchQuery.length >= 2 && (
          <div className="absolute top-14 w-full max-w-2xl bg-[#111111] border border-[#27272a] rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden z-50">
            <div className="px-3 py-2 text-xs font-semibold text-[#52525b] uppercase tracking-wider">Hızlı Sonuçlar</div>
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <button 
                  key={result.id}
                  onClick={() => {
                    if (result.path === '#settings') {
                      openDrawer('SETTINGS');
                    } else {
                      navigate(result.path);
                      toast.success(`${result.title} ekranına gidildi.`);
                    }
                    setSearchFocused(false);
                    setSearchQuery('');
                    setSelectedIndex(-1);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-l-2 ${index === selectedIndex ? 'bg-[#27272a] border-blue-500' : 'hover:bg-[#27272a] border-transparent hover:border-blue-500'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#27272a] flex items-center justify-center text-[#94a3b8] shrink-0">
                    <result.icon size={16} />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-medium text-white truncate">{result.title}</span>
                    <span className="text-xs text-[#94a3b8]">{result.subtitle}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-[#52525b]">Aradığınız kritere uygun sonuç bulunamadı.</div>
            )}
          </div>
        )}
      </div>

      {/* Sağ Alan (Bildirimler ve Profil) */}
      <div className="md:w-1/4 flex items-center justify-end gap-2 md:gap-5 text-[#94a3b8]">
        
        {/* Notifications */}
        <div className="relative" ref={notifMenuRef}>
          <button 
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className={`hover:text-white transition-colors relative w-8 h-8 flex items-center justify-center rounded-lg ${notifMenuOpen ? 'bg-[#27272a] text-white' : ''}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-[#0a0a0a] rounded-full animate-pulse"></span>
            )}
          </button>
          
          {notifMenuOpen && (
            <div className="absolute right-0 mt-4 w-[300px] sm:w-96 bg-[#111111] border border-[#27272a] rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 z-50 flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-[#27272a] flex items-center justify-between bg-[#141414]">
                <span className="text-sm font-semibold text-white">Bildirimler {unreadCount > 0 && `(${unreadCount})`}</span>
                <div className="flex gap-3">
                  <button onClick={markAllNotificationsRead} className="text-xs text-[#94a3b8] hover:text-white transition-colors flex items-center gap-1" title="Tümünü Okundu İşaretle"><CheckSquare size={12}/> Okundu</button>
                  <button onClick={clearAllNotifications} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1" title="Tümünü Sil"><Trash2 size={12}/></button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto custom-scrollbar flex-1 bg-[#111111]">
                 {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`group flex items-start gap-3 px-4 py-3 transition-colors border-l-2 ${n.read ? 'hover:bg-[#27272a] border-transparent opacity-80' : 'bg-[#1a1a1a] border-blue-500 hover:bg-[#27272a]'}`}
                    >
                      <div 
                        onClick={() => {
                          if (n.link) navigate(n.link);
                          markNotificationRead(n.id);
                          setNotifMenuOpen(false);
                        }}
                        className="flex-1 flex gap-3 cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : n.type === 'info' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                          {n.type === 'success' ? <CheckCircle2 size={14} /> : n.type === 'info' ? <FileText size={14} /> : <AlertCircle size={14} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-white font-medium mb-0.5">{n.title}</span>
                          <span className="text-xs text-[#94a3b8] leading-relaxed">{n.message}</span>
                          <span className="text-[10px] text-[#52525b] mt-1.5">{n.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 shrink-0 opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); markNotificationRead(n.id); }} className="text-[#52525b] hover:text-white" title="Okundu İşaretle"><CheckCircle2 size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }} className="text-[#52525b] hover:text-red-500" title="Sil"><Trash2 size={14} /></button>
                      </div>
                    </div>
                 ))}
                 {notifications.length === 0 && (
                    <div className="px-4 py-12 text-center flex flex-col items-center justify-center gap-2">
                       <Bell size={24} className="text-[#27272a]" />
                       <span className="text-xs text-[#52525b]">Tüm bildirimleri temizlediniz.</span>
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>
        
        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <div 
            className="flex items-center gap-2 cursor-pointer group p-1 rounded-lg hover:bg-[#27272a] transition-all"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white border border-[#27272a] shadow-inner overflow-hidden">
              <User size={16} />
            </div>
            <ChevronDown size={14} className={`text-[#52525b] group-hover:text-white transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
          </div>

          {userMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-[#111111] border border-[#27272a] rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="px-4 py-3 border-b border-[#27272a] mb-2 bg-[#1a1a1a]">
                <p className="text-sm font-bold text-white">{userProfile?.full_name || 'Sistem Yöneticisi'}</p>
                <p className="text-xs text-[#94a3b8]">{userProfile?.email || 'admin@nexus.com'}</p>
              </div>
              <button onClick={() => { openDrawer('PROFILE'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#94a3b8] hover:bg-[#27272a] hover:text-white transition-colors">
                <User size={16} /> Profilim
              </button>
              <button onClick={() => { openDrawer('SETTINGS'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#94a3b8] hover:bg-[#27272a] hover:text-white transition-colors">
                <Settings size={16} /> Sistem Ayarları
              </button>
              <div className="my-2 border-t border-[#27272a]"></div>
              <button onClick={() => { logout(); toast.success('Başarıyla çıkış yapıldı.'); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <LogOut size={16} /> Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
