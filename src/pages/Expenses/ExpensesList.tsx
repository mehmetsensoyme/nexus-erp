import { Search, Plus, Filter, Download, Receipt } from 'lucide-react';
import { useState } from 'react';

export default function ExpensesList() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Masraf Yönetimi</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Personel masrafları, fiş okuma ve onay süreçleri.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#141414] border border-[#27272a] hover:bg-[#27272a] text-white rounded-lg transition-colors text-sm font-medium">
            <Download size={16} /> İçe/Dışa Aktar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
            <Plus size={16} /> Yeni Ekle
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" size={18} />
          <input
            type="text"
            placeholder="Arama yapın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#27272a] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#141414] border border-[#27272a] hover:bg-[#27272a] text-white rounded-xl transition-colors text-sm font-medium">
          <Filter size={18} /> Filtrele
        </button>
      </div>

      <div className="bg-[#141414] border border-[#27272a] rounded-xl flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1c1c1f] flex items-center justify-center mb-4 border border-[#27272a]">
          <Receipt size={32} className="text-[#52525b]" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Henüz kayıt yok</h3>
        <p className="text-[#94a3b8] max-w-sm">
          Bu modüle ait herhangi bir veri bulunamadı. Hemen yeni bir kayıt oluşturarak başlayabilirsiniz.
        </p>
      </div>
    </div>
  );
}
