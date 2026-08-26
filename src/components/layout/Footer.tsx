import { APP_VERSION } from '../../config/version';
import { ShieldCheck, Activity, Globe } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export default function Footer() {
  const { openDrawer } = useUIStore();

  const showKVKK = () => {
    alert("KVKK & GİZLİLİK POLİTİKASI\n\n6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, Nexus üzerinde işlenen müşteri, tedarikçi ve personel verileri yüksek güvenlik standartlarında (Uçtan Uca Şifreleme) saklanmaktadır.\n\nGİB entegrasyonu kapsamındaki fatura bilgileri yasal süre olan 10 yıl boyunca güvenli bulut ortamında yedeklenmektedir.");
  };

  return (
    <footer className="hidden md:flex h-10 border-t border-[#27272a] bg-[#0a0a0a] items-center justify-between px-6 text-xs text-[#52525b] shrink-0">
      <div className="flex items-center gap-4">
        <span className="font-medium text-[#94a3b8]">&copy; 2026 Nexus</span>
        <div className="flex items-center gap-1.5 text-emerald-500/70 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <Activity size={12} />
          <span className="font-medium">Sistem Çevrimiçi</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        
        {/* Fixed Language Selector */}
        <div className="flex items-center gap-1.5 cursor-default">
          <Globe size={12} />
          <span className="font-medium">TR</span>
        </div>

        {/* KVKK Modal Trigger */}
        <div 
          className="flex items-center gap-1.5 hover:text-[#94a3b8] transition-colors cursor-pointer"
          onClick={showKVKK}
        >
          <ShieldCheck size={12} />
          <span>KVKK & Gizlilik</span>
        </div>
        
        <button 
          onClick={() => openDrawer('CHANGELOG')}
          className="font-mono tracking-widest text-blue-500 hover:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 transition-all cursor-pointer"
          title="Sürüm Notlarını (Güncellemeleri) Görüntüle"
        >
          {APP_VERSION}
        </button>
      </div>
    </footer>
  );
}
