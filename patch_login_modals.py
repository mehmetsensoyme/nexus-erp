import re

with open('src/pages/Login.tsx', 'r') as f:
    code = f.read()

# Make sure lucide-react has X icon
code = code.replace("Building2 }", "Building2, X, FileText, Shield, MapPin, Phone, Mail }")

# Add state
code = code.replace("const fileInputRef = useRef<HTMLInputElement>(null);", "const [activeModal, setActiveModal] = useState<'kvkk' | 'privacy' | 'contact' | null>(null);")

# Update colors
# Root background: Füme siyah (zinc-900 / #18181b)
code = code.replace('className="min-h-screen bg-[#141414] flex flex-col md:flex-row relative selection:bg-blue-500/30"', 'className="min-h-screen bg-[#18181b] flex flex-col md:flex-row relative selection:bg-blue-500/30"')
# Left side: Daha koyu (pure black gradient #050505)
code = code.replace('bg-gradient-to-br from-[#0a0a0a] to-[#000000]', 'bg-gradient-to-br from-[#050505] to-[#000000]')
code = code.replace('bg-[#1c1c1f]', 'bg-[#27272a]/50') # Inputs on the right side stand out better against #18181b

# Update links to open modals
old_footer_links = """<a href="#" className="hover:text-[#94a3b8] transition-colors">KVKK Metni</a>
          <a href="#" className="hover:text-[#94a3b8] transition-colors">Gizlilik Sözleşmesi</a>
          <a href="#" className="hover:text-[#94a3b8] transition-colors">İletişim</a>"""
new_footer_links = """<button onClick={() => setActiveModal('kvkk')} className="hover:text-[#94a3b8] transition-colors">KVKK Aydınlatma Metni</button>
          <button onClick={() => setActiveModal('privacy')} className="hover:text-[#94a3b8] transition-colors">Gizlilik Politikası</button>
          <button onClick={() => setActiveModal('contact')} className="hover:text-[#94a3b8] transition-colors">İletişim Bilgileri</button>"""
code = code.replace(old_footer_links, new_footer_links)

# Modals UI
modals_ui = """
      {/* Legal Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#141414] border border-[#27272a] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95">
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
}"""

code = code.replace("    </div>\n  );\n}", modals_ui)

with open('src/pages/Login.tsx', 'w') as f:
    f.write(code)
