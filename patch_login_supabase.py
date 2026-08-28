import re

with open('src/pages/Login.tsx', 'r') as f:
    code = f.read()

# Add supabase import and toast
if "import { supabase } from '../lib/supabase';" not in code:
    code = code.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { supabase } from '../lib/supabase';\nimport toast from 'react-hot-toast';")
elif "import toast from 'react-hot-toast';" not in code:
    code = code.replace("import { supabase } from '../lib/supabase';", "import { supabase } from '../lib/supabase';\nimport toast from 'react-hot-toast';")

# Replace handleLogin
old_handleLogin = """  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login();
    }, 1500);
  };"""

new_handleLogin = """  const handleLogin = async (e: React.FormEvent) => {
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
        login();
      }
    } catch (err: any) {
      toast.error('Beklenmeyen bir hata oluştu.');
      setIsLoading(false);
    }
  };"""

code = code.replace(old_handleLogin, new_handleLogin)

with open('src/pages/Login.tsx', 'w') as f:
    f.write(code)
