with open('src/store/useUIStore.ts', 'r') as f:
    content = f.read()

# insert at the very end before the last }));
content = content.replace('  trackModuleUsage: (moduleKey) => set((state) => ({\n    moduleUsageStats: {\n      ...state.moduleUsageStats,\n      [moduleKey]: Date.now()\n    }\n  }))\n}));', '  trackModuleUsage: (moduleKey) => set((state) => ({\n    moduleUsageStats: {\n      ...state.moduleUsageStats,\n      [moduleKey]: Date.now()\n    }\n  })),\n  isAuthenticated: false,\n  login: () => set({ isAuthenticated: true }),\n  logout: () => set({ isAuthenticated: false })\n}));')

with open('src/store/useUIStore.ts', 'w') as f:
    f.write(content)
