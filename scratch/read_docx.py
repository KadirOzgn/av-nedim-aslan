import zipfile
import xml.etree.ElementTree as ET
import os

docx_path = "/Users/kadirozgun/Library/Containers/net.whatsapp.WhatsApp/Data/tmp/documents/6F8781F4-DFF6-47DD-8A4A-82D327AF05BA/Aslan_Hukuk_Turk_Hukuk_Sozlugu_SITEYE_YUKLENECEK_NIHAI.docx"
output_txt_path = "/Users/kadirozgun/.gemini/antigravity-ide/scratch/av-nedim-aslan/sozluk_raw.txt"

def extract_text_from_docx(docx_file):
    try:
        with zipfile.ZipFile(docx_file) as z:
            xml_content = z.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Namespaces
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for p in root.findall('.//w:p', ns):
                p_text = []
                for t in p.findall('.//w:t', ns):
                    p_text.append(t.text)
                paragraphs.append(''.join(p_text))
            
            return '\n'.join(paragraphs)
    except Exception as e:
        print(f"Error: {e}")
        return None

if os.path.exists(docx_path):
    print("Found docx file at:", docx_path)
    text = extract_text_from_docx(docx_path)
    if text:
        with open(output_txt_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print("Successfully extracted and wrote text to:", output_txt_path)
        print("Text size:", len(text), "chars")
        print("\nFirst 1000 characters:")
        print(text[:1000])
    else:
        print("Failed to extract text from docx.")
else:
    print("Docx file not found.")
