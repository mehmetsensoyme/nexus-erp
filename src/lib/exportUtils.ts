export function downloadCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return;
  
  // Sadece ekranda görünen kolonları almak için basit bir map (id vs harici)
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => 
    Object.values(obj).map(val => {
      // Virgül içeren metinleri tırnak içine al
      const stringVal = String(val);
      return stringVal.includes(',') ? `"${stringVal}"` : stringVal;
    }).join(',')
  ).join('\n');
  
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
