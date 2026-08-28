import { Search, Plus, Filter, Download, Building2, User, Phone, Mail, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { supabase } from '../../lib/supabase';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { downloadCSV } from '../../lib/exportUtils';

export default function ContactsList() {
  const { openDrawer, userProfile } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tümü');
  
  // Supabase State
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = async () => {
    if (!userProfile?.company_id) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      toast.error('Cariler yüklenemedi: ' + error.message);
    } else {
      setContacts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchContacts();

    // Listen for realtime changes
    const channel = supabase.channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, (payload) => {
        fetchContacts();
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel) };
  }, [userProfile?.company_id]);

  // Live Reactive Filter
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (contact.tax_number && contact.tax_number.includes(searchQuery)) || 
                          (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Map DB types back to UI filters
    const typeLabel = contact.type === 'CUSTOMER' ? 'Müşteri' : 'Tedarikçi';
    const matchesType = activeFilter === 'Tümü' || typeLabel === activeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Bu cariyi silmek istediğinize emin misiniz?')) {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) toast.error('Silinirken hata oluştu');
      else toast.success('Cari silindi');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cari Kartlar</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Müşteri ve tedarikçi hesap yönetimi, bakiye durumları.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toast.info('Detaylı filtreleme menüsü eklenecek.')}
            className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#27272a] rounded-lg text-sm hover:bg-[#27272a] transition-colors"
          >
            <Filter size={16} /> Detaylı Filtre
          </button>
          <button 
            onClick={() => {
              downloadCSV(filteredContacts, 'Cari_Kartlar');
              toast.success('Excel/CSV dosyası başarıyla indirildi.');
            }}
            className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#27272a] rounded-lg text-sm hover:bg-[#27272a] transition-colors"
          >
            <Download size={16} /> Dışa Aktar
          </button>
          <button 
            onClick={() => openDrawer('NEW_CONTACT')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} /> Yeni Cari Ekle
          </button>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#27272a] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center bg-[#0a0a0a] border border-[#27272a] rounded-md px-3 py-1.5 w-80 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <Search size={16} className="text-[#64748b] mr-2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Unvan, VKN/TCKN, e-Posta ara..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-[#52525b]"
            />
          </div>
          <div className="flex gap-2">
            {['Tümü', 'Müşteri', 'Tedarikçi'].map(filter => (
              <span 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-xs font-medium border rounded-full cursor-pointer transition-colors ${activeFilter === filter ? 'bg-[#27272a]/80 text-white border-[#27272a]' : 'border-[#27272a] text-[#94a3b8] hover:bg-[#27272a]/50'}`}
              >
                {filter === 'Müşteri' ? 'Müşteriler' : filter === 'Tedarikçi' ? 'Tedarikçiler' : 'Tümü'}
              </span>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#94a3b8] uppercase bg-[#0a0a0a]/50 border-b border-[#27272a]">
              <tr>
                <th className="px-4 py-3 font-medium">Unvan / Tip</th>
                <th className="px-4 py-3 font-medium">Vergi Bilgileri</th>
                <th className="px-4 py-3 font-medium">İletişim</th>
                <th className="px-4 py-3 font-medium text-right">Güncel Bakiye</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {filteredContacts.length > 0 ? filteredContacts.map((row) => (
                <tr key={row.id} className="hover:bg-[#27272a]/50 transition-colors group cursor-pointer animate-in fade-in">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#27272a] flex items-center justify-center text-[#94a3b8]">
                        {row.type === 'Müşteri' ? <User size={16} /> : <Building2 size={16} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white group-hover:text-blue-400 transition-colors">{row.name}</span>
                        <span className="text-xs text-[#52525b]">{row.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-mono text-[#94a3b8]">VKN: {row.taxId || '-'}</span>
                      <span className="text-xs text-[#52525b]">{row.taxOffice ? `${row.taxOffice} V.D.` : '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 text-xs text-[#94a3b8]">
                      {row.phone && <div className="flex items-center gap-1.5"><Phone size={12} className="text-[#52525b]"/> {row.phone}</div>}
                      {row.email && <div className="flex items-center gap-1.5"><Mail size={12} className="text-[#52525b]"/> {row.email}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className={`font-semibold ${row.balance < 0 ? 'text-red-400' : row.balance === 0 ? 'text-[#94a3b8]' : 'text-emerald-400'}`}>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: useUIStore.getState().currency }).format(row.balance)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.status === 'Aktif' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-[#27272a] text-[#94a3b8] border border-[#52525b]'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openDrawer('NEW_CONTACT', row.id);
                        }}
                        className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          useDataStore.getState().removeContact(row.id);
                          toast.success(`${row.name} silindi.`);
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        title="Kaydı Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#52525b]">
                    Aranan kritere uygun kayıt bulunamadı.
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
