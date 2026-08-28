import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUIStore } from '../store/useUIStore';
import toast from 'react-hot-toast';
import { Building2, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [companyName, setCompanyName] = useState('');
  const [taxNo, setTaxNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { checkSession } = useUIStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) {
      toast.error('Şirket adı zorunludur.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create the company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: companyName, tax_no: taxNo }])
        .select()
        .single();

      if (companyError) throw companyError;

      // 2. Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Oturum bulunamadı.');

      // 3. Update or Insert profile with company_id
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: session.user.id, 
          company_id: company.id,
          full_name: session.user.user_metadata?.full_name || 'Sistem Yöneticisi',
          role: 'admin'
        });

      if (profileError) throw profileError;

      toast.success('Şirketiniz başarıyla kuruldu!');
      
      // 4. Refresh session state so app knows we have a company now
      await checkSession();
      navigate('/ana-ekran');

    } catch (error: any) {
      toast.error('Kurulum sırasında hata oluştu: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative selection:bg-blue-500/30">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-xl bg-[#141414]/80 backdrop-blur-xl border border-[#27272a] rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Building2 size={32} className="text-white" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight text-white mb-3">Nexus'a Hoş Geldiniz</h1>
          <p className="text-[#94a3b8] text-sm md:text-base">
            Başlamak için şirketinizi sisteme kaydetmeniz gerekiyor. 
            Bu bilgiler fatura ve raporlarınızda kullanılacaktır.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Şirket Ünvanı <span className="text-red-500">*</span></label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#52525b] group-focus-within:text-blue-500 transition-colors">
                <Building2 size={18} />
              </div>
              <input 
                type="text" 
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Örn: Nexus Yazılım A.Ş."
                className="w-full bg-[#0a0a0a] hover:bg-[#111111] focus:bg-[#111111] border border-[#27272a] rounded-xl pl-12 pr-4 py-3.5 text-[15px] text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-[#52525b]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Vergi Numarası / TCKN</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#52525b] group-focus-within:text-blue-500 transition-colors">
                <FileText size={18} />
              </div>
              <input 
                type="text" 
                value={taxNo}
                onChange={(e) => setTaxNo(e.target.value)}
                placeholder="Örn: 1234567890"
                className="w-full bg-[#0a0a0a] hover:bg-[#111111] focus:bg-[#111111] border border-[#27272a] rounded-xl pl-12 pr-4 py-3.5 text-[15px] text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-[#52525b]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-gray-100 font-semibold rounded-xl py-3.5 px-4 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
          >
            {isLoading ? (
              <><Loader2 size={18} className="animate-spin" /> Kuruluyor...</>
            ) : (
              <>Kurulumu Tamamla ve Başla <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
