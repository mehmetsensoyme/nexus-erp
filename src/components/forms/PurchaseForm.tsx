import { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useUIStore } from '../../store/useUIStore';

export default function PurchaseForm() {
  const { addPurchase } = useDataStore();
  const { closeDrawer } = useUIStore();
  
  const [formData, setFormData] = useState({ supplier: 'XYZ Dağıtım Pazarlama Ltd. Şti.', items: 'Sunucu Test Cihazı', total: '0,00 ₺' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPurchase({
      date: new Date().toISOString().split('T')[0],
      poNumber: `SAT-2026-0${Math.floor(100 + Math.random() * 900)}`,
      supplier: formData.supplier,
      items: formData.items + ' (1 Kalem)',
      total: formData.total,
      status: 'Yönetim Onayı Bekliyor'
    });
    closeDrawer();
  };

  return (
    <form id="drawer-form" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[#94a3b8] mb-1">Tedarikçi Seçimi</label>
        <select value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors">
          <option>XYZ Dağıtım Pazarlama Ltd. Şti.</option>
          <option>Global Endüstri A.Ş.</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#94a3b8] mb-1">Talep Edilen Ana Kalem</label>
        <input required type="text" value={formData.items} onChange={e => setFormData({...formData, items: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#94a3b8] mb-1">Tahmini Toplam Tutar</label>
        <input required type="text" value={formData.total} onChange={e => setFormData({...formData, total: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
      </div>
    </form>
  );
}
