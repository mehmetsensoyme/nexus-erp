import { create } from 'zustand';

export interface Contact { id: number; type: string; name: string; taxId: string; taxOffice: string; phone: string; email: string; balance: number; status: string; }
export interface Invoice { id: number; date: string; type: string; eType: string; no: string; company: string; amount: string; status: string; }
export interface Depot { id: number; date: string; docNo: string; source: string; target: string; code: string; name: string; qty: number; unit: string; status: string; }
export interface Purchase { id: number; date: string; poNumber: string; supplier: string; items: string; total: string; status: string; }
export interface Inventory { id: number; code: string; barcode: string; name: string; category: string; quantity: number; unit: string; minStock: number; price: number; cost: number; status: string; warehouse: string; }
export interface NotificationData { id: number; title: string; message: string; time: string; read: boolean; type: 'success'|'info'|'warning'; link?: string; }
export interface Project { id: number; name: string; status: string; progress: number; deadline: string; }
export interface Ticket { id: number; subject: string; customer: string; status: string; priority: string; date: string; }
export interface FleetItem { id: number; plate: string; vehicle: string; status: string; nextMaintenance: string; }

interface DataState {
  contacts: Contact[];
  invoices: Invoice[];
  depots: Depot[];
  purchases: Purchase[];
  inventory: Inventory[];
  notifications: NotificationData[];
  projects: Project[];
  tickets: Ticket[];
  fleet: FleetItem[];
  
  addContact: (data: Omit<Contact, 'id'>) => void;
  updateContact: (id: number, data: Partial<Contact>) => void;
  removeContact: (id: number) => void;
  
  addInvoice: (data: Omit<Invoice, 'id'>) => void;
  removeInvoice: (id: number) => void;
  
  addDepot: (data: Omit<Depot, 'id'>) => void;
  removeDepot: (id: number) => void;
  
  addPurchase: (data: Omit<Purchase, 'id'>) => void;
  removePurchase: (id: number) => void;

  addInventory: (data: Omit<Inventory, 'id'>) => void;
  updateInventory: (id: number, data: Partial<Inventory>) => void;
  removeInventory: (id: number) => void;
  
  addNotification: (data: Omit<NotificationData, 'id'>) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  clearAllNotifications: () => void;
}

