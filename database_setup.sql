-- ==========================================
-- NEXUS ERP - MULTI-TENANT VERİTABANI KURULUMU
-- ==========================================

-- 1. ŞİRKETLER (COMPANIES) TABLOSU (Her müşteri bir şirkettir)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tax_no TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. KULLANICILAR (PROFILES) TABLOSU (Supabase Auth ile senkronize çalışır)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- GÜVENLİK & RLS (ROW LEVEL SECURITY)
-- ==========================================

-- Tablolar için RLS'yi aktif ediyoruz (Bunu yapmazsak herkes her şeyi görür)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- KURAL 1: Kullanıcılar SADECE kendi şirketlerinin (company_id) bilgilerini görebilir.
CREATE POLICY "Kullanıcılar kendi şirketlerini görebilir" ON companies
  FOR SELECT USING (
    id = (SELECT company_id FROM profiles WHERE profiles.id = auth.uid())
  );

-- KURAL 2: Kullanıcılar SADECE kendi şirketindeki diğer personelleri (profiles) görebilir.
CREATE POLICY "Kullanıcılar kendi şirketindeki personelleri görebilir" ON profiles
  FOR SELECT USING (
    company_id = (SELECT company_id FROM profiles WHERE profiles.id = auth.uid())
  );

-- KURAL 3: Kullanıcılar kendi profillerini güncelleyebilir.
CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" ON profiles
  FOR UPDATE USING ( id = auth.uid() );

-- ==========================================
-- TRİGGER: YENİ KAYIT (Supabase Auth tetikleyicisi)
-- ==========================================
-- Biri kayıt olduğunda otomatik olarak profiles tablosuna eklenmesi için:

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

