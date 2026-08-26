with open('src/components/layout/Header.tsx', 'r') as f:
    code = f.read()

# Add logout to useUIStore destructure
code = code.replace("const { isSidebarOpen, toggleSidebar, openDrawer } = useUIStore();", "const { isSidebarOpen, toggleSidebar, openDrawer, logout } = useUIStore();")

# Replace "Çıkış Yap" dummy button with real logout action
code = code.replace('className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-[#27272a] rounded-lg transition-colors flex items-center gap-2"', 'onClick={logout}\n                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-[#27272a] rounded-lg transition-colors flex items-center gap-2"')

with open('src/components/layout/Header.tsx', 'w') as f:
    f.write(code)
