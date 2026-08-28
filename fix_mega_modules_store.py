import re

with open('src/store/useUIStore.ts', 'r') as f:
    code = f.read()

# 1. Fix ModuleId type
# Find the line starting with "export type ModuleId ="
code = re.sub(r"(export type ModuleId = '.*?');", r"\1 | 'pos' | 'field_service' | 'quality' | 'ecommerce' | 'assets' | 'expenses' | 'contracts' | 'edevlet';", code)

# 2. Fix the activeModules interface
interface_addition = """    reports: boolean;
    pos: boolean;
    field_service: boolean;
    quality: boolean;
    ecommerce: boolean;
    assets: boolean;
    expenses: boolean;
    contracts: boolean;
    edevlet: boolean;"""
code = re.sub(r"reports: boolean;", interface_addition, code)

# 3. Fix the activeModules default values
default_addition = """    marketing: false,
    pos: true,
    field_service: true,
    quality: true,
    ecommerce: true,
    assets: true,
    expenses: true,
    contracts: true,
    edevlet: true,"""
code = re.sub(r"marketing: false,", default_addition, code)

with open('src/store/useUIStore.ts', 'w') as f:
    f.write(code)
