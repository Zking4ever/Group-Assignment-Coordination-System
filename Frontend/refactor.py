import os
import re
import shutil

ROOT_DIR = r"c:\Users\USER\Documents\Group-Assignment-Coordination-System\Frontend"
SRC_DIR = os.path.join(ROOT_DIR, "src")
PAGES_DIR = os.path.join(SRC_DIR, "pages")
COMPONENTS_DIR = os.path.join(SRC_DIR, "components")
ASSETS_CSS_DIR = os.path.join(SRC_DIR, "assets", "css")

os.makedirs(ASSETS_CSS_DIR, exist_ok=True)

jsx_files = []
css_files = []
original_dirs = set()

# Collect files
for root, dirs, files in os.walk(SRC_DIR):
    if "node_modules" in root or "dist" in root or "assets" in root:
        continue
    for f in files:
        path = os.path.join(root, f)
        if f.endswith(".jsx"):
            jsx_files.append(path)
            original_dirs.add(root)
        elif f.endswith(".module.css"):
            css_files.append(path)
            original_dirs.add(root)

pages_names = set()
components_names = set()

for path in jsx_files:
    name = os.path.basename(path).replace(".jsx", "")
    if "pages" in path.replace("\\", "/"):
        pages_names.add(name)
    elif "components" in path.replace("\\", "/"):
        components_names.add(name)

# 1. Transform CSS
for css_path in css_files:
    comp_name = os.path.basename(css_path).replace(".module.css", "")
    new_css_path = os.path.join(ASSETS_CSS_DIR, f"{comp_name}.css")
    
    with open(css_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Prefix class names (avoids replacing things inside values, e.g., 0.5s by enforcing a starting character)
    content = re.sub(r'\.([a-zA-Z_][a-zA-Z0-9_-]*)', r'.' + comp_name + r'-\1', content)
    
    with open(new_css_path, "w", encoding="utf-8") as f:
        f.write(content)

# 2. Transform JSX
def replace_import(match):
    full_match = match.group(0)
    import_path = match.group(1)
    
    if import_path.startswith(".") or "@components" in import_path or "@pages" in import_path:
        basename = import_path.split("/")[-1].replace(".jsx", "")
        if basename in pages_names:
            return full_match.replace(import_path, f"@pages/{basename}.jsx")
        elif basename in components_names:
            return full_match.replace(import_path, f"@components/{basename}.jsx")
    return full_match

for jsx_path in jsx_files:
    comp_name = os.path.basename(jsx_path).replace(".jsx", "")
    with open(jsx_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Replace CSS module imports
    if comp_name in pages_names or comp_name in components_names:
        content = re.sub(r'import\s+styles\s+from\s+[\'"].*\.module\.css[\'"];?', f"import '../assets/css/{comp_name}.css';", content)
    else:
        content = re.sub(r'import\s+styles\s+from\s+[\'"].*\.module\.css[\'"];?', f"import './assets/css/{comp_name}.css';", content)
    
    # Rewrite CSS interpolations
    # e.g., className={styles.page} -> className={"HomePage-page"}
    content = re.sub(r'styles\.([a-zA-Z0-9_-]+)', f'"{comp_name}-\\g<1>"', content)
    
    # e.g., className={styles[someVar]} -> className={("HomePage-" + (someVar))}
    content = re.sub(r'styles\[(.*?)\]', f'("{comp_name}-" + (\\g<1>))', content)

    # Convert dynamic imports pointing to module.css (if any)
    
    # Smart import resolving
    content = re.sub(r'from\s+[\'"](.*?)[\'"]', replace_import, content)
    
    # Write to new path
    if comp_name in pages_names:
        new_path = os.path.join(PAGES_DIR, f"{comp_name}.jsx")
    elif comp_name in components_names:
        new_path = os.path.join(COMPONENTS_DIR, f"{comp_name}.jsx")
    else:
        new_path = jsx_path
        
    with open(new_path, "w", encoding="utf-8") as f:
        f.write(content)
        
# 3. Clean up old files and directories
for path in jsx_files + css_files:
    comp_name = os.path.basename(path).replace(".jsx", "").replace(".module.css", "")
    
    # Determine the destination path based on logic
    # In order to not delete the file if it's already in the correct place:
    if f"pages\\{comp_name}.jsx" in path or f"pages/{comp_name}.jsx" in path:
        continue
    if f"components\\{comp_name}.jsx" in path or f"components/{comp_name}.jsx" in path:
        continue
    if f"App.jsx" in path or f"main.jsx" in path:
        continue
        
    if os.path.exists(path):
        os.remove(path)

# Try cleaning up empty directories in src
for _ in range(3): # Run a few times for nested dirs
    for root, dirs, files in os.walk(SRC_DIR, topdown=False):
        if root == SRC_DIR or root == PAGES_DIR or root == COMPONENTS_DIR or "assets" in root:
            continue
        try:
            if not os.listdir(root): # empty
                os.rmdir(root)
        except:
            pass

print("Refactoring complete.")
