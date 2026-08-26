with open('src/components/forms/SettingsForm.tsx', 'r') as f:
    code = f.read()

roles_section = """
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
"""

code = code.replace("{/* Menü Düzeni ve Sıralama */}", roles_section.strip())

with open('src/components/forms/SettingsForm.tsx', 'w') as f:
    f.write(code)
