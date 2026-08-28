import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import DepotTransfer from './pages/Depot/DepotTransfer';
import InvoiceList from './pages/Invoice/InvoiceList';
import ContactsList from './pages/Contacts/ContactsList';
import PurchaseList from './pages/Purchase/PurchaseList';
import InventoryList from './pages/Inventory/InventoryList';
import SalesList from './pages/Sales/SalesList';
import FinanceList from './pages/Finance/FinanceList';
import ManufacturingList from './pages/Manufacturing/ManufacturingList';
import HRList from './pages/HR/HRList';
import ReportsList from './pages/Reports/ReportsList';
import ProjectsList from './pages/Projects/ProjectsList';
import B2BList from './pages/B2B/B2BList';
import LogisticsList from './pages/Logistics/LogisticsList';
import BankingList from './pages/Banking/BankingList';
import TicketsList from './pages/Tickets/TicketsList';
import SubscriptionsList from './pages/Subscriptions/SubscriptionsList';
import MarketingList from './pages/Marketing/MarketingList';
import FleetList from './pages/Fleet/FleetList';
import { useEffect } from 'react';
import { useUIStore } from './store/useUIStore';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import { Toaster } from 'react-hot-toast';
import { MonitorSmartphone, Wrench, FileCheck, ShoppingBag, Archive, Receipt, FileSignature, Landmark } from 'lucide-react';


// Mega ERP Yeni Modüller (Placeholder)
const PosList = () => <div className="flex h-96 flex-col items-center justify-center text-[#94a3b8] space-y-4"><div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#27272a] flex items-center justify-center"><MonitorSmartphone size={32} className="text-blue-500" /></div><div className="text-xl font-medium text-white">Hızlı Satış (POS)</div><div>Bu modül Supabase entegrasyonu sonrası aktif edilecektir.</div></div>;
const FieldServiceList = () => <div className="flex h-96 flex-col items-center justify-center text-[#94a3b8] space-y-4"><div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#27272a] flex items-center justify-center"><Wrench size={32} className="text-blue-500" /></div><div className="text-xl font-medium text-white">Saha Servis</div><div>Bu modül Supabase entegrasyonu sonrası aktif edilecektir.</div></div>;
const QualityList = () => <div className="flex h-96 flex-col items-center justify-center text-[#94a3b8] space-y-4"><div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#27272a] flex items-center justify-center"><FileCheck size={32} className="text-blue-500" /></div><div className="text-xl font-medium text-white">Kalite Kontrol</div><div>Bu modül Supabase entegrasyonu sonrası aktif edilecektir.</div></div>;
const EcommerceList = () => <div className="flex h-96 flex-col items-center justify-center text-[#94a3b8] space-y-4"><div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#27272a] flex items-center justify-center"><ShoppingBag size={32} className="text-blue-500" /></div><div className="text-xl font-medium text-white">E-Ticaret & Pazaryeri</div><div>Bu modül Supabase entegrasyonu sonrası aktif edilecektir.</div></div>;
const AssetsList = () => <div className="flex h-96 flex-col items-center justify-center text-[#94a3b8] space-y-4"><div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#27272a] flex items-center justify-center"><Archive size={32} className="text-blue-500" /></div><div className="text-xl font-medium text-white">Demirbaş ve Zimmet</div><div>Bu modül Supabase entegrasyonu sonrası aktif edilecektir.</div></div>;
const ExpensesList = () => <div className="flex h-96 flex-col items-center justify-center text-[#94a3b8] space-y-4"><div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#27272a] flex items-center justify-center"><Receipt size={32} className="text-blue-500" /></div><div className="text-xl font-medium text-white">Masraf Yönetimi</div><div>Bu modül Supabase entegrasyonu sonrası aktif edilecektir.</div></div>;
const ContractsList = () => <div className="flex h-96 flex-col items-center justify-center text-[#94a3b8] space-y-4"><div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#27272a] flex items-center justify-center"><FileSignature size={32} className="text-blue-500" /></div><div className="text-xl font-medium text-white">Sözleşme Yönetimi</div><div>Bu modül Supabase entegrasyonu sonrası aktif edilecektir.</div></div>;
const EDevletList = () => <div className="flex h-96 flex-col items-center justify-center text-[#94a3b8] space-y-4"><div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#27272a] flex items-center justify-center"><Landmark size={32} className="text-blue-500" /></div><div className="text-xl font-medium text-white">e-Devlet Entegrasyonları</div><div>Bu modül Supabase entegrasyonu sonrası aktif edilecektir.</div></div>;

function App() {
  const { themeMode, isAuthenticated, isLoadingAuth, checkSession, userProfile } = useUIStore();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  if (isLoadingAuth) {
    return <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white">Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </>
    );
  }


  // Eğer giriş yapmış ama şirketi yoksa kurulum ekranına zorla
  if (isAuthenticated && (!userProfile || !userProfile.company_id)) {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="*" element={<Onboarding />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/ana-ekran" replace />} />
        <Route path="ana-ekran" element={<Dashboard />} />
        <Route path="satis" element={<SalesList />} />
        <Route path="satinalma" element={<PurchaseList />} />
        <Route path="stoklar" element={<InventoryList />} />
        <Route path="depo" element={<DepotTransfer />} />
        <Route path="uretim" element={<ManufacturingList />} />
        <Route path="fatura" element={<InvoiceList />} />
        <Route path="finans" element={<FinanceList />} />
        <Route path="bankacilik" element={<BankingList />} />
        <Route path="cari" element={<ContactsList />} />
        <Route path="ik" element={<HRList />} />
        <Route path="ikmal" element={<FleetList />} />
        <Route path="projeler" element={<ProjectsList />} />
        <Route path="b2b" element={<B2BList />} />
        <Route path="kargo" element={<LogisticsList />} />
        <Route path="destek" element={<TicketsList />} />
        <Route path="abonelik" element={<SubscriptionsList />} />
        <Route path="pazarlama" element={<MarketingList />} />
        <Route path="raporlar" element={<ReportsList />} />
        <Route path="pos" element={<PosList />} />
        <Route path="field-service" element={<FieldServiceList />} />
        <Route path="quality" element={<QualityList />} />
        <Route path="ecommerce" element={<EcommerceList />} />
        <Route path="assets" element={<AssetsList />} />
        <Route path="expenses" element={<ExpensesList />} />
        <Route path="contracts" element={<ContractsList />} />
        <Route path="edevlet" element={<EDevletList />} />
        {/* Fallback */}
        <Route path="*" element={<div className="flex h-96 items-center justify-center text-[#94a3b8]">404 - Sayfa Bulunamadı</div>} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
