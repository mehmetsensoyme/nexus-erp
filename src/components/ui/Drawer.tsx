import { X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import ContactForm from '../forms/ContactForm';
import PurchaseForm from '../forms/PurchaseForm';
import InvoiceForm from '../forms/InvoiceForm';
import DepotForm from '../forms/DepotForm';
import ProfileForm from '../forms/ProfileForm';
import SettingsForm from '../forms/SettingsForm';
import InventoryForm from '../forms/InventoryForm';
import Changelog from '../Changelog';

export default function Drawer() {
  const { activeDrawer, closeDrawer } = useUIStore();
  
  if (activeDrawer === 'NONE') return null;

  const renderContent = () => {
    switch(activeDrawer) {
      case 'NEW_CONTACT': return <ContactForm />;
      case 'NEW_PURCHASE': return <PurchaseForm />;
      case 'NEW_INVENTORY': return <InventoryForm />;
      case 'NEW_INVOICE': return <InvoiceForm />;
      case 'NEW_DEPOT_TRANSFER': return <DepotForm />;
      case 'PROFILE': return <ProfileForm />;
      case 'SETTINGS': return <SettingsForm />;
      case 'CHANGELOG': return <Changelog />;
      default: return null;
    }
  };

  const title = {
    'NEW_CONTACT': useUIStore.getState().editingId ? 'Cari Kartı Düzenle' : 'Yeni Cari Kart',
    'NEW_PURCHASE': 'Yeni Satınalma Talebi',
    'NEW_INVENTORY': useUIStore.getState().editingId ? 'Stok Kartını Düzenle' : 'Yeni Stok Kartı',
    'NEW_INVOICE': 'Yeni GİB Faturası Kes',
    'NEW_DEPOT_TRANSFER': 'Yeni Depo Transfer Fişi',
    'PROFILE': 'Kullanıcı Profili',
    'SETTINGS': 'Sistem Ayarları',
    'CHANGELOG': 'Güncelleme Geçmişi (Sürüm Notları)'
  }[activeDrawer];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[2px] transition-all sm:p-4">
      <div 
        className="absolute inset-0" 
        onClick={closeDrawer}
      ></div>
      <div className="relative w-full sm:w-[500px] h-full bg-[#111111] border border-[#27272a] sm:rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#27272a]">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={closeDrawer} className="p-2 text-[#94a3b8] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-0 custom-scrollbar bg-[#111111]">
          <div className="p-5">
            {renderContent()}
          </div>
        </div>
        <div className="p-5 border-t border-[#27272a] flex justify-end gap-3 bg-[#0a0a0a]">
          <button onClick={closeDrawer} className="px-4 py-2 rounded-lg text-sm font-medium text-[#94a3b8] hover:text-white border border-[#27272a] hover:bg-[#27272a] transition-colors">
            Kapat
          </button>
          {activeDrawer !== 'CHANGELOG' && (
            <button type="submit" form="drawer-form" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
              Kaydet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
