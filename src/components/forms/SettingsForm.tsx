import { useUIStore } from '../../store/useUIStore';
import { toast } from 'sonner';
import { Bell, Globe, Building, DollarSign, Palette, Upload } from 'lucide-react';

import { useRef } from 'react';

export default function SettingsForm() {
  const { density, setDensity, themeColor, setThemeColor, currency, setCurrency, soundEnabled, setSoundEnabled, closeDrawer, activeModules, toggleModule, moduleSortPreference, setModuleSortPreference, favoriteModules, toggleFavoriteModule } = useUIStore();

  const { companyLogo, setCompanyLogo } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Sistem ayarları başarıyla kaydedildi.');
    closeDrawer();
  };

  return (
    <form id="drawer-form" onSubmit={handleSubmit} className="space-y-8">
      
      {/* Görünüm Ayarları */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Globe size={16} className="text-blue-500" /> Görünüm & Tasarım
        </h3>
        
        {/* Tema Modu (Karanlık/Aydınlık) */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-[#94a3b8] mb-3">Tema Modu (Karanlık / Açık)</label>
          <div className="flex bg-[#0a0a0a] border border-[#27272a] rounded-lg p-1">
            {['dark', 'light', 'system'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => useUIStore.getState().setThemeMode(mode as any)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                  useUIStore.getState().themeMode === mode 
                    ? 'bg-[#141414] text-white shadow-sm border border-[#27272a]' 
                    : 'text-[#52525b] hover:text-[#94a3b8]'
                }`}
              >
                {mode === 'dark' ? 'Karanlık' : mode === 'light' ? 'Açık' : 'Sistem'}
              </button>
            ))}
          </div>
        </div>

        {/* UI Yoğunluk */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-[#94a3b8] mb-3">Kullanıcı Arayüzü Yoğunluğu</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => setDensity('normal')}
              className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-all ${density === 'normal' ? 'bg-blue-600/10 border-blue-500 text-blue-500 shadow-sm' : 'bg-[#141414] border-[#27272a] text-[#94a3b8] hover:border-[#52525b]'}`}
            >
              <div className="w-16 h-8 flex flex-col justify-between">
                <div className="w-full h-1.5 bg-current rounded-full opacity-50" />
                <div className="w-full h-1.5 bg-current rounded-full opacity-50" />
                <div className="w-3/4 h-1.5 bg-current rounded-full opacity-50" />
              </div>
              <span className="text-xs font-medium">Standart (Ferah)</span>
            </button>

            <button 
              type="button"
              onClick={() => setDensity('compact')}
              className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-all ${density === 'compact' ? 'bg-blue-600/10 border-blue-500 text-blue-500 shadow-sm' : 'bg-[#141414] border-[#27272a] text-[#94a3b8] hover:border-[#52525b]'}`}
            >
              <div className="w-16 h-8 flex flex-col justify-between">
                <div className="w-full h-1 bg-current rounded-full opacity-50" />
                <div className="w-full h-1 bg-current rounded-full opacity-50" />
                <div className="w-full h-1 bg-current rounded-full opacity-50" />
                <div className="w-full h-1 bg-current rounded-full opacity-50" />
                <div className="w-3/4 h-1 bg-current rounded-full opacity-50" />
              </div>
              <span className="text-xs font-medium">Kompakt (Sıkı)</span>
            </button>
          </div>
        </div>

        {/* Tema Renkleri */}
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-3">Sistem Ana Rengi (Özel Renk Seçilebilir)</label>
          <div className="flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => setThemeColor('blue')} className={`w-10 h-10 rounded-full bg-[#3b82f6] shadow-lg cursor-pointer transition-all ${themeColor === 'blue' ? 'ring-4 ring-[#3b82f6]/30 scale-110' : 'hover:scale-110'}`} title="Mavi"></button>
              <button type="button" onClick={() => setThemeColor('emerald')} className={`w-10 h-10 rounded-full bg-[#10b981] shadow-lg cursor-pointer transition-all ${themeColor === 'emerald' ? 'ring-4 ring-[#10b981]/30 scale-110' : 'hover:scale-110'}`} title="Zümrüt"></button>
              <button type="button" onClick={() => setThemeColor('indigo')} className={`w-10 h-10 rounded-full bg-[#6366f1] shadow-lg cursor-pointer transition-all ${themeColor === 'indigo' ? 'ring-4 ring-[#6366f1]/30 scale-110' : 'hover:scale-110'}`} title="İndigo"></button>
              <button type="button" onClick={() => setThemeColor('rose')} className={`w-10 h-10 rounded-full bg-[#f43f5e] shadow-lg cursor-pointer transition-all ${themeColor === 'rose' ? 'ring-4 ring-[#f43f5e]/30 scale-110' : 'hover:scale-110'}`} title="Gül"></button>
              
              <div className="w-[1px] h-8 bg-[#27272a] mx-1"></div>
              
              {/* Custom Color Picker */}
              <div className="relative group">
                <input 
                  type="color" 
                  value={['blue', 'emerald', 'indigo', 'rose'].includes(themeColor) ? '#ffffff' : themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className={`w-10 h-10 rounded-full cursor-pointer transition-all outline-none border-0 bg-transparent ${!['blue', 'emerald', 'indigo', 'rose'].includes(themeColor) ? 'ring-4 ring-white/20 scale-110' : 'hover:scale-110'}`}
                  style={{
                    WebkitAppearance: 'none',
                    padding: 0,
                    overflow: 'hidden'
                  }}
                  title="Özel Renk Seç"
                />
                <div className="absolute inset-0 pointer-events-none rounded-full border-2 border-white/10" style={{ backgroundColor: !['blue', 'emerald', 'indigo', 'rose'].includes(themeColor) ? themeColor : 'transparent' }}>
                  {!['blue', 'emerald', 'indigo', 'rose'].includes(themeColor) && (
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: themeColor }}></div>
                  )}
                  {['blue', 'emerald', 'indigo', 'rose'].includes(themeColor) && (
                     <div className="w-full h-full rounded-full flex items-center justify-center bg-[#141414] border border-[#27272a]">
                       <Palette size={16} className="text-[#94a3b8]" />
                     </div>
                  )}
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Şirket & Finans Ayarları */}
      <div className="border-t border-[#27272a] pt-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Building size={16} className="text-emerald-500" /> Şirket & Finans
        </h3>
        
        <div className="mb-6 flex items-center gap-4 bg-[#141414] border border-[#27272a] p-4 rounded-xl">
          {companyLogo ? (
            <img src={companyLogo} alt="Company Logo" className="w-16 h-16 object-contain rounded-lg bg-black/20" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-[#0a0a0a] border border-[#27272a] flex items-center justify-center">
              <Building size={24} className="text-[#52525b]" />
            </div>
          )}
          <div className="flex-1">
            <h4 className="text-sm font-medium text-white mb-1">Şirket Logosu</h4>
            <p className="text-xs text-[#94a3b8] mb-2">Sistemin giriş ekranında ve e-Fatura PDF çıktılarında kullanılacak logo.</p>
            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors">
              <Upload size={14} /> Yeni Logo Yükle
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1">Şirket Unvanı</label>
            <input type="text" defaultValue="Nexus Yazılım Teknolojileri A.Ş." className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1">Vergi Numarası</label>
              <input type="text" defaultValue="1234567890" className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1">Vergi Dairesi</label>
              <input type="text" defaultValue="Maslak V.D." className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1">Firma / Fatura Adresi</label>
            <textarea 
              rows={3}
              defaultValue="Levent Mah. Büyükdere Cad. Plaza No:123/45&#10;Şişli / İstanbul" 
              className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-all resize-none custom-scrollbar" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1 flex items-center gap-1"><DollarSign size={12}/> Varsayılan Para Birimi</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value as any)}
              className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-all"
            >
              <option value="TRY">Türk Lirası (₺)</option>
              <option value="USD">Amerikan Doları ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
            <p className="text-[10px] text-[#52525b] mt-1.5 ml-1">Değişiklik anında tüm fatura ve cari bakiyelerine yansır.</p>
          </div>
        </div>
      </div>

      {/* Bildirim Ayarları */}
      <div className="border-t border-[#27272a] pt-6 pb-4">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Bell size={16} className="text-rose-500" /> Sistem Bildirimleri
        </h3>
        
        <div className="flex items-center justify-between p-3 bg-[#141414] border border-[#27272a] rounded-lg mb-3">
          <div>
            <div className="text-sm font-medium text-white">Sesli Uyarılar</div>
            <div className="text-xs text-[#94a3b8] mt-0.5">Yeni bildirimlerde sesli uyarı ver (Ting)</div>
          </div>
          <button 
            type="button" 
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) toast.success('Sesli bildirimler aktifleştirildi.');
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${soundEnabled ? 'bg-blue-500' : 'bg-[#27272a]'}`}
          >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Kullanıcılar ve Roller */}
      <div className="border-t border-[#27272a] pt-6 pb-4">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Kullanıcılar ve Yetki Yönetimi
        </h3>
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-400">
          Bu alan <strong>Supabase (Authentication & Row Level Security)</strong> entegrasyonu tamamlandığında aktif olacaktır. <br/><br/>
          <strong>Beklenen Özellikler:</strong><br/>
          • Şirket personeline e-posta ile davetiye gönderme.<br/>
          • Satış, Depo, Finans veya Yönetici gibi roller atama.<br/>
          • Rol bazlı sayfa ve modül gizleme (RBAC).
        </div>
      </div>

      {/* Menü Düzeni ve Sıralama */}
      <div className="border-t border-[#27272a] pt-6 pb-4">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Globe size={16} className="text-indigo-500" /> Sol Menü Düzeni
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Modül Sıralaması</label>
          <select 
            value={moduleSortPreference} 
            onChange={(e) => setModuleSortPreference(e.target.value as any)}
            className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-all mb-2"
          >
            <option value="default">Varsayılan Sıralama (Önerilen)</option>
            <option value="name">İsme Göre (A-Z)</option>
            <option value="recent">En Son Kullanılanlar Üstte</option>
          </select>
          <p className="text-[10px] text-[#52525b]">Bu seçenek, sol taraftaki menünün sıralamasını değiştirir.</p>
        </div>
      </div>

      {/* Modül Yönetimi */}
      <div className="border-t border-[#27272a] pt-6 pb-4">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Palette size={16} className="text-purple-500" /> Modül Yönetimi & Sık Kullanılanlar
        </h3>
        <p className="text-xs text-[#94a3b8] mb-4">Şirketinizin ihtiyaçlarına göre kullanılmayan modülleri devre dışı bırakın veya yıldıza tıklayarak sol menüde "Sık Kullanılanlara" sabitleyin.</p>
        <div className="space-y-2">
          {[
            { key: 'sales', label: 'Teklif & Sipariş Yönetimi' },
            { key: 'b2b', label: 'B2B Bayi Portalı' },
            { key: 'purchase', label: 'Satınalma Modülü' },
            { key: 'inventory', label: 'Stoklar ve Ürün Yönetimi' },
            { key: 'depot', label: 'Depo İşlemleri' },
            { key: 'manufacturing', label: 'Üretim & Reçete (MRP)' },
            { key: 'fleet', label: 'Makine İkmal & Araç Filosu' },
            { key: 'logistics', label: 'Kargo & Lojistik Entegrasyonu' },
            { key: 'invoice', label: 'Fatura ve e-Belge' },
            { key: 'finance', label: 'Finans & Kasa Yönetimi' },
            { key: 'banking', label: 'Açık Bankacılık (API)' },
            { key: 'subscriptions', label: 'Abonelik & Düzenli Fatura' },
            { key: 'contacts', label: 'Cari Kartlar (Müşteri & Tedarikçi)' },
            { key: 'tickets', label: 'Destek (Ticket) Servisi' },
            { key: 'projects', label: 'Görev & Proje Yönetimi' },
            { key: 'marketing', label: 'Pazarlama (SMS & E-Posta)' },
            { key: 'hr', label: 'İnsan Kaynakları' },
            { key: 'reports', label: 'Gelişmiş Raporlar' },
            { key: 'pos', label: 'Hızlı Satış (POS) Terminali' },
            { key: 'field_service', label: 'Saha Servis Yönetimi' },
            { key: 'quality', label: 'Kalite Kontrol' },
            { key: 'ecommerce', label: 'E-Ticaret & Pazaryeri' },
            { key: 'assets', label: 'Demirbaş ve Zimmet' },
            { key: 'expenses', label: 'Masraf Yönetimi' },
            { key: 'contracts', label: 'Sözleşme Yönetimi' },
            { key: 'edevlet', label: 'e-Devlet İşlemleri' }
          ].map(mod => (
            <div key={mod.key} className="flex items-center justify-between p-3 bg-[#141414] border border-[#27272a] rounded-lg hover:border-[#52525b] transition-colors">
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input 
                  type="checkbox" 
                  checked={activeModules[mod.key as keyof typeof activeModules]}
                  onChange={() => toggleModule(mod.key as keyof typeof activeModules)}
                  className="accent-purple-500 w-4 h-4 cursor-pointer"
                />
                <span className={`text-sm font-medium ${activeModules[mod.key as keyof typeof activeModules] ? 'text-white' : 'text-[#52525b]'}`}>{mod.label}</span>
              </label>
              
              {activeModules[mod.key as keyof typeof activeModules] && (
                <button
                  type="button"
                  onClick={() => toggleFavoriteModule(mod.key)}
                  className={`p-1.5 rounded-md transition-colors ${favoriteModules.includes(mod.key) ? 'text-yellow-500 bg-yellow-500/10' : 'text-[#52525b] hover:text-yellow-500 hover:bg-[#27272a]'}`}
                  title={favoriteModules.includes(mod.key) ? 'Sık Kullanılanlardan Çıkar' : 'Sık Kullanılanlara Ekle'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={favoriteModules.includes(mod.key) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </form>
  );
}
