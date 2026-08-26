import re

with open('src/pages/Login.tsx', 'r') as f:
    code = f.read()

# Remove useRef and Upload import if needed (leave Upload out of render)
code = code.replace("import { useState, useRef }", "import { useState }")

# Remove logic
code = re.sub(r'const fileInputRef = useRef<HTMLInputElement>\(null\);\n', '', code)
code = re.sub(r'const handleLogoUpload.*?};\n\n  return', 'return', code, flags=re.DOTALL)

# Remove click handlers and upload overlays from desktop logo
code = re.sub(r'onClick=\{\(\) => fileInputRef.current\?\.click\(\)\}', '', code)
code = re.sub(r'title="Şirket logonuzu değiştirmek için tıklayın"', '', code)
code = re.sub(r'<input\s+type="file"\s+ref=\{fileInputRef\}[^>]+>', '', code)
code = re.sub(r'<div className="absolute inset-0 bg-black/60[^>]+>\s*<Upload[^>]+>\s*</div>', '', code)
code = re.sub(r'<div className="absolute inset-0 bg-blue-500/10[^>]+>\s*<Upload[^>]+>\s*</div>', '', code)

# Remove click handler from mobile logo
code = code.replace("onClick={() => fileInputRef.current?.click()}", "")
code = code.replace("group-hover:border-blue-500/50", "")
code = code.replace("group-hover:text-blue-400", "")
code = code.replace("group-hover:text-[#94a3b8]", "")
code = code.replace("cursor-pointer", "")
code = code.replace("group-hover:scale-90", "")

with open('src/pages/Login.tsx', 'w') as f:
    f.write(code)
