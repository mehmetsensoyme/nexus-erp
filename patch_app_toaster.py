import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Add import
if "import { Toaster } from 'react-hot-toast';" not in code:
    code = code.replace("import Login from './pages/Login';", "import Login from './pages/Login';\nimport { Toaster } from 'react-hot-toast';")

# Add Toaster to render
old_render = """  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>"""

new_render = """  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>"""

code = code.replace(old_render, new_render)
# Fix the closing tag
code = code.replace("</Routes>\n  );\n}", "</Routes>\n    </>\n  );\n}")

with open('src/App.tsx', 'w') as f:
    f.write(code)
