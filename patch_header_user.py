with open('src/components/layout/Header.tsx', 'r') as f:
    code = f.read()

# Make sure we destructure userProfile
if "const { openDrawer, toggleSidebar, logout } = useUIStore();" in code:
    code = code.replace("const { openDrawer, toggleSidebar, logout } = useUIStore();", "const { openDrawer, toggleSidebar, logout, userProfile } = useUIStore();")

old_user = """              <div className="px-4 py-3 border-b border-[#27272a] mb-2 bg-[#1a1a1a]">
                <p className="text-sm font-bold text-white">Yönetici Hesabı</p>
                <p className="text-xs text-[#94a3b8]">admin@nexus.com</p>
              </div>"""

new_user = """              <div className="px-4 py-3 border-b border-[#27272a] mb-2 bg-[#1a1a1a]">
                <p className="text-sm font-bold text-white">{userProfile?.full_name || 'Sistem Yöneticisi'}</p>
                <p className="text-xs text-[#94a3b8]">{userProfile?.email || 'admin@nexus.com'}</p>
              </div>"""

code = code.replace(old_user, new_user)

with open('src/components/layout/Header.tsx', 'w') as f:
    f.write(code)
