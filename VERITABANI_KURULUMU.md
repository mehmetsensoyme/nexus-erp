# Nexus ERP - Supabase Veritabanı Tam Kurulum Dosyası

Aşağıdaki SQL kodunu tamamen kopyalayıp Supabase **SQL Editor** ekranında çalıştırabilirsiniz. Bu kod, daha önce oluşmuş hataları temizler ve sonsuz döngü (infinite recursion) problemini çözen en güncel mimariyi kurar.

```sql
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
```
