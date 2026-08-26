import re

with open('src/components/Changelog.tsx', 'r') as f:
    code = f.read()

new_log = """const logs = [
  {
    version: 'v0.2.0-beta',
    date: '27 Ağustos 2026',
    title: 'Şemsiye ERP Mimarisi, Akıllı Menü ve Premium Login',
    icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    changes: [
      'Giriş Ekranı (Login) eklendi: Füme-siyah katmanlı tasarım, şifremi unuttum akışı ve detaylı hukuki pencereler (KVKK, Gizlilik) sisteme kazandırıldı.',
      'Sistem tamamen Mobil (Responsive) uyumlu hale getirildi. Sol menü mobilde hamburger butona ve çekmeceye (backdrop) taşındı.',
      'Modül Yönetimi: İkmal, Destek (Ticket), B2B, Lojistik, Açık Bankacılık dahil 12 yeni modül (App Store mantığıyla) sisteme eklendi.',
      'Kişiselleştirilebilir Sol Menü: Sık kullanılanlar (Favoriler) alanı ve A-Z / Son Kullanılana Göre akıllı sıralama yeteneği eklendi.',
      'Akıllı Dashboard: Ana ekran KPI (Özet) kartları, aktif edilen modüllere (Örn: Bakımdaki Araçlar, Açık Biletler) göre otomatik tepki verir hale getirildi.',
      'Admin Paneli geliştirmeleri: Local-first şirket logosu yükleme ve Kullanıcı Yetki/Rol (RBAC) önizleme alanları Ayarlar kısmına eklendi.'
    ]
  },
  {"""

code = code.replace("const logs = [\n  {", new_log)

with open('src/components/Changelog.tsx', 'w') as f:
    f.write(code)
