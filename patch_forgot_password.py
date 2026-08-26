import re

with open('src/pages/Login.tsx', 'r') as f:
    code = f.read()

# 1. Add ArrowLeft icon
code = code.replace("Mail } from 'lucide-react';", "Mail, ArrowLeft } from 'lucide-react';")

# 2. Add authMode state
if "authMode" not in code:
    code = code.replace("const [isLoading, setIsLoading] = useState(false);", "const [isLoading, setIsLoading] = useState(false);\n  const [authMode, setAuthMode] = useState<'login' | 'forgot_password'>('login');")

# 3. Add handleResetPassword logic
if "handleResetPassword" not in code:
    logic = """
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
      setAuthMode('login');
    }, 1500);
  };
"""
    code = code.replace("const handleLogin = (e: React.FormEvent) => {", logic + "\n  const handleLogin = (e: React.FormEvent) => {")

# 4. Replace the right side form wrapper with conditional render
old_form = """<div className="w-full max-w-[400px]">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Hoş Geldiniz</h2>
            <p className="text-[#94a3b8]">Devam etmek için kurumsal hesabınıza giriş yapın.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">"""

new_form = """<div className="w-full max-w-[400px]">
          {authMode === 'login' ? (
            <>
              <div className="mb-10 text-center md:text-left animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Hoş Geldiniz</h2>
                <p className="text-[#94a3b8]">Devam etmek için kurumsal hesabınıza giriş yapın.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">"""

code = code.replace(old_form, new_form)

# 5. Fix the "Şifremi Unuttum" link in the login form
old_forgot_link = '<a href="#" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">Şifremi Unuttum</a>'
new_forgot_link = '<button type="button" onClick={() => setAuthMode(\'forgot_password\')} className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">Şifremi Unuttum</button>'
code = code.replace(old_forgot_link, new_forgot_link)

# 6. Add the else branch for the forgot_password form
old_form_end = """</form>

        </div>"""

new_form_end = """</form>
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

        </div>"""

code = code.replace(old_form_end, new_form_end)

with open('src/pages/Login.tsx', 'w') as f:
    f.write(code)
