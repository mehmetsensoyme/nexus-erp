import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import Drawer from '../ui/Drawer';
import { useUIStore } from '../../store/useUIStore';

const THEMES = {
  blue: { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', hex500: '#3b82f6', ring: '#3b82f680' },
  emerald: { 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', hex500: '#10b981', ring: '#10b98180' },
  indigo: { 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', hex500: '#6366f1', ring: '#6366f180' },
  rose: { 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', hex500: '#f43f5e', ring: '#f43f5e80' }
};

export default function AppLayout() {
  const { density, themeColor, themeMode } = useUIStore();
  
  // Custom hex color fallback
  const theme = THEMES[themeColor as keyof typeof THEMES] || {
    400: themeColor,
    500: themeColor,
    600: themeColor,
    700: themeColor,
    hex500: themeColor,
    ring: themeColor + '80'
  };

  useEffect(() => {
    // Global ölçeklendirme (Density)
    document.documentElement.style.fontSize = density === 'compact' ? '14px' : '16px';
  }, [density]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#0a0a0a] text-white w-full relative">
      {/* 
        KESİN ÇÖZÜM: Kaba Kuvvet Tema Ezici
        Tailwind derleyicisini tamamen atlayarak uygulamanın tüm mavi sınıflarını ezer.
        %10, %20 gibi saydamlık değerleri için HEX sonuna saydamlık kodları (1A, 33 vb.) eklenmiştir.
      */}
      <style>{`
        /* Arkaplanlar */
        .bg-blue-500 { background-color: ${theme[500]} !important; }
        .bg-blue-600 { background-color: ${theme[600]} !important; }
        .hover\\:bg-blue-700:hover { background-color: ${theme[700]} !important; }
        
        /* Metin ve Çerçeve */
        .text-blue-400 { color: ${theme[400]} !important; }
        .text-blue-500 { color: ${theme[500]} !important; }
        .group-hover\\:text-blue-400:hover { color: ${theme[400]} !important; }
        .border-blue-500 { border-color: ${theme[500]} !important; }
        
        /* Saydamlık (Opacity) Sınıfları */
        .bg-blue-500\\/10 { background-color: ${theme.hex500}1A !important; }
        .border-blue-500\\/20 { border-color: ${theme.hex500}33 !important; }
        
        /* Odaklanma ve Gölgeler */
        .focus-within\\:ring-blue-500:focus-within { --tw-ring-color: ${theme[500]} !important; }
        .ring-blue-500\\/30 { --tw-ring-color: ${theme.hex500}4D !important; }
        .ring-blue-500\\/50 { --tw-ring-color: ${theme.ring} !important; }
        .shadow-blue-500\\/20 { --tw-shadow-color: ${theme.hex500}33 !important; --tw-shadow: var(--tw-shadow-colored) !important; }
        
        /* Gradient (Profil vb. alanlar için) */
        .from-blue-600 { --tw-gradient-from: ${theme[600]} !important; }
        .from-blue-600\\/20 { --tw-gradient-from: ${theme[600]}33 !important; }

        /* BRUTE-FORCE LIGHT MODE OVERRIDES */
        :root:not(.dark) .bg-\\[\\#0a0a0a\\] { background-color: #f1f5f9 !important; }
        :root:not(.dark) .bg-\\[\\#0a0a0a\\]\\/50 { background-color: #f8fafc !important; }
        :root:not(.dark) .bg-\\[\\#0a0a0a\\]\\/80 { background-color: #ffffffcc !important; } /* Header */
        :root:not(.dark) .bg-\\[\\#111111\\] { background-color: #ffffff !important; border-color: #e2e8f0 !important; }
        :root:not(.dark) .bg-\\[\\#141414\\] { background-color: #ffffff !important; }
        :root:not(.dark) .bg-\\[\\#1a1a1a\\] { background-color: #f8fafc !important; }
        :root:not(.dark) .bg-\\[\\#27272a\\] { background-color: #e2e8f0 !important; }
        :root:not(.dark) .bg-\\[\\#27272a\\]\\/80 { background-color: #e2e8f0 !important; } /* Filter Pills */
        :root:not(.dark) .hover\\:bg-\\[\\#27272a\\]:hover { background-color: #e2e8f0 !important; }
        :root:not(.dark) .hover\\:bg-\\[\\#27272a\\]\\/50:hover { background-color: #f1f5f9 !important; }
        
        :root:not(.dark) .border-\\[\\#0a0a0a\\] { border-color: #f1f5f9 !important; }
        :root:not(.dark) .border-\\[\\#111111\\] { border-color: #ffffff !important; }
        :root:not(.dark) .border-\\[\\#27272a\\] { border-color: #e2e8f0 !important; }
        :root:not(.dark) .border-\\[\\#27272a\\]\\/50 { border-color: #f1f5f9 !important; }
        :root:not(.dark) .border-\\[\\#52525b\\] { border-color: #cbd5e1 !important; }
        :root:not(.dark) .divide-\\[\\#27272a\\] > :not([hidden]) ~ :not([hidden]) { border-color: #e2e8f0 !important; }
        
        /* Text Color Resets for Light Mode (Safeguarded) */
        :root:not(.dark) body, :root:not(.dark) .text-white { color: #0f172a !important; }
        :root:not(.dark) .text-\\[\\#94a3b8\\] { color: #475569 !important; }
        :root:not(.dark) .text-\\[\\#52525b\\] { color: #64748b !important; }
        
        /* Sidebar Logo Gradient Fix */
        :root:not(.dark) .from-white { --tw-gradient-from: #0f172a !important; }
        :root:not(.dark) .to-\\[\\#94a3b8\\] { --tw-gradient-to: #475569 !important; }

        /* Protection for Colored Elements in Light Mode */
        :root:not(.dark) .bg-blue-600,
        :root:not(.dark) .bg-blue-600 .text-white,
        :root:not(.dark) [class*="from-blue"],
        :root:not(.dark) [class*="from-blue"] .text-white,
        :root:not(.dark) .bg-emerald-600,
        :root:not(.dark) .bg-emerald-600 .text-white { 
          color: #ffffff !important; 
        }
      `}</style>
      <Toaster theme={themeMode === 'light' ? 'light' : 'dark'} position="bottom-right" />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl pb-4">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      <Drawer />
    </div>
  );
}
