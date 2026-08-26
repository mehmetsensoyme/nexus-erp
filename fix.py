import re
with open('src/store/useUIStore.ts', 'r') as f:
    content = f.read()

# I will just write exactly what it should be from line 135 downwards.
end_content = """
  moduleSortPreference: 'default',
  setModuleSortPreference: (pref) => set({ moduleSortPreference: pref }),

  favoriteModules: [],
  toggleFavoriteModule: (moduleKey) => set((state) => ({
    favoriteModules: state.favoriteModules.includes(moduleKey)
      ? state.favoriteModules.filter(k => k !== moduleKey)
      : [...state.favoriteModules, moduleKey]
  })),

  moduleUsageStats: {},
  trackModuleUsage: (moduleKey) => set((state) => ({
    moduleUsageStats: {
      ...state.moduleUsageStats,
      [moduleKey]: Date.now()
    }
  }))
}));
"""

lines = content.split('\n')
good_lines = lines[:135]
final_content = '\n'.join(good_lines) + end_content

with open('src/store/useUIStore.ts', 'w') as f:
    f.write(final_content)
