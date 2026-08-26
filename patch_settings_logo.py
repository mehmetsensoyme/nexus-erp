import re

with open('src/components/forms/SettingsForm.tsx', 'r') as f:
    code = f.read()

# Make sure Upload is imported
if 'Upload' not in code:
    code = code.replace("import { Bell, Globe, Building, DollarSign, Palette }", "import { Bell, Globe, Building, DollarSign, Palette, Upload }")

# Add the upload handler and ref
if 'fileInputRef' not in code:
    code = code.replace("export default function SettingsForm() {", "import { useRef } from 'react';\n\nexport default function SettingsForm() {")
    
    insert_logic = """  const { companyLogo, setCompanyLogo } = useUIStore();
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

  const handleSubmit ="""
    code = code.replace("  const handleSubmit =", insert_logic)

# Inject the logo upload UI into Şirket & Finans section
logo_ui = """      {/* Şirket & Finans Ayarları */}
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
        </div>"""

code = code.replace("""      {/* Şirket & Finans Ayarları */}
      <div className="border-t border-[#27272a] pt-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Building size={16} className="text-emerald-500" /> Şirket & Finans
        </h3>""", logo_ui)

with open('src/components/forms/SettingsForm.tsx', 'w') as f:
    f.write(code)
