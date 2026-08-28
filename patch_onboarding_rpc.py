with open('src/pages/Onboarding.tsx', 'r') as f:
    code = f.read()

# Replace the multi-step insert and update with a single RPC call
old_logic = """      // 1. Create the company
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

      if (profileError) throw profileError;"""

new_logic = """      // Supabase RPC çağrısı: Şirketi oluşturup profili otomatik güncelleyen güvenli fonksiyon
      const { error: rpcError } = await supabase.rpc('complete_onboarding', {
        company_name: companyName,
        company_tax_no: taxNo
      });

      if (rpcError) throw rpcError;"""

code = code.replace(old_logic, new_logic)

with open('src/pages/Onboarding.tsx', 'w') as f:
    f.write(code)
