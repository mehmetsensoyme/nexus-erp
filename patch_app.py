with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { useUIStore } from './store/useUIStore';",
    "import { useUIStore } from './store/useUIStore';\nimport Login from './pages/Login';"
)

content = content.replace(
    "const { themeMode } = useUIStore();",
    "const { themeMode, isAuthenticated } = useUIStore();"
)

router_replacement = """  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
"""
content = content.replace("  return (\n    <Routes>", router_replacement + "    <Routes>")

with open('src/App.tsx', 'w') as f:
    f.write(content)
