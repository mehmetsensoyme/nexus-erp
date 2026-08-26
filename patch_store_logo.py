import re
with open('src/store/useUIStore.ts', 'r') as f:
    content = f.read()

# Add company settings
content = content.replace("  isAuthenticated: boolean;", "  companyLogo: string | null;\n  setCompanyLogo: (logo: string) => void;\n  companyName: string;\n  setCompanyName: (name: string) => void;\n  isAuthenticated: boolean;")
content = content.replace("  isAuthenticated: false,", "  companyLogo: null,\n  setCompanyLogo: (logo) => set({ companyLogo: logo }),\n  companyName: 'Nexus Yazılım A.Ş.',\n  setCompanyName: (name) => set({ companyName: name }),\n  isAuthenticated: false,")

with open('src/store/useUIStore.ts', 'w') as f:
    f.write(content)
