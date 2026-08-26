import { useState, useEffect } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useDataStore } from '../../store/useDataStore';
import { toast } from 'sonner';

export default function ContactForm() {
  const { closeDrawer, editingId } = useUIStore();
  const { addContact, updateContact, contacts } = useDataStore();
  
  const [formData, setFormData] = useState({
    type: 'Müşteri',
    name: '',
    taxId: '',
    taxOffice: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    if (editingId) {
      const contactToEdit = contacts.find(c => c.id === editingId);
      if (contactToEdit) {
        setFormData({
          type: contactToEdit.type || 'Müşteri',
          name: contactToEdit.name || '',
          taxId: contactToEdit.taxId || '',
          taxOffice: contactToEdit.taxOffice || '',
          phone: contactToEdit.phone || '',
          email: contactToEdit.email || '',
          address: '' // Mock address since we didn't add it to the model initially
        });
      }
    }
  }, [editingId, contacts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    if (editingId) {
      updateContact(editingId, {
        type: formData.type,
        name: formData.name,
        taxId: formData.taxId,
        taxOffice: formData.taxOffice,
        phone: formData.phone,
        email: formData.email,
      });
      toast.success('Cari Kart başarıyla güncellendi.');
    } else {
      addContact({
        type: formData.type,
        name: formData.name,
        taxId: formData.taxId,
        taxOffice: formData.taxOffice,
        phone: formData.phone,
        email: formData.email,
        balance: 0,
        status: 'Aktif'
      });
      toast.success('Yeni Cari Kart başarıyla oluşturuldu.');
    }
    
    closeDrawer();
  };

  return (
    <form id="drawer-form" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[#94a3b8] mb-1">Cari Tipi</label>
        <select 
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
        >
          <option>Müşteri</option>
          <option>Tedarikçi</option>
          <option>Personel</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#94a3b8] mb-1">Unvan</label>
        <input 
          type="text" 
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
          placeholder="Firma tam unvanı..." 
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">VKN / TCKN</label>
          <input 
            type="text" 
            value={formData.taxId}
            onChange={(e) => setFormData({...formData, taxId: e.target.value})}
            className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
            placeholder="10 veya 11 hane" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Vergi Dairesi</label>
          <input 
            type="text" 
            value={formData.taxOffice}
            onChange={(e) => setFormData({...formData, taxOffice: e.target.value})}
            className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
            placeholder="Daire adı" 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">İletişim (Telefon)</label>
          <input 
            type="text" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
            placeholder="0(555)..." 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">E-Posta</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
            placeholder="ornek@firma.com" 
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#94a3b8] mb-1">Adres</label>
        <textarea 
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="w-full bg-[#141414] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors min-h-[80px]" 
          placeholder="Açık adres..." 
        />
      </div>
    </form>
  );
}
