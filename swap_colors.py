import re

with open('src/pages/Login.tsx', 'r') as f:
    code = f.read()

# 1. Root background -> Black (Right side becomes black)
code = code.replace('className="min-h-screen bg-[#18181b]', 'className="min-h-screen bg-[#000000]')

# 2. Left side background -> Füme (Charcoal/Zinc-900)
code = code.replace('bg-gradient-to-br from-[#050505] to-[#000000]', 'bg-gradient-to-br from-[#18181b] to-[#111111]')

# 3. Inputs on the right side -> Stand out against black
# We had bg-[#27272a]/50, let's change them to #141414
code = code.replace('bg-[#27272a]/50 hover:bg-[#27272a]', 'bg-[#141414] hover:bg-[#1c1c1f]')
code = code.replace('focus:bg-[#27272a]', 'focus:bg-[#1c1c1f]')

with open('src/pages/Login.tsx', 'w') as f:
    f.write(code)
