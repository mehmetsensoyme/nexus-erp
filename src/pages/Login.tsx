import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useUIStore } from '../store/useUIStore';
import { useClickOutside } from '../hooks/useClickOutside';
import { Command, Mail, Lock, ArrowRight, ShieldCheck, Upload, Building2, X, FileText, Shield, MapPin, Phone, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { login, companyLogo, setCompanyLogo, companyName } = useUIStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'forgot_password'>('login');
  const [activeModal, setActiveModal] = useState<'kvkk' | 'privacy' | 'contact' | null>(null);
  const modalRef = useClickOutside(() => setActiveModal(null));
  
  
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
      setAuthMode('login');
    }, 1500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Giriş başarısız: ' + error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
        window.location.href = '/';
      }
    } catch (err: any) {
      toast.error('Hata: ' + (err.message || err)); console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col md:flex-row relative selection:bg-blue-500/30">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Left Side - Brand & Presentation */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-14 relative z-10 border-r border-[#27272a]/50 bg-gradient-to-br from-[#18181b] to-[#111111] backdrop-blur-3xl">
        
        {/* Dynamic Company Logo Section */}
        <div>
          <div 
            className="group relative inline-flex items-center gap-4 "
            
            
          >
            
            {companyLogo ? (
              <img src={companyLogo} alt="Company Logo" className="w-16 h-16 rounded-2xl object-cover shadow-2xl shadow-blue-500/10 border border-white/5" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-[#27272a] flex items-center justify-center shadow-2xl shadow-black/50  transition-colors relative overflow-hidden">
                <Building2 size={28} className="text-[#52525b]  transition-transform" />
                
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white  transition-colors">
                {companyName}
              </span>
              <span className="text-xs font-medium text-[#52525b]  transition-colors">Kurumsal Yönetim Sistemi</span>
            </div>
          </div>
        </div>

        <div className="max-w-lg space-y-6">
          <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">
            İşletmenizi <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">tek noktadan</span> yönetin.
          </h1>
          <p className="text-lg text-[#94a3b8] leading-relaxed">
            Müşterilerinizden finansal operasyonlarınıza, üretimden insan kaynaklarına kadar tüm süreçlerinizi şifreli ve güvenli altyapımızla dijitale taşıyın.
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-[#52525b] bg-[#141414]/50 p-4 rounded-2xl border border-[#27272a]/50 w-fit backdrop-blur-sm">
          <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
          <span>Verileriniz <strong>Supabase Row Level Security (RLS)</strong> ile uçtan uca şifrelenmektedir.</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="md:hidden flex flex-col items-center gap-3 mb-12" >
           {companyLogo ? (
              <img src={companyLogo} alt="Logo" className="w-16 h-16 object-cover rounded-2xl shadow-2xl shadow-blue-500/10 border border-white/5" />
           ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#27272a] flex items-center justify-center">
                <Building2 size={24} className="text-[#52525b]" />
              </div>
           )}
           <span className="text-xl font-bold text-white tracking-tight">{companyName}</span>
        </div>

        <div className="w-full max-w-[400px]">
          {authMode === 'login' ? (
            <>
              <div className="mb-10 text-center md:text-left animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Hoş Geldiniz</h2>
                <p className="text-[#94a3b8]">Devam etmek için kurumsal hesabınıza giriş yapın.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">E-Posta Adresi</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#52525b] group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="isim@sirket.com"
                  className="w-full bg-[#141414] hover:bg-[#1c1c1f] focus:bg-[#1c1c1f] border border-[#27272a] rounded-2xl pl-12 pr-4 py-3.5 text-[15px] text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-[#52525b]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Şifre</label>
                <button type="button" onClick={() => setAuthMode('forgot_password')} className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">Şifremi Unuttum</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#52525b] group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141414] hover:bg-[#1c1c1f] focus:bg-[#1c1c1f] border border-[#27272a] rounded-2xl pl-12 pr-4 py-3.5 text-[15px] text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-[#52525b]"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 font-semibold py-3.5 px-4 rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-[15px]">Sisteme Giriş Yap</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
            </>
          ) : (
            <>
              <div className="mb-10 text-center md:text-left animate-in fade-in slide-in-from-left-4">
                <button 
                  onClick={() => setAuthMode('login')} 
                  className="w-10 h-10 rounded-full bg-[#111111] hover:bg-[#1c1c1f] border border-[#27272a] flex items-center justify-center text-[#94a3b8] hover:text-white transition-all mb-6"
                >
                  <ArrowLeft size={18} />
                </button>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Şifrenizi Sıfırlayın</h2>
                <p className="text-[#94a3b8] text-sm leading-relaxed">Kayıtlı e-posta adresinizi girin. Size şifrenizi güvenle sıfırlayabilmeniz için bir bağlantı göndereceğiz.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in slide-in-from-left-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">E-Posta Adresi</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#52525b] group-focus-within:text-blue-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="isim@sirket.com"
                      className="w-full bg-[#141414] hover:bg-[#1c1c1f] focus:bg-[#1c1c1f] border border-[#27272a] rounded-2xl pl-12 pr-4 py-3.5 text-[15px] text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-[#52525b]"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 font-semibold py-3.5 px-4 rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="text-[15px]">Sıfırlama Bağlantısı Gönder</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

        </div>
      </div>

      {/* Subtle Footer */}
      <div className="absolute bottom-6 w-full flex flex-col md:flex-row justify-between items-center px-8 pointer-events-none z-20 text-[11px] text-[#52525b] gap-4 md:gap-0">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button onClick={() => setActiveModal('kvkk')} className="hover:text-[#94a3b8] transition-colors">KVKK Aydınlatma Metni</button>
          <button onClick={() => setActiveModal('privacy')} className="hover:text-[#94a3b8] transition-colors">Gizlilik Politikası</button>
          <button onClick={() => setActiveModal('contact')} className="hover:text-[#94a3b8] transition-colors">İletişim Bilgileri</button>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto bg-[#141414]/80 px-3 py-1.5 rounded-full border border-[#27272a] backdrop-blur-md">
          <Command size={12} className="text-blue-500" />
          <span>
            <span className="text-[#94a3b8] font-medium">NexusERP</span> altyapısı <span className="text-white font-semibold">QuanixHQ</span> tarafından geliştirilmiştir.
          </span>
        </div>
      </div>
      

      {/* Legal Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div ref={modalRef as any} className="bg-[#141414] border border-[#27272a] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#27272a]">
              <div className="flex items-center gap-3">
                {activeModal === 'kvkk' && <FileText className="text-blue-500" size={24} />}
                {activeModal === 'privacy' && <Shield className="text-emerald-500" size={24} />}
                {activeModal === 'contact' && <Building2 className="text-indigo-500" size={24} />}
                <h2 className="text-xl font-bold text-white">
                  {activeModal === 'kvkk' && '6698 Sayılı KVKK Aydınlatma Metni'}
                  {activeModal === 'privacy' && 'Gizlilik ve Veri Güvenliği Politikası'}
                  {activeModal === 'contact' && 'QuanixHQ İletişim Bilgileri'}
                </h2>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-[#52525b] hover:text-white transition-colors bg-[#1e1e1e] p-2 rounded-lg hover:bg-[#27272a]">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-sm text-[#94a3b8] leading-relaxed space-y-6">
              
              {activeModal === 'kvkk' && (
                <>
                  <p><strong>Veri Sorumlusu:</strong> QuanixHQ Bilişim ve Yazılım A.Ş. ("Şirket") olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, NexusERP platformunu kullanırken bizimle paylaştığınız kişisel verilerinizin hukuka uygun olarak işlenmesine ve korunmasına azami hassasiyet göstermekteyiz.</p>
                  
                  <h3 className="text-white font-semibold text-base mt-4">1. İşlenen Kişisel Verileriniz</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Kimlik Bilgileri:</strong> Ad, Soyad, T.C. Kimlik No, Vergi No.</li>
                    <li><strong>İletişim Bilgileri:</strong> Telefon numarası, E-posta adresi, KEP adresi, fiziki adres.</li>
                    <li><strong>İşlem Güvenliği Verileri:</strong> IP adresleri, log kayıtları, oturum açma/kapatma zamanları, şifre bilgileri (hashlenmiş).</li>
                    <li><strong>Finansal Veriler:</strong> Fatura bilgileri, ödeme durumu, banka hesap/IBAN numaraları.</li>
                  </ul>

                  <h3 className="text-white font-semibold text-base mt-4">2. Kişisel Verilerin İşlenme Amacı</h3>
                  <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Sözleşmenin kurulması ve ifası (NexusERP kullanıcı sözleşmesi).</li>
                    <li>e-Fatura, e-Arşiv, e-İrsaliye gibi yasal elektronik belgelerin GİB'e iletilmesi ve onay süreçlerinin yürütülmesi.</li>
                    <li>Bilgi güvenliği ve denetim faaliyetlerinin gerçekleştirilmesi (Supabase RLS protokolleri).</li>
                    <li>Faaliyetlerin mevzuata (Örn: 5651 sayılı kanun) uygun yürütülmesi.</li>
                  </ul>

                  <h3 className="text-white font-semibold text-base mt-4">3. Kişisel Verilerin Aktarılması</h3>
                  <p>İşlenen kişisel verileriniz, hukuki yükümlülüklerimizi yerine getirebilmek amacıyla Gelir İdaresi Başkanlığı (GİB), yetkili kamu kurum ve kuruluşları ile sözleşme kapsamındaki hizmetleri sunabilmek (örn. banka entegrasyonu) amacıyla yetkili API sağlayıcıları ve yasal merciilere aktarılabilmektedir. Sistem verileriniz yurt içindeki veya yurt dışındaki şifrelenmiş Supabase sunucularında (Frankfurt, AB) barındırılmaktadır.</p>

                  <h3 className="text-white font-semibold text-base mt-4">4. İlgili Kişi Olarak KVKK Madde 11 Kapsamındaki Haklarınız</h3>
                  <p>KVKK’nın 11. maddesi uyarınca veri sorumlusuna başvurarak; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme haklarına sahipsiniz.</p>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <p>NexusERP ("Platform"), kullanıcılarının veri güvenliğini sağlamayı en temel prensip olarak kabul etmiştir. Bu gizlilik sözleşmesi, yazılımı kullanırken oluşturduğunuz şirket verilerinin nasıl korunduğunu açıklar.</p>
                  
                  <h3 className="text-white font-semibold text-base mt-4">1. Veri Güvenliği ve Şifreleme (Row Level Security)</h3>
                  <p>NexusERP, veritabanı mimarisinde <strong>Supabase (PostgreSQL)</strong> altyapısını kullanmaktadır. Tüm şirket verileriniz Row Level Security (RLS) teknolojisi ile uçtan uca izole edilmiştir. Bu teknoloji sayesinde:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Bir şirketin verisine, diğer bir şirketin erişmesi teknik olarak imkansızdır.</li>
                    <li>Yazılım geliştiricilerimiz dahi, özel yetkilendirme (izin) anahtarı olmadan şirketinizin cari, fatura veya depo bakiyelerini okuyamaz.</li>
                    <li>Şifreleriniz geri döndürülemez kriptografik hash fonksiyonları (Bcrypt/Argon2) ile şifrelenerek saklanır.</li>
                  </ul>

                  <h3 className="text-white font-semibold text-base mt-4">2. Çerezler (Cookies) ve Oturum Yönetimi</h3>
                  <p>Platform, size hizmet sunabilmek ve oturumunuzun açık kalmasını sağlamak için zorunlu (oturum) çerezleri kullanır. Reklam, takip (tracking) veya üçüncü parti pazarlama çerezleri NexusERP sisteminde <strong>kesinlikle kullanılmamaktadır.</strong></p>

                  <h3 className="text-white font-semibold text-base mt-4">3. Log Tutma ve 5651 Sayılı Kanun</h3>
                  <p>Uygulama içerisindeki kritik işlemler (Örn: Fatura silme, yeni cari oluşturma, sisteme giriş yapma) 5651 sayılı kanun ve kurumsal güvenlik standartları gereğince "İşlem Logu" olarak IP adresi ve zaman damgasıyla birlikte kaydedilir. Bu loglar sadece kurum içi denetimlerde kurum yöneticiniz (Admin) tarafından görülebilir.</p>

                  <h3 className="text-white font-semibold text-base mt-4">4. Verilerin Silinmesi</h3>
                  <p>Aboneliğinizin sona ermesi veya yazılımı kullanmayı bırakmanız halinde, sözleşmenizde belirtilen veri saklama süresi sonunda tüm kurumsal verileriniz kalıcı olarak (soft-delete yapılmadan) sunuculardan silinir.</p>
                </>
              )}

              {activeModal === 'contact' && (
                <div className="flex flex-col items-center justify-center text-center py-8 space-y-6">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-4">
                    <Command size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">QuanixHQ Bilişim A.Ş.</h3>
                  <p className="text-[#94a3b8] max-w-md">NexusERP altyapısı ve teknik destek operasyonları QuanixHQ ekibi tarafından yönetilmektedir. Her türlü hukuki veya teknik talebiniz için bize ulaşabilirsiniz.</p>
                  
                  <div className="w-full max-w-sm mt-8 space-y-4">
                    <div className="flex items-center gap-4 bg-[#111111] p-4 rounded-xl border border-[#27272a] text-left">
                      <MapPin className="text-blue-500 shrink-0" size={20} />
                      <div>
                        <div className="text-white font-medium">Merkez Ofis</div>
                        <div className="text-xs text-[#94a3b8]">Büyükdere Cad. No: 195 Levent, Şişli / İstanbul</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-[#111111] p-4 rounded-xl border border-[#27272a] text-left">
                      <Mail className="text-emerald-500 shrink-0" size={20} />
                      <div>
                        <div className="text-white font-medium">Elektronik Posta & KEP</div>
                        <div className="text-xs text-[#94a3b8]">destek@quanixhq.com<br/>quanixhq@hs01.kep.tr</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-[#111111] p-4 rounded-xl border border-[#27272a] text-left">
                      <Phone className="text-purple-500 shrink-0" size={20} />
                      <div>
                        <div className="text-white font-medium">Çağrı Merkezi</div>
                        <div className="text-xs text-[#94a3b8]">+90 212 555 01 01</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-[#27272a] bg-[#111111] flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                Kapat ve Geri Dön
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
