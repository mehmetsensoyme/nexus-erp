with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

content = content.replace("    </div>\n\n    </div>\n  );\n}", "    </div>\n  );\n}")

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)
