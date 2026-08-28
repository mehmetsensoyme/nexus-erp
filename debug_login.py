with open('src/pages/Login.tsx', 'r') as f:
    code = f.read()

code = code.replace("toast.error('Beklenmeyen bir hata oluştu.');", "toast.error('Hata: ' + (err.message || err)); console.error(err);")

with open('src/pages/Login.tsx', 'w') as f:
    f.write(code)
