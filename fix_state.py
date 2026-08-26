with open('src/pages/Login.tsx', 'r') as f:
    code = f.read()

# Fix Mail duplicate import
code = code.replace("MapPin, Phone, Mail", "MapPin, Phone")

# Add activeModal state
code = code.replace("const [isLoading, setIsLoading] = useState(false);", "const [isLoading, setIsLoading] = useState(false);\n  const [activeModal, setActiveModal] = useState<'kvkk' | 'privacy' | 'contact' | null>(null);")

with open('src/pages/Login.tsx', 'w') as f:
    f.write(code)
