import { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useUIStore } from '../../store/useUIStore';

export default function InvoiceForm() {
  const { addInvoice } = useDataStore();
  const { closeDrawer } = useUIStore();
  const [formData, setFormData] = useState({ company: 'ABC Teknoloji San. ve Tic. A.Ş.', amount: '0,00 ₺' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice({
      date: new Date().toISOString().split('T')[0],
      type: 'SATIŞ',
      eType: 'e-Fatura',
      no: `GIB2026${Math.floor(100000000 + Math.random() * 900000000)}`,
      company: formData.company,
      amount: formData.amount,
      status: 'Taslak'
    });
    closeDrawer();
  };

  return (
    <form id="drawer-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Fatura Tipi</label>
          <select className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors">
            <option>SATIŞ</option>
            <option>İADE</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#94a3b8] mb-1">Cari Seçimi</label>
        <select 
          onChange={(e) => setFormData({...formData, company: e.target.value})}
          className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
        >
          <option>ABC Teknoloji San. ve Tic. A.Ş.</option>
          <option>Mega Endüstriyel Çözümler</option>
          <option>Yeni Cari (Sistem Testi)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#94a3b8] mb-1">Tutar Örneği (Manuel)</label>
        <input 
          type="text" 
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
        />
      </div>
    </form>
  );
}
