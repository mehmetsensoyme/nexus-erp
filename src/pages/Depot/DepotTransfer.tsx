import { Search, Plus, Filter, Download, ArrowRightLeft } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useDataStore } from '../../store/useDataStore';
import { useState } from 'react';
import { toast } from 'sonner';
import { downloadCSV } from '../../lib/exportUtils';

export default function DepotTransfer() {
  const { openDrawer } = useUIStore();
  const { depots } = useDataStore();
  const [search, setSearch] = useState('');

  const filtered = depots.filter(item => 
    item.code.toLowerCase().includes(search.toLowerCase()) || 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.docNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Depo Transferleri</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Ambarlar arası stok hareketleri ve transfer fişleri.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toast.info('Filtreleme paneli yakında eklenecek.')}
            className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#27272a] rounded-lg text-sm hover:bg-[#27272a] transition-colors"
          >
            <Filter size={16} /> Filtrele
          </button>
          <button 
            onClick={() => {
              downloadCSV(filtered, 'Depo_Transferleri');
              toast.success('Transfer kayıtları CSV olarak dışa aktarıldı.');
            }}
            className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#27272a] rounded-lg text-sm hover:bg-[#27272a] transition-colors"
          >
            <Download size={16} /> Dışa Aktar
          </button>
          <button onClick={() => openDrawer('NEW_DEPOT_TRANSFER')} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <Plus size={16} /> Yeni Transfer
          </button>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#27272a] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center bg-[#0a0a0a] border border-[#27272a] rounded-md px-3 py-1.5 w-72 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <Search size={16} className="text-[#64748b] mr-2" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Transfer no, malzeme kodu..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-[#52525b]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#94a3b8] uppercase bg-[#0a0a0a]/50 border-b border-[#27272a]">
              <tr>
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">Belge No</th>
                <th className="px-4 py-3 font-medium">Hareket (Kaynak → Hedef)</th>
                <th className="px-4 py-3 font-medium">Malzeme Kodu / Adı</th>
                <th className="px-4 py-3 font-medium text-right">Miktar</th>
                <th className="px-4 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-[#27272a]/50 transition-colors group animate-in fade-in">
                  <td className="px-4 py-3 whitespace-nowrap text-[#94a3b8]">{row.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-white group-hover:text-blue-400 transition-colors">{row.docNo}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-[#27272a] px-2 py-1 rounded text-[#94a3b8] font-mono">{row.source}</span>
                      <ArrowRightLeft size={12} className="text-[#52525b]" />
                      <span className="bg-[#27272a] px-2 py-1 rounded text-[#94a3b8] font-mono">{row.target}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-blue-400 font-mono text-xs">{row.code}</span>
                      <span className="text-xs text-[#94a3b8]">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap font-medium">
                    {row.qty} <span className="text-xs text-[#52525b] font-normal">{row.unit}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.status === 'Tamamlandı' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
