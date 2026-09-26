import glob

for file in glob.glob("/Users/kadirozgun/.gemini/av-nedim-aslan/public/tools/*-hesaplama.html"):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if .legal-banner is explicitly mentioned in html.embed block
    if '.legal-banner' in content and 'html.embed body .legal-banner' not in content:
        # We need to make sure it's hidden
        pass
