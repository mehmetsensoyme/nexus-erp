import { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useUIStore } from '../../store/useUIStore';

export default function DepotForm() {
  const { addDepot } = useDataStore();
  const { closeDrawer } = useUIStore();
  
  const [formData, setFormData] = useState({ source: 'MERKEZ.DEPO', target: 'URETIM.HATT', code: '', qty: 1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return;
    
    addDepot({
      date: new Date().toISOString().split('T')[0],
      docNo: `TR-2026-${Math.floor(100 + Math.random() * 900)}`,
      source: formData.source,
      target: formData.target,
      code: formData.code,
      name: 'Tanımsız Malzeme',
      qty: formData.qty,
      unit: 'Adet',
      status: 'Beklemede'
    });
    closeDrawer();
  };

  return (
    <form id="drawer-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-[#27272a] pb-4">
        <div>
          <label className="block text-xs font-medium text-amber-500 mb-1">Çıkış Ambarı (Kaynak)</label>
          <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors">
            <option>MERKEZ.DEPO</option>
            <option>ULU.RIGOL.DEPO</option>
            <option>TEDARIK.DEPO</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-emerald-500 mb-1">Giriş Ambarı (Hedef)</label>
          <select value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors">
            <option>URETIM.HATT</option>
            <option>MERKEZ.DEPO</option>
            <option>HURDA.DEPO</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-[#94a3b8] mb-1">Malzeme Kodu</label>
        <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" placeholder="Örn: KBL-045" />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#94a3b8] mb-1">Miktar</label>
        <input type="number" required value={formData.qty} onChange={e => setFormData({...formData, qty: parseInt(e.target.value)})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
      </div>
    </form>
  );
}
