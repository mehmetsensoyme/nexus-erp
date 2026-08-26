with open('src/store/useUIStore.ts', 'r') as f:
    code = f.read()

# Replace companyLogo: null with companyLogo: '/logo.jpg'
code = code.replace("companyLogo: null", "companyLogo: '/logo.jpg'")

with open('src/store/useUIStore.ts', 'w') as f:
    f.write(code)
