import { Rocket, Shield, Palette, Layout, Search, Key, Sparkles, Terminal } from 'lucide-react';

const logs = [
  {
    version: 'v0.2.0-beta',
    date: '27 Ağustos 2026',
    title: 'Şemsiye ERP Mimarisi, Akıllı Menü ve Premium Login',
    icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    changes: [
      'Giriş Ekranı (Login) eklendi: Füme-siyah katmanlı tasarım, şifremi unuttum akışı ve detaylı hukuki pencereler (KVKK, Gizlilik) sisteme kazandırıldı.',
      'Sistem tamamen Mobil (Responsive) uyumlu hale getirildi. Sol menü mobilde hamburger butona ve çekmeceye (backdrop) taşındı.',
      'Modül Yönetimi: İkmal, Destek (Ticket), B2B, Lojistik, Açık Bankacılık dahil 12 yeni modül (App Store mantığıyla) sisteme eklendi.',
      'Kişiselleştirilebilir Sol Menü: Sık kullanılanlar (Favoriler) alanı ve A-Z / Son Kullanılana Göre akıllı sıralama yeteneği eklendi.',
      'Akıllı Dashboard: Ana ekran KPI (Özet) kartları, aktif edilen modüllere (Örn: Bakımdaki Araçlar, Açık Biletler) göre otomatik tepki verir hale getirildi.',
      'Admin Paneli geliştirmeleri: Local-first şirket logosu yükleme ve Kullanıcı Yetki/Rol (RBAC) önizleme alanları Ayarlar kısmına eklendi.'
    ]
  },
  {
    version: 'v0.1.13-alpha',
    date: '27 Ağustos 2026',
    title: 'Stok Modülü ve Mimari Revizyon',
    icon: Sparkles,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    changes: [
      'Gelişmiş "Stok & Envanter Yönetimi" (Stoklar) modülü tamamen sıfırdan yazılarak sisteme entegre edildi.',
      'Kritik stok uyarıları, otomatik barkod/SKU atama ve depo bazlı ürün takip sistemi kuruldu.',
      'Sistem çekmecesi (Drawer) ekrana yapışık tasarımdan koparılarak "Yüzen Panel" (Floating Panel) görünümüne kavuşturuldu.',
      'Tüm form arayüzleri, iOS ve macOS tasarım felsefesiyle (Elevated Cards) yeniden yapılandırılarak Açık Tema kusursuzlaştırıldı.',
      'Grafikler ve renk paletlerinde meydana gelen koyu mod izleri / şeffaflık hataları çözüldü.'
    ]
  },
  {
    version: 'v0.1.12-alpha',
    date: '26 Ağustos 2026',
    title: 'Global Tema ve Ayarlar Yönetimi',
    icon: Palette,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/20',
    changes: [
      'Tam bağımsız Tailwind CSS CSS Variables mimarisine geçiş yapılarak Brute-Force tema motoru yazıldı.',
      'Mavi, Zümrüt, İndigo ve Gül renk temaları sisteme entegre edildi.',
      'Kompakt mod algoritması (14px/16px root font scaling) ile tüm uygulamanın orantılı daralması sağlandı.',
      'Kullanıcı profili menüsüne Google Workspace (SSO), 2FA ve Aktif Cihazlar güvenliği eklendi.',
      'Sistem ayarlarına Firma Fatura Adresi, Para Birimi Seçimi ve Sesli Bildirim anahtarı yerleştirildi.',
      'Ana Ekran (Dashboard) Türkçeleştirildi ve yan menü bağlantıları (Routing) 404 hatalarına karşı kusursuzlaştırıldı.'
    ]
  },
  {
    version: 'v0.1.8-alpha',
    date: '26 Ağustos 2026',
    title: 'Arama Motoru ve Yan Menü İyileştirmeleri',
    icon: Search,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    changes: [
      'Merkezi arama çubuğu (Header Search) reaktif hale getirildi.',
      'Klavye (Aşağı/Yukarı oklar ve Enter) ile arama sonuçlarında gezinebilme özelliği eklendi.',
      'Nexus logosu sol üst köşeye yerleştirildi ve tıklanabilir (Ana Ekrana dönüş) hale getirildi.',
      'Yan menü (Sidebar) daraltılıp genişletilebilir (Collapsible) bir animasyona kavuştu.'
    ]
  },
  {
    version: 'v0.1.5-alpha',
    date: '26 Ağustos 2026',
    title: 'OLED Dark UI ve Dinamik Formlar',
    icon: Layout,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    changes: [
      'Premium ERP deneyimi için "OLED Dark" karanlık tema zorunlu hale getirildi.',
      'Bütün ekranlara özel "Custom Scrollbar" ve "Lucide" modern ikon setleri entegre edildi.',
      'Yeni Cari Ekle, Fatura Kes, Depo Transferi yap gibi işlemler için sağdan açılan çekmece (Drawer) sistemi kodlandı.',
      'Butonlardaki animasyonlar (hover, transition) ve sistem tabanlı Toast (bildirim mesajları) eklendi.'
    ]
  },
  {
    version: 'v0.1.0-alpha',
    date: '25 Ağustos 2026',
    title: 'Proje Başlangıcı ve Altyapı',
    icon: Rocket,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
    changes: [
      'React, Vite, TypeScript, ve Tailwind CSS v4 omurgası ayağa kaldırıldı.',
      'Durum yönetimi (State Management) için Zustand kuruldu.',
      'Geçici (Mock) veritabanı (Zustand Store) ile Dashboard, Cari Listesi, Fatura Listesi bileşenleri oluşturuldu.'
    ]
  }
];

export default function Changelog() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 border border-[#27272a]">
          <Terminal size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Sürüm Notları</h2>
          <p className="text-xs text-[#94a3b8]">Uygulamanın başlangıcından bugüne tüm güncellemeler.</p>
        </div>
      </div>

      <div className="relative border-l-2 border-[#27272a] ml-4 mt-8 space-y-10 pb-8">
        {logs.map((log) => (
          <div key={log.version} className="relative pl-8">
            <div className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#0a0a0a] ${log.bg} ${log.color}`}>
              <log.icon size={16} />
            </div>
            
            <div className="bg-[#141414] border border-[#27272a] rounded-xl p-5 hover:border-[#52525b] transition-all relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 transition-opacity group-hover:opacity-10 ${log.bg}`}></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${log.bg} ${log.color} ${log.border}`}>
                    {log.version}
                  </span>
                  <span className="text-sm font-semibold text-white">{log.title}</span>
                </div>
                <span className="text-xs font-medium text-[#52525b]">{log.date}</span>
              </div>
              
              <ul className="space-y-2.5">
                {log.changes.map((change, i) => (
                  <li key={i} className="text-sm text-[#94a3b8] flex items-start gap-2">
                    <Sparkles size={14} className={`shrink-0 mt-0.5 ${log.color} opacity-60`} />
                    <span className="leading-relaxed">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
