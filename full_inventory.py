with open('src/pages/Inventory/InventoryList.tsx', 'r') as f:
    original = f.read()

# I will just write a completely clean version that avoids all regex errors.
clean_file = """import { Search, Plus, Filter, Download, Package, MoreVertical, Edit2, Trash2, QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { downloadCSV } from '../../lib/exportUtils';

export default function InventoryList() {
  const { openDrawer, currency, userProfile } = useUIStore();
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency });

  const fetchInventory = async () => {
    if (!userProfile?.company_id) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      toast.error('Stoklar yüklenemedi: ' + error.message);
    } else {
      setInventory(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInventory();
    const channel = supabase.channel('custom-inventory-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory_items' }, () => {
        fetchInventory();
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel) };
  }, [userProfile?.company_id]);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeFilter === 'Tümü' || item.category === activeFilter;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Bu stoku silmek istediğinize emin misiniz?')) {
      const { error } = await supabase.from('inventory_items').delete().eq('id', id);
      if (error) toast.error('Silinirken hata oluştu');
      else toast.success('Stok silindi');
    }
  };

  const getStatusColor = (quantity: number) => {
    if (quantity <= 0) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (quantity <= 10) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  };

  const getStatusText = (quantity: number) => {
    if (quantity <= 0) return 'Tükendi';
    if (quantity <= 10) return 'Kritik Stok';
    return 'Stokta';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stok ve Ürünler</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Stok kartları, barkodlar ve depo hareketleri.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              downloadCSV(filteredInventory, 'Stok_Listesi');
              toast.success('Excel/CSV dosyası indirildi.');
            }}
            className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#27272a] rounded-lg text-sm hover:bg-[#27272a] transition-colors"
          >
            <Download size={16} /> Dışa Aktar
          </button>
          <button 
            onClick={() => openDrawer('NEW_INVENTORY')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} /> Yeni Stok Kartı
          </button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#27272a] p-4 rounded-xl">
          <div className="text-[#94a3b8] text-sm mb-1">Toplam Ürün Çeşidi</div>
          <div className="text-2xl font-semibold">{inventory.length}</div>
        </div>
        <div className="bg-[#141414] border border-[#27272a] p-4 rounded-xl">
          <div className="text-[#94a3b8] text-sm mb-1">Kritik Stok Uyarıları</div>
          <div className="text-2xl font-semibold text-amber-400">{inventory.filter(i => i.stock_quantity > 0 && i.stock_quantity <= 10).length}</div>
        </div>
        <div className="bg-[#141414] border border-[#27272a] p-4 rounded-xl">
          <div className="text-[#94a3b8] text-sm mb-1">Tükenen Ürünler</div>
          <div className="text-2xl font-semibold text-red-400">{inventory.filter(i => i.stock_quantity <= 0).length}</div>
        </div>
        <div className="bg-[#141414] border border-[#27272a] p-4 rounded-xl">
          <div className="text-[#94a3b8] text-sm mb-1">Toplam Stok Değeri</div>
          <div className="text-2xl font-semibold text-emerald-400">
            {formatter.format(inventory.reduce((acc, curr) => acc + (curr.price * curr.stock_quantity), 0))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" size={18} />
          <input
            type="text"
            placeholder="Stok kodu veya ürün adı ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#27272a] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['Tümü', 'Hammadde', 'Mamul', 'Yarı Mamul', 'Ticari Mal', 'Hizmet'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter 
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' 
                  : 'bg-[#141414] text-[#94a3b8] border border-[#27272a] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#141414] border border-[#27272a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#94a3b8] uppercase bg-[#1c1c1f] border-b border-[#27272a]">
              <tr>
                <th className="px-4 py-3">Ürün/Stok</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-right">Miktar</th>
                <th className="px-4 py-3 text-right">Birim Fiyat</th>
                <th className="px-4 py-3 text-center">Durum</th>
                <th className="px-4 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {filteredInventory.length > 0 ? filteredInventory.map((row) => (
                <tr key={row.id} className="hover:bg-[#27272a]/50 transition-colors group cursor-pointer animate-in fade-in">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center text-[#94a3b8]">
                        <Package size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white group-hover:text-blue-400 transition-colors">{row.name}</span>
                        <span className="text-xs text-[#52525b]">#{row.code}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#94a3b8]">{row.category || '-'}</td>
                  <td className="px-4 py-3 text-right text-white font-medium">
                    {row.stock_quantity || 0} <span className="text-xs text-[#52525b] font-normal">{row.unit || 'Adet'}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-medium">
                    {formatter.format(row.price || 0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${getStatusColor(row.stock_quantity || 0)}`}>
                      {getStatusText(row.stock_quantity || 0)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-[#27272a] rounded text-[#94a3b8] hover:text-white transition-colors" title="Barkod/QR Yazdır">
                        <QrCode size={16} />
                      </button>
                      <button onClick={() => openDrawer('NEW_INVENTORY', row.id as any)} className="p-1.5 hover:bg-blue-500/20 rounded text-[#94a3b8] hover:text-blue-400 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="p-1.5 hover:bg-red-500/20 rounded text-[#94a3b8] hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#94a3b8]">
                    Arama kriterlerine uygun stok kaydı bulunamadı.
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
"""

with open('src/pages/Inventory/InventoryList.tsx', 'w') as f:
    f.write(clean_file)
