-- 1. ŞİRKETLER (COMPANIES) TABLOSU
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tax_no TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. KULLANICILAR (PROFILES) TABLOSU
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. GÜVENLİK (RLS) AKTİVASYONU
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. YARDIMCI GÜVENLİK FONKSİYONU (SONSUZ DÖNGÜYÜ ENGELLER)
CREATE OR REPLACE FUNCTION public.get_auth_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 5. ESKİ KURALLARI SİLME (Çakışmayı önlemek için)
DROP POLICY IF EXISTS "Kullanıcılar şirket oluşturabilir" ON companies;
DROP POLICY IF EXISTS "Kullanıcılar kendi şirketini görebilir" ON companies;
DROP POLICY IF EXISTS "Kullanıcılar kendi şirketini güncelleyebilir" ON companies;
DROP POLICY IF EXISTS "Kullanıcılar kendi şirketlerini görebilir" ON companies;

DROP POLICY IF EXISTS "Kullanıcılar profil ekleyebilir" ON profiles;
DROP POLICY IF EXISTS "Kullanıcılar profillerini görebilir" ON profiles;
DROP POLICY IF EXISTS "Kullanıcılar kendi profilini güncelleyebilir" ON profiles;
DROP POLICY IF EXISTS "Kullanıcılar kendi şirketindeki personelleri görebilir" ON profiles;

-- 6. YENİ ŞİRKET KURALLARI (COMPANIES)
CREATE POLICY "Kullanıcılar şirket oluşturabilir" ON companies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Kullanıcılar kendi şirketini görebilir" ON companies FOR SELECT USING (id = public.get_auth_company_id());
CREATE POLICY "Kullanıcılar kendi şirketini güncelleyebilir" ON companies FOR UPDATE USING (id = public.get_auth_company_id());

-- 7. YENİ PROFİL KURALLARI (PROFILES)
CREATE POLICY "Kullanıcılar profil ekleyebilir" ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Kullanıcılar profillerini görebilir" ON profiles FOR SELECT USING (id = auth.uid() OR company_id = public.get_auth_company_id());
CREATE POLICY "Kullanıcılar kendi profilini güncelleyebilir" ON profiles FOR UPDATE USING (id = auth.uid());

-- 8. KULLANICI OLUŞTURULDUĞUNDA OTOMATİK PROFİL AÇAN TETİKLEYİCİ (TRIGGER)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Sistem Yöneticisi'), 
    'admin'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. KURULUM SİHİRBAZI İÇİN GÜVENLİ FONKSİYON (RPC)
CREATE OR REPLACE FUNCTION public.complete_onboarding(company_name TEXT, company_tax_no TEXT)
RETURNS UUID AS $$
DECLARE
  new_company_id UUID;
BEGIN
  INSERT INTO public.companies (name, tax_no) 
  VALUES (company_name, company_tax_no) 
  RETURNING id INTO new_company_id;
  
  INSERT INTO public.profiles (id, company_id, full_name, role)
  VALUES (
    auth.uid(), 
    new_company_id, 
    'Sistem Yöneticisi', 
    'admin'
  )
  ON CONFLICT (id) DO UPDATE 
  SET company_id = new_company_id;
  
  RETURN new_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. CARİ KARTLAR (MÜŞTERİ & TEDARİKÇİ) TABLOSU
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('CUSTOMER', 'SUPPLIER')),
  name TEXT NOT NULL,
  tax_number TEXT,
  tax_office TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Carileri görebilir" ON public.contacts;
DROP POLICY IF EXISTS "Cari ekleyebilir" ON public.contacts;
DROP POLICY IF EXISTS "Cari güncelleyebilir" ON public.contacts;
DROP POLICY IF EXISTS "Cari silebilir" ON public.contacts;

CREATE POLICY "Carileri görebilir" ON public.contacts FOR SELECT USING (company_id = public.get_auth_company_id());
CREATE POLICY "Cari ekleyebilir" ON public.contacts FOR INSERT WITH CHECK (company_id = public.get_auth_company_id());
CREATE POLICY "Cari güncelleyebilir" ON public.contacts FOR UPDATE USING (company_id = public.get_auth_company_id());
CREATE POLICY "Cari silebilir" ON public.contacts FOR DELETE USING (company_id = public.get_auth_company_id());
