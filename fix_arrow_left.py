with open('src/pages/Login.tsx', 'r') as f:
    code = f.read()

# Add ArrowLeft to imports if it's missing
if 'ArrowLeft' not in code.split('from \'lucide-react\'')[0]:
    code = code.replace("Phone }", "Phone, ArrowLeft }")

with open('src/pages/Login.tsx', 'w') as f:
    f.write(code)
