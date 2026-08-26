import { useState, useEffect } from 'react';
import { PackageSearch, Plus, Search, Filter, Edit2, Trash2, AlertCircle, ScanBarcode, QrCode, X, Printer } from 'lucide-react';
import { useDataStore, type Inventory } from '../../store/useDataStore';
import { useUIStore } from '../../store/useUIStore';
import { toast } from 'sonner';

export default function InventoryList() {
  const { inventory, removeInventory } = useDataStore();
  const { openDrawer, currency } = useUIStore();
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [activeQR, setActiveQR] = useState<Inventory | null>(null);

  const formatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency });

  // Barcode Scanner Listener (Listens to rapid key strokes mimicking a USB scanner)
  useEffect(() => {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 50) {
        barcodeBuffer = ''; // Reset if typing is too slow (not a scanner)
      }
      
      if (e.key === 'Enter' && barcodeBuffer.length > 3) {
        // Barcode scan completed!
        const scannedCode = barcodeBuffer;
        const matchedItem = inventory.find(i => i.barcode === scannedCode || i.code === scannedCode);
        
        if (matchedItem) {
          toast.success(`Ürün Bulundu: ${matchedItem.name}`);
          setSearch(scannedCode);
        } else {
          toast.error('Barkod sistemde bulunamadı!', {
            action: {
              label: 'Yeni Ekle',
              onClick: () => {
                // Pass the scanned barcode to the new item form somehow, for now just open drawer
                openDrawer('NEW_INVENTORY'); 
              }
            }
          });
        }
        barcodeBuffer = '';
      } else if (e.key.length === 1) { // Only printable chars
        barcodeBuffer += e.key;
      }
      
      lastKeyTime = currentTime;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inventory]);

  const handleEdit = (id: number) => {
    openDrawer('NEW_INVENTORY', id);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bu stok kartını silmek istediğinize emin misiniz?')) {
      removeInventory(id);
      toast.success('Stok kartı başarıyla silindi.');
    }
  };

  const filteredData = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.code.toLowerCase().includes(search.toLowerCase()) ||
                          (item.barcode && item.barcode.includes(search));
    if (!matchesSearch) return false;
    if (activeFilter === 'Tümü') return true;
    if (activeFilter === 'Kritik Stok') return item.status === 'Kritik Stok' || item.status === 'Tükendi';
    return item.category === activeFilter;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Aktif': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Kritik Stok': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Tükendi': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-[#27272a] text-[#94a3b8] border-[#52525b]';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* QR YAZDIRMA MODALI (Printable Label) */}
      {activeQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-[#27272a] rounded-2xl w-full max-w-sm shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[#27272a]">
              <h2 className="text-sm font-semibold text-white">QR ve Barkod Etiketi</h2>
              <button onClick={() => setActiveQR(null)} className="text-[#94a3b8] hover:text-white transition-colors"><X size={18} /></button>
            </div>
            
            <div id="print-label" className="p-8 flex flex-col items-center justify-center bg-white m-4 rounded-xl shadow-inner text-center">
               {/* Gerçek hayatta burası özel bir etiket yazıcısına (Zebra vb.) göre boyutlandırılır */}
               <h3 className="text-xl font-black text-black mb-1 leading-tight">{activeQR.name}</h3>
               <p className="text-sm text-gray-500 mb-4">{activeQR.category}</p>
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${activeQR.barcode || activeQR.code}`} 
                 alt="QR Code" 
                 className="w-32 h-32 mb-4"
               />
               <div className="w-full border-t border-dashed border-gray-300 pt-3">
                 <p className="text-xs font-medium text-gray-400">STOK KODU</p>
                 <p className="font-mono text-lg font-bold text-black">{activeQR.code}</p>
                 {activeQR.barcode && <p className="font-mono text-xs mt-1 text-gray-600">*{activeQR.barcode}*</p>}
               </div>
            </div>

            <div className="p-4 border-t border-[#27272a] bg-[#0a0a0a] flex justify-end gap-2">
              <button onClick={() => setActiveQR(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-[#94a3b8] hover:text-white border border-[#27272a] hover:bg-[#27272a] transition-colors">İptal</button>
              <button onClick={() => {
                toast.success('Etiket yazıcıya gönderildi!');
                setTimeout(() => setActiveQR(null), 1000);
              }} className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                <Printer size={16}/> Yazdır
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <PackageSearch size={24} className="text-blue-500" />
            Stok & Envanter Yönetimi
          </h1>
          <p className="text-[#94a3b8] text-sm mt-1">Depo bazlı ürün, hammadde ve sarf malzeme takibi.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.info('Kamera erişimi başlatılıyor... (Mobil cihazda otomatik açılır)')}
            className="flex items-center gap-2 px-4 py-2 bg-[#27272a] text-white rounded-lg hover:bg-[#3f3f46] transition-colors border border-[#3f3f46] font-medium text-sm shadow-sm"
          >
            <ScanBarcode size={16} />
            Kamera ile Tara
          </button>
          <button 
            onClick={() => openDrawer('NEW_INVENTORY')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 font-medium text-sm"
          >
            <Plus size={16} />
            Yeni Stok Kartı
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 flex-1">
          {['Tümü', 'Kritik Stok', 'Elektronik', 'Sarf Malzeme', 'Aksesuar'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-[#27272a]/80 text-white border-[#27272a]' : 'border-[#27272a] text-[#94a3b8] hover:bg-[#27272a]/50'}`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <input 
              type="text" 
              placeholder="Barkod, Kod veya Ad Ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141414] border border-[#27272a] rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-[#27272a] text-[#94a3b8] rounded-lg hover:text-white hover:bg-[#27272a] transition-colors text-sm">
            <Filter size={14} />
            Detaylı Filtre
          </button>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#27272a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a]/50 border-b border-[#27272a]">
                <th className="px-4 py-3 text-xs font-medium text-[#94a3b8]">Stok Kodu</th>
                <th className="px-4 py-3 text-xs font-medium text-[#94a3b8]">Ürün Adı</th>
                <th className="px-4 py-3 text-xs font-medium text-[#94a3b8]">Miktar</th>
                <th className="px-4 py-3 text-xs font-medium text-[#94a3b8]">Depo</th>
                <th className="px-4 py-3 text-xs font-medium text-[#94a3b8]">Satış Fiyatı</th>
                <th className="px-4 py-3 text-xs font-medium text-[#94a3b8]">Durum</th>
                <th className="px-4 py-3 text-xs font-medium text-[#94a3b8]">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-[#27272a]/50 transition-colors group cursor-pointer animate-in fade-in">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                       <span className="text-sm font-medium text-white">{item.code}</span>
                       <span className="text-[10px] text-[#52525b]">{item.barcode || 'Barkod Yok'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    <div className="flex items-center gap-2">
                      {item.name}
                      {item.quantity <= item.minStock && (
                        <AlertCircle size={14} className="text-amber-500" title="Kritik Stok Seviyesi!" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold ${item.quantity <= item.minStock ? 'text-amber-500' : 'text-white'}`}>
                        {item.quantity} {item.unit}
                      </span>
                      <span className="text-[10px] text-[#52525b]">Min: {item.minStock}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#94a3b8]">{item.warehouse}</td>
                  <td className="px-4 py-3 text-sm text-white">{formatter.format(item.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setActiveQR(item); }} className="p-1.5 text-[#94a3b8] hover:text-emerald-500 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 rounded-lg transition-colors" title="QR/Barkod Çıktısı Al">
                        <QrCode size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(item.id); }} className="p-1.5 text-[#94a3b8] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors" title="Düzenle">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-1.5 text-[#94a3b8] hover:text-red-500 hover:bg-[#27272a] rounded-lg transition-colors" title="Sil">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#52525b] text-sm">
                    Bu kriterlere uygun stok kartı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
