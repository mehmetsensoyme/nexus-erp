import { Search, Plus, Filter, Download, FileText, CheckCircle2, Clock, Send, Trash2 } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useDataStore } from '../../store/useDataStore';
import { useState } from 'react';
import { toast } from 'sonner';
import { downloadCSV } from '../../lib/exportUtils';

export default function InvoiceList() {
  const { openDrawer } = useUIStore();
  const { invoices } = useDataStore();
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(item => 
    item.company.toLowerCase().includes(search.toLowerCase()) || 
    item.no.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Faturalar (e-Belge)</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Gelen ve giden GİB faturaları (e-Fatura / e-Arşiv) ve entegrasyon ekranı.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              downloadCSV(filtered, 'GIB_Faturalar');
              toast.success('Faturalar başarıyla dışa aktarıldı.');
            }}
            className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#27272a] rounded-lg text-sm hover:bg-[#27272a] transition-colors"
          >
            <Download size={16} /> Dışa Aktar
          </button>
          <button 
            onClick={() => {
              toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
                loading: 'GİB Entegratör sunucusuna bağlanılıyor...',
                success: 'Fatura başarıyla e-Belge kuyruğuna alındı ve imzalandı!',
                error: 'Sunucu hatası'
              });
            }}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 rounded-lg text-sm hover:bg-emerald-600/20 transition-colors"
          >
            <Send size={16} /> GİB'e Gönder (1)
          </button>
          <button onClick={() => openDrawer('NEW_INVOICE')} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <Plus size={16} /> Fatura Kes
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
              placeholder="Fatura No, VKN/TCKN, Cari Adı..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-[#52525b]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#94a3b8] uppercase bg-[#0a0a0a]/50 border-b border-[#27272a]">
              <tr>
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">Belge Türü</th>
                <th className="px-4 py-3 font-medium">Fatura No</th>
                <th className="px-4 py-3 font-medium">Cari Unvan</th>
                <th className="px-4 py-3 font-medium text-right">Genel Toplam</th>
                <th className="px-4 py-3 font-medium">GİB Durumu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {filtered.map((row) => {
                const isOk = row.status === 'GİB Onaylı';
                const isWait = row.status === 'GİB Kuyruğunda';
                return (
                <tr key={row.id} className="hover:bg-[#27272a]/50 transition-colors group cursor-pointer animate-in fade-in">
                  <td className="px-4 py-3 whitespace-nowrap text-[#94a3b8]">{row.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold ${row.type === 'SATIŞ' ? 'text-blue-400' : 'text-purple-400'}`}>{row.type}</span>
                      <span className="text-xs text-[#52525b]">{row.eType}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-white group-hover:text-blue-400 transition-colors">{row.no}</td>
                  <td className="px-4 py-3 font-medium text-white truncate max-w-[250px]">{row.company}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap font-semibold text-white">
                    {row.amount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap flex items-center justify-between">
                     <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border border-[#27272a]/50 ${isOk ? 'bg-emerald-500/10 text-emerald-500' : isWait ? 'bg-amber-500/10 text-amber-500' : 'bg-[#27272a] text-[#94a3b8]'}`}>
                        {isOk ? <CheckCircle2 size={14}/> : isWait ? <Clock size={14}/> : <FileText size={14}/>}
                        {row.status}
                     </span>
                     <div className="opacity-100 transition-opacity ml-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            useDataStore.getState().removeInvoice(row.id);
                            toast.success(`${row.no} nolu fatura silindi.`);
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Faturayı Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
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
