import re

with open('src/components/layout/Sidebar.tsx', 'r') as f:
    code = f.read()

# Make sure we get companyLogo and companyName
code = code.replace(
    "const { activeModules, isSidebarOpen, toggleSidebar, moduleSortPreference, favoriteModules } = useUIStore();",
    "const { activeModules, isSidebarOpen, toggleSidebar, moduleSortPreference, favoriteModules, companyLogo, companyName } = useUIStore();"
)

# Replace the Link content with the dynamic logo and name
old_logo = """<Link to="/" className="flex items-center gap-2.5 text-white hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <Command size={16} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-[#94a3b8]">
                Nexus
              </span>
            </Link>"""

new_logo = """<Link to="/" className="flex items-center gap-2.5 text-white hover:opacity-80 transition-opacity">
              {companyLogo ? (
                <img src={companyLogo} alt="Logo" className="w-7 h-7 rounded-lg object-contain bg-[#141414] border border-[#27272a] shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                  <Command size={16} className="text-white" />
                </div>
              )}
              <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-[#94a3b8] truncate max-w-[120px]">
                {companyName || 'Nexus'}
              </span>
            </Link>"""

code = code.replace(old_logo, new_logo)

# Closed sidebar view
old_closed = """<button onClick={toggleSidebar} className="text-[#52525b] hover:text-white transition-colors shrink-0 p-1.5 rounded-md hover:bg-[#27272a] mx-auto flex items-center justify-center">
            <Menu size={18} />
          </button>"""

new_closed = """<button onClick={toggleSidebar} className="mx-auto flex items-center justify-center hover:opacity-80 transition-opacity" title="Menüyü Genişlet">
            {companyLogo ? (
              <img src={companyLogo} alt="Logo" className="w-8 h-8 rounded-xl object-contain bg-[#141414] border border-[#27272a]" />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Command size={16} className="text-white" />
              </div>
            )}
          </button>"""

code = code.replace(old_closed, new_closed)

with open('src/components/layout/Sidebar.tsx', 'w') as f:
    f.write(code)
