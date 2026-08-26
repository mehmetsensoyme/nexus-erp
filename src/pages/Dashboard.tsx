import { useState } from 'react';
import { Activity, CreditCard, DollarSign, PackageOpen, LayoutDashboard, Settings2, Package, AlertCircle, ArrowRightLeft, FileText, ShoppingCart, ArrowRight, Ticket, Wrench, Briefcase } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useDataStore } from '../store/useDataStore';
import { useUIStore } from '../store/useUIStore';
import { useClickOutside } from '../hooks/useClickOutside';
import { Link } from 'react-router-dom';

const salesData = [
  { name: 'Oca', satis: 4000, tahsilat: 2400 },
  { name: 'Şub', satis: 3000, tahsilat: 1398 },
  { name: 'Mar', satis: 2000, tahsilat: 9800 },
  { name: 'Nis', satis: 2780, tahsilat: 3908 },
  { name: 'May', satis: 1890, tahsilat: 4800 },
  { name: 'Haz', satis: 2390, tahsilat: 3800 },
  { name: 'Tem', satis: 3490, tahsilat: 4300 },
];

export default function Dashboard() {
  const { invoices, contacts, inventory, purchases, depots, tickets, fleet, projects } = useDataStore();
  const { themeColor, currency, themeMode, dashboardWidgets, toggleWidget, activeModules } = useUIStore();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useClickOutside(() => setShowSettings(false));
  
  const colors = {
    blue: '#3b82f6',
    emerald: '#10b981',
    indigo: '#6366f1',
    rose: '#f43f5e'
  };
  
  const primaryColor = colors[themeColor as keyof typeof colors] || themeColor;
  const formatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency });

  const isLight = themeMode === 'light' || (themeMode === 'system' && window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches);
  const gridColor = isLight ? '#e2e8f0' : '#27272a';
  const textColor = isLight ? '#64748b' : '#52525b';
  const tooltipBg = isLight ? '#ffffff' : '#0a0a0a';
  const tooltipBorder = isLight ? '#e2e8f0' : '#27272a';
  const tooltipText = isLight ? '#0f172a' : '#fff';
  const secondaryBarColor = isLight ? '#cbd5e1' : '#52525b';
  const cursorColor = isLight ? '#f1f5f9' : '#27272a';

  // Stats calculation
  const totalBalance = contacts.reduce((sum, c) => sum + (c.balance || 0), 0);
  const totalStockValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const pendingInvoices = invoices.filter(i => i.status === 'Taslak' || i.status === 'GİB Kuyruğunda').length;
  
  const criticalStocks = inventory.filter(i => i.quantity <= i.minStock).slice(0, 5);
  
  // Create unified timeline
  const recentTransactions = [
    ...invoices.map(i => ({ id: `inv-${i.id}`, title: `${i.no} Nolu ${i.type}`, desc: i.company, date: i.date, type: 'invoice', amount: i.amount })),
    ...purchases.map(p => ({ id: `pur-${p.id}`, title: `${p.poNumber} Nolu Alım`, desc: p.supplier, date: p.date, type: 'purchase', amount: p.total })),
    ...depots.map(d => ({ id: `dep-${d.id}`, title: `${d.docNo} Transfer`, desc: `${d.source} -> ${d.target}`, date: d.date, type: 'depot', amount: `${d.qty} ${d.unit}` }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  const stats = [
    ...(activeModules.finance ? [{ title: 'Kasa / Banka Bakiye', value: formatter.format(totalBalance), change: '+12.5%', color: 'text-blue-500', icon: DollarSign }] : []),
    ...(activeModules.inventory ? [{ title: 'Depo Stok Değeri', value: formatter.format(totalStockValue), change: '+4.2%', color: 'text-emerald-500', icon: Package }] : []),
    ...(activeModules.invoice ? [{ title: 'Bekleyen GİB Faturası', value: `${pendingInvoices} Adet`, change: '-2.1%', color: 'text-amber-500', icon: FileText }] : []),
    ...(activeModules.purchase ? [{ title: 'Aktif Satınalmalar', value: `${purchases.filter(p => p.status !== 'Tamamlandı').length} Adet`, change: '+8.4%', color: 'text-purple-500', icon: ShoppingCart }] : []),
    ...(activeModules.tickets ? [{ title: 'Açık Destek Talebi', value: `${tickets.filter(t => t.status === 'Açık').length} Adet`, change: '+2', color: 'text-rose-500', icon: Ticket }] : []),
    ...(activeModules.fleet ? [{ title: 'Bakımdaki Araçlar', value: `${fleet.filter(f => f.status === 'Bakımda').length} Araç`, change: '1 Yeni', color: 'text-orange-500', icon: Wrench }] : []),
    ...(activeModules.projects ? [{ title: 'Aktif Projeler', value: `${projects.filter(p => p.status === 'Devam Ediyor').length} Proje`, change: '%75', color: 'text-indigo-500', icon: Briefcase }] : []),
  ].slice(0, 4); // Sadece en üst 4 tanesini göster

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <LayoutDashboard size={24} className="text-blue-500" /> Ana Ekran
          </h1>
          <p className="text-[#94a3b8] text-sm mt-1">Sistem özeti ve güncel finansal durum analizi.</p>
        </div>
        <div className="relative flex items-center gap-3" ref={settingsRef}>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${showSettings ? 'bg-[#27272a] border-[#52525b] text-white' : 'bg-[#141414] border-[#27272a] text-[#94a3b8] hover:bg-[#27272a] hover:text-white'}`}
          >
            <Settings2 size={16} /> Görünümü Özelleştir
          </button>

          {/* Dashboard Widget Settings Dropdown */}
          {showSettings && (
            <div className="absolute top-12 right-0 w-64 bg-[#111111] border border-[#27272a] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-sm font-semibold text-white mb-3">Ana Ekran Kartları</h3>
              <div className="space-y-2">
                {[
                  { key: 'kpiCards', label: 'Özet İstatisik Kartları (KPI)' },
                  { key: 'revenueChart', label: 'Gelir/Gider Grafikleri' },
                  { key: 'stockAlerts', label: 'Kritik Stok Uyarıları' },
                  { key: 'recentTransactions', label: 'Son Hareketler (Akış)' }
                ].map(widget => (
                  <label key={widget.key} className="flex items-center justify-between p-2 rounded hover:bg-[#27272a]/50 cursor-pointer transition-colors">
                    <span className="text-sm text-[#94a3b8]">{widget.label}</span>
                    <input 
                      type="checkbox" 
                      checked={dashboardWidgets[widget.key as keyof typeof dashboardWidgets]}
                      onChange={() => toggleWidget(widget.key as keyof typeof dashboardWidgets)}
                      className="accent-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {dashboardWidgets.kpiCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-300">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#141414] border border-[#27272a] rounded-xl p-5 hover:border-[#52525b] transition-all group cursor-default">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#94a3b8] mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white tracking-tight truncate max-w-[150px]" title={stat.value}>{stat.value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-blue-500/10 ${stat.color} transition-colors`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}>{stat.change}</span>
                <span className="text-[#52525b] ml-2">geçen aya göre</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {dashboardWidgets.revenueChart && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300 delay-75">
          <div className="bg-[#141414] border border-[#27272a] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-6">Aylık Satış ve Tahsilat Eğilimi</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSatis" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', color: tooltipText }}
                    itemStyle={{ color: tooltipText, fontSize: '14px' }}
                  />
                  <Area type="monotone" dataKey="satis" name="Satış (Net)" stroke={primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorSatis)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#141414] border border-[#27272a] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-6">Gelir / Gider Analizi</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', color: tooltipText }}
                    itemStyle={{ color: tooltipText, fontSize: '14px' }}
                    cursor={{ fill: cursorColor, opacity: 0.8 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: textColor }} />
                  <Bar dataKey="satis" name="Gelir" fill={primaryColor} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tahsilat" name="Gider" fill={secondaryBarColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {dashboardWidgets.recentTransactions && (
          <div className="bg-[#141414] border border-[#27272a] rounded-xl flex flex-col animate-in fade-in zoom-in-95 duration-300 delay-100">
            <div className="p-5 border-b border-[#27272a] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Son Hareketler</h3>
              <span className="text-xs text-[#52525b]">Tüm modüller</span>
            </div>
            <div className="flex-1 overflow-y-auto max-h-96 p-2 custom-scrollbar">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-[#27272a]/50 rounded-lg transition-colors border-b border-[#27272a]/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      tx.type === 'invoice' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                      tx.type === 'purchase' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {tx.type === 'invoice' ? <FileText size={14}/> : tx.type === 'purchase' ? <ShoppingCart size={14}/> : <ArrowRightLeft size={14}/>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{tx.title}</span>
                      <span className="text-xs text-[#94a3b8] truncate max-w-[180px]">{tx.desc}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-white">{tx.amount}</span>
                    <span className="text-xs text-[#52525b]">{tx.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {dashboardWidgets.stockAlerts && (
          <div className="bg-[#141414] border border-[#27272a] rounded-xl flex flex-col animate-in fade-in zoom-in-95 duration-300 delay-150">
            <div className="p-5 border-b border-[#27272a] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                Kritik Stok Uyarıları <AlertCircle size={16} className="text-red-500" />
              </h3>
              <Link to="/stoklar" className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors">Tümünü Gör <ArrowRight size={12} /></Link>
            </div>
            <div className="flex-1 overflow-y-auto max-h-96 p-2 custom-scrollbar">
              {criticalStocks.length > 0 ? criticalStocks.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 hover:bg-[#27272a]/50 rounded-lg transition-colors border-b border-[#27272a]/50 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{item.name}</span>
                    <span className="text-xs text-[#94a3b8]">{item.code} | {item.warehouse}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-bold ${item.quantity === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                      {item.quantity} {item.unit}
                    </span>
                    <span className="text-xs text-[#52525b]">Min: {item.minStock} {item.unit}</span>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-12 text-[#52525b]">
                  <Package size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">Tüm stoklar güvenli seviyede.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
