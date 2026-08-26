import re

with open('src/pages/Login.tsx', 'r') as f:
    code = f.read()

# 1. Import useClickOutside
if 'useClickOutside' not in code:
    code = code.replace("import { useUIStore } from '../store/useUIStore';", "import { useUIStore } from '../store/useUIStore';\nimport { useClickOutside } from '../hooks/useClickOutside';")

# 2. Add the hook
if 'const modalRef' not in code:
    code = code.replace("const [activeModal, setActiveModal] = useState<'kvkk' | 'privacy' | 'contact' | null>(null);", "const [activeModal, setActiveModal] = useState<'kvkk' | 'privacy' | 'contact' | null>(null);\n  const modalRef = useClickOutside(() => setActiveModal(null));")

# 3. Add ref to the modal content div
code = code.replace('<div className="bg-[#141414] border border-[#27272a] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95">', '<div ref={modalRef as any} className="bg-[#141414] border border-[#27272a] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95">')

with open('src/pages/Login.tsx', 'w') as f:
    f.write(code)
