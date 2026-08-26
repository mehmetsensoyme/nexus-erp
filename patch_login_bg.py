import re

with open('src/pages/Login.tsx', 'r') as f:
    code = f.read()

# Change root background from #050505 to #141414 (lighter dark)
code = code.replace('className="min-h-screen bg-[#050505]', 'className="min-h-screen bg-[#141414]')

# Change left side background to be slightly darker (#0a0a0a to #050505)
code = code.replace('bg-gradient-to-br from-[#0a0a0a]/80 to-[#050505]/80', 'bg-gradient-to-br from-[#0a0a0a] to-[#000000]')

# Adjust input backgrounds to stand out from #141414 (make them slightly lighter like #1c1c1f)
code = code.replace('bg-[#111111] hover:bg-[#141414] focus:bg-[#141414]', 'bg-[#1c1c1f] hover:bg-[#27272a] focus:bg-[#27272a]')

# Revamp the bottom section (remove absolute QuanixHQ watermark and replace with a unified footer)
watermark_pattern = r'\{\/\* QuanixHQ Watermark \*\/\}.*?<\/div>\s*<\/div>'

new_footer = """{/* Subtle Footer */}
      <div className="absolute bottom-6 w-full flex flex-col md:flex-row justify-between items-center px-8 pointer-events-none z-20 text-[11px] text-[#52525b] gap-4 md:gap-0">
        <div className="flex items-center gap-4 pointer-events-auto">
          <a href="#" className="hover:text-[#94a3b8] transition-colors">KVKK Metni</a>
          <a href="#" className="hover:text-[#94a3b8] transition-colors">Gizlilik Sözleşmesi</a>
          <a href="#" className="hover:text-[#94a3b8] transition-colors">İletişim</a>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto bg-[#141414]/80 px-3 py-1.5 rounded-full border border-[#27272a] backdrop-blur-md">
          <Command size={12} className="text-blue-500" />
          <span>
            <span className="text-[#94a3b8] font-medium">NexusERP</span> altyapısı <span className="text-white font-semibold">QuanixHQ</span> tarafından geliştirilmiştir.
          </span>
        </div>
      </div>
      
    </div>"""

code = re.sub(watermark_pattern, new_footer, code, flags=re.DOTALL)

with open('src/pages/Login.tsx', 'w') as f:
    f.write(code)
