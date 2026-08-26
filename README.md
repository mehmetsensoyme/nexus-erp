<div align="center">
  <img src="public/favicon.svg" alt="Nexus Logo" width="100" />
  
  # Nexus ERP
  **Yeni Nesil Kurumsal Yönetim ve Planlama Platformu**

  [![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-State-yellow?style=for-the-badge&logo=react)](https://github.com/pmndrs/zustand)
  [![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

  *Modern, modüler, güvenli ve tamamen size özel.*
</div>

---

## 🚀 Proje Hakkında

**Nexus ERP**, işletmelerin tüm operasyonel süreçlerini tek bir merkezden yönetebilmesi için tasarlanmış yeni nesil bir B2B SaaS platformudur. Eski nesil, hantal ve karmaşık ERP sistemlerinin aksine; Nexus, modern arayüzü (OLED Dark UI), akıllı kişiselleştirme özellikleri ve yüksek performansıyla dikkat çeker.

"Şemsiye ERP" vizyonuyla geliştirilen sistem, içerisinde İnsan Kaynaklarından Makine İkmal'e, e-Fatura'dan B2B Bayi Portalı'na kadar 12'den fazla devasa modül barındırır.

---

## 📸 Ekran Görüntüleri

Sistemin sunduğu premium arayüz deneyimi:

### 1. White-Label Giriş Ekranı (Login)
*Şirket logosunun yüklenebildiği, hukuki metinlerle donatılmış füme-siyah katmanlı tasarım.*
![Giriş Ekranı](docs/login.png)

### 2. Akıllı Ana Ekran (Dashboard)
*Aktif edilen modüllere göre otomatik şekillenen (Örn: Bakımdaki araçlar, açık biletler) analitik merkez.*
![Ana Ekran](docs/dashboard.png)

### 3. Kişiselleştirilebilir Sol Menü
*Favorilere (Sık Kullanılanlar) ekleme ve A-Z veya Son Kullanılana göre akıllı sıralama yeteneği.*
![Modüler Menü](docs/sidebar.png)

### 4. Kusursuz Mobil Deneyim
*IOS ve Android cihazlar için optimize edilmiş yatay formlar ve çekmece (Drawer) navigasyonu.*
![Mobil Görünüm](docs/mobile.png)

*(Not: Görüntülerin aktif olması için sistemden aldığınız ekran görüntülerini `docs/` klasörüne aynı isimlerle kaydetmeniz yeterlidir.)*

---

## 🎯 Temel Özellikler

- **🧩 Modüler (App Store) Mimarisi:** İhtiyacınız olmayan modülleri tek tuşla kapatın. Arayüz sadece aktif modüllere göre kendini şekillendirir.
- **📱 Native Mobil Hissiyatı:** Sistem tarayıcıda çalışmasına rağmen, telefonlarda tıpkı yerleşik bir mobil uygulama gibi (100dvh) davranır. Hover (üzerine gelme) kısıtlamaları kaldırılmış, mobil dokunmatik hedefler büyütülmüştür.
- **🔒 Güvenlik & Hukuki Altyapı:** KVKK, Gizlilik Politikası ve Şifre sıfırlama süreçleri UI seviyesinde hazırlandı. Veritabanı aşamasında **Supabase Row Level Security (RLS)** ile uçtan uca veri yalıtımı sağlanacaktır.
- **⚡ Akıllı Sıralama & Kısayollar:** Personelin kullanım alışkanlıklarını öğrenerek en çok girilen modülleri menünün en üstüne taşır.

---

## 💻 Kullanılan Teknolojiler (Tech Stack)

* **Ön Yüz (Frontend):** React 18, Vite, TypeScript
* **Stil & Tasarım:** Tailwind CSS v4, Lucide React (İkonlar), Recharts (Grafikler)
* **Durum Yönetimi (State):** Zustand
* **Arka Plan & Veritabanı:** Supabase (PostgreSQL) - *Entegrasyon Aşamasında*

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1. Depoyu bilgisayarınıza kopyalayın:
   ```bash
   git clone https://github.com/mehmetsensoyme/nexus-erp.git
   ```

2. Proje dizinine girin ve bağımlılıkları yükleyin:
   ```bash
   cd nexus-erp
   npm install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

---
<div align="center">
  <p>Bu altyapı <b>QuanixHQ</b> tarafından geliştirilmiştir.</p>
</div>
