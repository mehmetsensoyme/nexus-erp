import { User, Mail, Key, Camera, Shield, Smartphone, Globe } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ProfileForm() {
  const { closeDrawer, userProfile } = useUIStore();
  const [twoFactor, setTwoFactor] = useState(false);

  const handlePhotoUpload = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
      loading: 'Fotoğraf yükleniyor...',
      success: 'Profil fotoğrafınız başarıyla güncellendi.',
      error: 'Yükleme başarısız'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profil bilgileri başarıyla kaydedildi.');
    closeDrawer();
  };

  return (
    <form id="drawer-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center justify-center p-6 bg-[#0a0a0a] border border-[#27272a] rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 w-full h-16 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
        
        {/* Photo Upload Mock */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white border-4 border-[#111111] z-10 shadow-xl mb-3 overflow-hidden cursor-pointer">
          <User size={32} />
          {/* Hover Overlay */}
          <div onClick={handlePhotoUpload} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
             <Camera size={18} className="text-white mb-1" />
             <span className="text-[9px] font-bold">DEĞİŞTİR</span>
          </div>
        </div>
        
        <h2 className="text-lg font-bold text-white z-10">{userProfile?.full_name || "Yönetici Hesabı"}</h2>
        <span className="text-xs text-blue-400 font-medium px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20 mt-1 z-10">Süper Admin Rolü</span>
      </div>

      {/* Kimlik Bilgileri */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Ad Soyad</label>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <input type="text" defaultValue={userProfile?.full_name || "Sistem Yöneticisi"} className="w-full bg-[#141414] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">E-Posta Adresi</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <input type="email" defaultValue={userProfile?.email || "admin@nexus.com"} disabled className="w-full bg-[#141414] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-sm text-[#52525b] cursor-not-allowed outline-none" />
          </div>
        </div>
      </div>

      {/* Güvenlik Ayarları */}
      <div className="border-t border-[#27272a] pt-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Shield size={16} className="text-blue-500" /> Hesap Güvenliği</h3>
        
        <div className="flex items-center justify-between p-3 bg-[#141414] border border-[#27272a] rounded-lg">
          <div>
            <div className="text-sm font-medium text-white">İki Aşamalı Doğrulama (2FA)</div>
            <div className="text-xs text-[#94a3b8] mt-0.5">Google Authenticator ile girişi koruyun.</div>
          </div>
          <button 
            type="button" 
            onClick={() => {
              setTwoFactor(!twoFactor);
              toast.info(twoFactor ? '2FA devre dışı bırakıldı.' : '2FA kurulum ekranına yönlendiriliyorsunuz...');
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${twoFactor ? 'bg-blue-500' : 'bg-[#27272a]'}`}
          >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>

        <button 
          type="button"
          onClick={() => { toast.success('Şifre sıfırlama bağlantısı e-postanıza gönderildi.'); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#141414] border border-[#27272a] hover:bg-[#27272a] rounded-lg text-sm text-white transition-colors"
        >
          <Key size={16} /> Şifremi Değiştir
        </button>
      </div>

      {/* SSO Bağlantıları */}
      <div className="border-t border-[#27272a] pt-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">Bağlı Hesaplar (SSO)</h3>
        <button type="button" className="w-full flex items-center justify-between p-3 bg-[#141414] border border-[#27272a] hover:border-[#52525b] rounded-lg transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-white">Google Workspace</div>
              <div className="text-xs text-[#94a3b8]">{userProfile?.email || "admin@nexus.com"}</div>
            </div>
          </div>
          <span className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Bağlı</span>
        </button>
      </div>

      {/* Aktif Oturumlar */}
      <div className="border-t border-[#27272a] pt-5 space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Smartphone size={16} className="text-[#94a3b8]"/> Aktif Oturumlar</h3>
          <button type="button" onClick={() => toast.success('Diğer tüm cihazlardan çıkış yapıldı.')} className="text-xs text-red-400 hover:text-red-300 transition-colors">Tümünden Çık</button>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <Globe size={18} className="text-blue-500" />
          <div className="flex-1">
            <div className="text-sm font-medium text-blue-400">Bu Cihaz (Mac - Chrome)</div>
            <div className="text-xs text-[#94a3b8]">İstanbul, TR • Şu an aktif</div>
          </div>
        </div>
      </div>
    </form>
  );
}
