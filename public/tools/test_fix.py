import glob

for file in glob.glob("/Users/kadirozgun/.gemini/av-nedim-aslan/public/tools/*-hesaplama.html"):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the problematic `#root { overflow: hidden }` line from iscilik
    content = content.replace('html.embed body #root { padding-top: 0; max-width: 100%; overflow: hidden; }', '')
    
    # Let's make sure `.form-card` is NOT display: none
    content = content.replace('.topbar, .legal-banner, .mode-row, .stepper, .form-card, footer { display: none !important; }', '/* removed display none */')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed potentially breaking rules.")
