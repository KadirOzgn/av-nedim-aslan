with open("/Users/kadirozgun/.gemini/av-nedim-aslan/public/tools/iscilik-hesaplama.html", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('html.embed body .calculator-card { border: none; background: transparent !important; box-shadow: none !important; padding: 0 !important; }', '')

with open("/Users/kadirozgun/.gemini/av-nedim-aslan/public/tools/iscilik-hesaplama.html", "w", encoding="utf-8") as f:
    f.write(content)
