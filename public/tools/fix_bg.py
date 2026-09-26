import glob

for file in glob.glob("/Users/kadirozgun/.gemini/av-nedim-aslan/public/tools/*-hesaplama.html"):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add html.embed { background: transparent !important; } if not there
    if 'html.embed { background: transparent !important; }' not in content:
        content = content.replace('html.embed body { background: transparent !important; }', 'html.embed, html.embed body { background: transparent !important; }')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed HTML backgrounds.")
