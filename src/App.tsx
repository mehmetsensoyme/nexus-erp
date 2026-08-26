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

function App() {
  const { themeMode, isAuthenticated } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    const isDark = themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
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
        {/* Fallback */}
        <Route path="*" element={<div className="flex h-96 items-center justify-center text-[#94a3b8]">404 - Sayfa Bulunamadı</div>} />
      </Route>
    </Routes>
  );
}

export default App;
