import os
import glob

html_files = glob.glob("/Users/kadirozgun/.gemini/av-nedim-aslan/public/tools/*-hesaplama.html")
script_to_inject = """<script>
  (function(){
    try {
      var search = window.location.search;
      if (search.indexOf('embed=1') !== -1) document.documentElement.classList.add('embed');
      var isDark = false;
      if (window.parent && window.parent.document) {
        isDark = window.parent.document.documentElement.classList.contains('dark');
      }
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.dataset.theme = 'dark';
      }
    } catch(e){}
  })();
</script>
"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Inject script after <head> or meta charset
    if script_to_inject not in content:
        content = content.replace('<head>', '<head>\n' + script_to_inject)
    
    # Replace body.embed with html.embed body
    content = content.replace('body.embed ', 'html.embed body ')
    content = content.replace('body.embed.', 'html.embed body.')
    content = content.replace('body.embed#', 'html.embed body#')
    content = content.replace('body.embed{', 'html.embed body{')
    content = content.replace('body.embed {', 'html.embed body {')
    
    # Remove the onload attribute from body
    content = content.replace('onload="if(new URLSearchParams(location.search).get(\'embed\')===\'1\')document.body.classList.add(\'embed\')"', '')
    
    # Also handle the one with data-mode
    # <body data-mode="citizen" onload="...">
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed HTML files for synchronous embed/dark mode.")
