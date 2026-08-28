import { useState, useEffect } from 'react';
import { PackageSearch, Save, Info, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useUIStore } from '../../store/useUIStore';
import { toast } from 'sonner';

export default function InventoryForm() {
  const { inventory, addInventory, updateInventory } = useDataStore();
  const { closeDrawer, editingId, userProfile } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    barcode: '',
    name: '',
    category: 'Elektronik',
    warehouse: 'Merkez Depo',
    quantity: 0,
    unit: 'Adet',
    minStock: 5,
    price: 0,
    cost: 0
  });

  const generateBarcode = () => {
    // Generate a mock EAN-13 like barcode (869 + 9 random digits)
    const prefix = "869";
    const random = Math.floor(100000000 + Math.random() * 900000000).toString();
    return prefix + random;
  };

  useEffect(() => {
    if (editingId) {
      const item = inventory.find(i => i.id === editingId);
      if (item) {
        setFormData({
          code: item.code,
          barcode: item.barcode || '',
          name: item.name,
          category: item.category,
          warehouse: item.warehouse,
          quantity: item.quantity,
          unit: item.unit,
          minStock: item.minStock,
          price: item.price,
          cost: item.cost
        });
      }
    } else {
      // Auto-generate code and barcode
      setFormData(prev => ({ 
        ...prev, 
        code: `STK-${String(inventory.length + 1).padStart(3, '0')}`,
        barcode: generateBarcode()
      }));
    }
  }, [editingId, inventory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const status = formData.quantity <= 0 ? 'Tükendi' : formData.quantity <= formData.minStock ? 'Kritik Stok' : 'Aktif';
    
    if (editingId) {
      updateInventory(editingId, { ...formData, status });
      toast.success('Stok kartı başarıyla güncellendi.');
    } else {
      addInventory({ ...formData, status });
      toast.success('Yeni stok kartı başarıyla oluşturuldu.');
    }
    closeDrawer();
  };

  return (
    <form id="drawer-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-3">
        <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-500/90 leading-relaxed">
          Kamera sembolüne tıklayarak veya bir barkod okuyucu (USB/Bluetooth) cihaz ile barkod okuttuğunuzda alanlar otomatik dolacaktır. QR etiketlerini kaydettikten sonra tablodan yazdırabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Stok Kodu (Oto)</label>
          <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
        </div>
        <div>
          <label className="flex items-center justify-between text-xs font-medium text-[#94a3b8] mb-1">
            <span>Barkod / EAN</span>
            <button type="button" onClick={() => setFormData({...formData, barcode: generateBarcode()})} className="text-blue-500 hover:text-blue-400 flex items-center gap-1" title="Otomatik Barkod Üret"><RefreshCw size={12}/> Üret</button>
          </label>
          <input required type="text" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#94a3b8] mb-1">Ürün Adı *</label>
        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Kategori</label>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors">
            <option>Elektronik</option>
            <option>Aksesuar</option>
            <option>Sarf Malzeme</option>
            <option>Hammadde</option>
            <option>Yarı Mamul</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Bulunduğu Depo</label>
          <select value={formData.warehouse} onChange={e => setFormData({...formData, warehouse: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors">
            <option>Merkez Depo</option>
            <option>Şube Depo 1</option>
            <option>Üretim Hattı</option>
          </select>
        </div>
      </div>

      <div className="border-t border-[#27272a] my-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Mevcut Miktar</label>
          <input required type="number" min="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Birim</label>
          <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors">
            <option>Adet</option>
            <option>Kg</option>
            <option>Metre</option>
            <option>Koli</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Min. Stok Uyarısı</label>
          <input required type="number" min="0" value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value) || 0})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Maliyet (₺)</label>
          <input required type="number" min="0" step="0.01" value={formData.cost} onChange={e => setFormData({...formData, cost: parseFloat(e.target.value) || 0})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Satış Fiyatı (₺)</label>
          <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
        </div>
      </div>

    </form>
  );
}