export const useDataStore = create<DataState>((set) => ({
  contacts: [
    { id: 1, type: 'Müşteri', name: 'ABC Teknoloji San. ve Tic. A.Ş.', taxId: '1234567890', taxOffice: 'Zincirlikuyu', phone: '0212 555 0101', email: 'muhasebe@abctek.com', balance: 145000, status: 'Aktif' },
    { id: 2, type: 'Tedarikçi', name: 'XYZ Dağıtım Pazarlama Ltd. Şti.', taxId: '9876543210', taxOffice: 'Beyoğlu', phone: '0216 444 0202', email: 'finans@xyz.com', balance: -12500, status: 'Aktif' },
  ],
  invoices: [
    { id: 1, date: '2026-08-25', type: 'SATIŞ', eType: 'e-Fatura', no: 'GIB2026000000104', company: 'ABC Teknoloji San. ve Tic. A.Ş.', amount: '45.000,00 ₺', status: 'GİB Onaylı' },
    { id: 2, date: '2026-08-25', type: 'ALIŞ', eType: 'e-Arşiv', no: 'GIB2026000000105', company: 'XYZ Dağıtım Pazarlama Ltd. Şti.', amount: '12.500,00 ₺', status: 'GİB Kuyruğunda' },
  ],
  depots: [
    { id: 1, date: '2026-08-20', docNo: 'TR-2026-001', source: 'ULU.RIGOL.DEPO', target: 'MERKEZ.DEPO', code: 'MLZ-001', name: 'Rigol Osiloskop', qty: 5, unit: 'Adet', status: 'Tamamlandı' },
    { id: 2, date: '2026-08-20', docNo: 'TR-2026-002', source: 'MERKEZ.DEPO', target: 'URETIM.HATT', code: 'KBL-045', name: 'Cat6 Kablo', qty: 250, unit: 'mt', status: 'Beklemede' },
  ],
  purchases: [
    { id: 1, date: '2026-08-26', poNumber: 'SAT-2026-0089', supplier: 'XYZ Dağıtım Pazarlama Ltd. Şti.', items: 'Kablo, Konnektör (2 Kalem)', total: '12.500,00 ₺', status: 'Onaylandı' },
    { id: 2, date: '2026-08-25', poNumber: 'SAT-2026-0088', supplier: 'Global Endüstri A.Ş.', items: 'Sunucu Kabini, Switch (4 Kalem)', total: '85.200,00 ₺', status: 'Yönetim Onayı Bekliyor' },
  ],
  inventory: [
    { id: 1, code: 'STK-001', barcode: '869000000001', name: 'MacBook Pro 16" M3 Max', category: 'Elektronik', quantity: 12, unit: 'Adet', minStock: 5, price: 145000, cost: 120000, status: 'Aktif', warehouse: 'Merkez Depo' },
    { id: 2, code: 'STK-002', barcode: '869000000002', name: 'Logitech MX Master 3S', category: 'Aksesuar', quantity: 45, unit: 'Adet', minStock: 50, price: 3500, cost: 2200, status: 'Kritik Stok', warehouse: 'Merkez Depo' },
    { id: 3, code: 'STK-003', barcode: '869000000003', name: 'Cat6 Ethernet Kablosu', category: 'Sarf Malzeme', quantity: 1500, unit: 'Metre', minStock: 500, price: 15, cost: 8, status: 'Aktif', warehouse: 'Şube Depo 1' },
    { id: 4, code: 'STK-004', barcode: '869000000004', name: 'Dell UltraSharp 27" 4K', category: 'Elektronik', quantity: 3, unit: 'Adet', minStock: 10, status: 'Tükendi', price: 24000, cost: 18500, warehouse: 'Merkez Depo' }
  ],
  notifications: [
    { id: 1, title: 'GİB Fatura Onayı', message: 'GIB2026000000104 nolu fatura başarıyla işlendi.', time: '10 dk önce', read: false, type: 'success', link: '/fatura' },
    { id: 2, title: 'Yeni Sistem Güncellemesi', message: 'Nexus v0.1.12-alpha devreye alındı.', time: '1 saat önce', read: true, type: 'info', link: '/' }
  ],
  projects: [
    { id: 1, name: 'ERP Supabase Entegrasyonu', status: 'Devam Ediyor', progress: 75, deadline: '2026-09-01' }
  ],
  tickets: [
    { id: 1, subject: 'Sunucu Bağlantı Hatası', customer: 'ABC Teknoloji', status: 'Açık', priority: 'Yüksek', date: '2026-08-27' }
  ],
  fleet: [
    { id: 1, plate: '34 NEX 01', vehicle: 'Ford Transit 2024', status: 'Bakımda', nextMaintenance: '2026-08-28' }
  ],
  
  addContact: (data) => set(state => ({ contacts: [{ ...data, id: Date.now() }, ...state.contacts] })),
  updateContact: (id, data) => set(state => ({ contacts: state.contacts.map(c => c.id === id ? { ...c, ...data } : c) })),
  removeContact: (id) => set(state => ({ contacts: state.contacts.filter(c => c.id !== id) })),
  
  addInvoice: (data) => set(state => ({ invoices: [{ ...data, id: Date.now() }, ...state.invoices] })),
  removeInvoice: (id) => set(state => ({ invoices: state.invoices.filter(i => i.id !== id) })),
  
  addDepot: (data) => set(state => ({ depots: [{ ...data, id: Date.now() }, ...state.depots] })),
  removeDepot: (id) => set(state => ({ depots: state.depots.filter(d => d.id !== id) })),
  
  addPurchase: (data) => set(state => ({ purchases: [{ ...data, id: Date.now() }, ...state.purchases] })),
  removePurchase: (id) => set(state => ({ purchases: state.purchases.filter(p => p.id !== id) })),

  addInventory: (data) => set(state => ({ inventory: [{ ...data, id: Date.now() }, ...state.inventory] })),
  updateInventory: (id, data) => set(state => ({ inventory: state.inventory.map(i => i.id === id ? { ...i, ...data } : i) })),
  removeInventory: (id) => set(state => ({ inventory: state.inventory.filter(i => i.id !== id) })),
  
  addNotification: (data) => set(state => ({ notifications: [{ ...data, id: Date.now() }, ...state.notifications] })),
  markAllNotificationsRead: () => set(state => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) })),
  markNotificationRead: (id) => set(state => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),
  deleteNotification: (id) => set(state => ({ notifications: state.notifications.filter(n => n.id !== id) })),
  clearAllNotifications: () => set({ notifications: [] }),
}));
