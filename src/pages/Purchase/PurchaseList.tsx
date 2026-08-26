import { Search, Plus, Filter, Download, CheckCircle2, AlertCircle, Clock, FileText } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useDataStore } from '../../store/useDataStore';
import { useState } from 'react';
import { toast } from 'sonner';
import { downloadCSV } from '../../lib/exportUtils';

export default function PurchaseList() {
  const { openDrawer } = useUIStore();
  const { purchases } = useDataStore();
  const [search, setSearch] = useState('');

  const filtered = purchases.filter(item => 
    item.supplier.toLowerCase().includes(search.toLowerCase()) || 
    item.poNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Satınalma Siparişleri</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Tedarikçi siparişleri, teklif değerlendirmeleri ve onay süreçleri.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toast.info('Detaylı filtreleme menüsü yapım aşamasında.')}
            className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#27272a] rounded-lg text-sm hover:bg-[#27272a] transition-colors"
          >
            <Filter size={16} /> Filtrele
          </button>
          <button 
            onClick={() => {
              downloadCSV(filtered, 'Satin_Alma_Siparisleri');
              toast.success('Sipariş kayıtları başarıyla dışa aktarıldı.');
            }}
            className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#27272a] rounded-lg text-sm hover:bg-[#27272a] transition-colors"
          >
            <Download size={16} /> Dışa Aktar
          </button>
          <button onClick={() => openDrawer('NEW_PURCHASE')} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <Plus size={16} /> Yeni Talep
          </button>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#27272a] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center bg-[#0a0a0a] border border-[#27272a] rounded-md px-3 py-1.5 w-80 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <Search size={16} className="text-[#64748b] mr-2" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Sipariş No, Tedarikçi ara..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-[#52525b]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#94a3b8] uppercase bg-[#0a0a0a]/50 border-b border-[#27272a]">
              <tr>
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">Sipariş No</th>
                <th className="px-4 py-3 font-medium">Tedarikçi</th>
                <th className="px-4 py-3 font-medium">İçerik Özeti</th>
                <th className="px-4 py-3 font-medium text-right">Toplam Tutar</th>
                <th className="px-4 py-3 font-medium">Onay Durumu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {filtered.map((row) => {
                const isOk = row.status === 'Onaylandı';
                const isWait = row.status === 'Yönetim Onayı Bekliyor';
                return (
                <tr key={row.id} className="hover:bg-[#27272a]/50 transition-colors group cursor-pointer animate-in fade-in">
                  <td className="px-4 py-3 whitespace-nowrap text-[#94a3b8]">{row.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono font-medium text-white group-hover:text-blue-400 transition-colors">{row.poNumber}</td>
                  <td className="px-4 py-3 font-medium text-white truncate max-w-[200px]">{row.supplier}</td>
                  <td className="px-4 py-3 text-[#94a3b8] text-xs truncate max-w-[200px]">{row.items}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap font-semibold text-white">
                    {row.total}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap flex items-center gap-2">
                     <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border border-[#27272a]/50 ${isOk ? 'bg-emerald-500/10 text-emerald-500' : isWait ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                        {isOk ? <CheckCircle2 size={14}/> : isWait ? <Clock size={14}/> : <AlertCircle size={14}/>}
                        {row.status}
                     </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
