const fs = require('fs');
let code = fs.readFileSync('src/components/forms/SettingsForm.tsx', 'utf8');

// Replace the start of the component to import new store values
code = code.replace(
  'activeModules, toggleModule } = useUIStore();',
  'activeModules, toggleModule, moduleSortPreference, setModuleSortPreference, favoriteModules, toggleFavoriteModule } = useUIStore();'
);

// Find Modül Yönetimi section and replace it
const oldSection = `
      {/* Modül Yönetimi */}
      <div className="border-t border-[#27272a] pt-6 pb-4">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Palette size={16} className="text-purple-500" /> Modül Yönetimi
        </h3>
        <p className="text-xs text-[#94a3b8] mb-4">Şirketinizin ihtiyaçlarına göre kullanılmayan modülleri devre dışı bırakın.</p>
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
            { key: 'reports', label: 'Gelişmiş Raporlar' }
          ].map(mod => (
            <label key={mod.key} className="flex items-center justify-between p-3 bg-[#141414] border border-[#27272a] rounded-lg cursor-pointer hover:border-[#52525b] transition-colors">
              <span className="text-sm font-medium text-white">{mod.label}</span>
              <input 
                type="checkbox" 
                checked={activeModules[mod.key as keyof typeof activeModules]}
                onChange={() => toggleModule(mod.key as keyof typeof activeModules)}
                className="accent-purple-500 w-4 h-4 cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>
`;

const newSection = `
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
            { key: 'reports', label: 'Gelişmiş Raporlar' }
          ].map(mod => (
            <div key={mod.key} className="flex items-center justify-between p-3 bg-[#141414] border border-[#27272a] rounded-lg hover:border-[#52525b] transition-colors">
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input 
                  type="checkbox" 
                  checked={activeModules[mod.key as keyof typeof activeModules]}
                  onChange={() => toggleModule(mod.key as keyof typeof activeModules)}
                  className="accent-purple-500 w-4 h-4 cursor-pointer"
                />
                <span className={\`text-sm font-medium \${activeModules[mod.key as keyof typeof activeModules] ? 'text-white' : 'text-[#52525b]'}\`}>{mod.label}</span>
              </label>
              
              {activeModules[mod.key as keyof typeof activeModules] && (
                <button
                  type="button"
                  onClick={() => toggleFavoriteModule(mod.key)}
                  className={\`p-1.5 rounded-md transition-colors \${favoriteModules.includes(mod.key) ? 'text-yellow-500 bg-yellow-500/10' : 'text-[#52525b] hover:text-yellow-500 hover:bg-[#27272a]'}\`}
                  title={favoriteModules.includes(mod.key) ? 'Sık Kullanılanlardan Çıkar' : 'Sık Kullanılanlara Ekle'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={favoriteModules.includes(mod.key) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
`;

code = code.replace(oldSection.trim(), newSection.trim());
fs.writeFileSync('src/components/forms/SettingsForm.tsx', code);
