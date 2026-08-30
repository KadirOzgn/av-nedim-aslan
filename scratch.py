import json

def extract_html():
    with open('/Users/kadirozgun/.gemini/antigravity-ide/brain/8301b182-ad5e-4bbe-8b2c-337e02f26fd5/.system_generated/logs/transcript_full.jsonl', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for line in reversed(lines):
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                content = data.get('content', '')
                if '<!doctype html>' in content.lower():
                    start_idx = content.lower().find('<!doctype html>')
                    end_idx = content.lower().rfind('</html>') + 7
                    html_content = content[start_idx:end_idx]
                    
                    with open('/Users/kadirozgun/.gemini/av-nedim-aslan/public/araclar/infaz-hesaplama.html', 'w', encoding='utf-8') as out:
                        out.write(html_content)
                    print(f"Successfully extracted {len(html_content)} bytes of HTML.")
                    return
        except Exception as e:
            continue
    print("Could not find HTML in transcript.")

if __name__ == '__main__':
    extract_html()
