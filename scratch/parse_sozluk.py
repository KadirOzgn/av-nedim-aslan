import re
import json
import os

input_file = "/Users/kadirozgun/.gemini/antigravity-ide/scratch/av-nedim-aslan/sozluk_raw.txt"
output_file = "/Users/kadirozgun/.gemini/antigravity-ide/scratch/av-nedim-aslan/src/data/sozluk.json"

turkish_alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ"

def slugify(text):
    text = text.lower()
    # Map Turkish characters
    tr_map = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'â': 'a', 'î': 'i', 'û': 'u', 'ç': 'c', 'ş': 's'
    }
    for tr_char, eng_char in tr_map.items():
        text = text.replace(tr_char, eng_char)
    
    # Replace non-alphanumeric with -
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def parse_sozluk():
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    with open(input_file, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f.readlines()]
    
    # Filter empty lines
    lines = [l for l in lines if l]
    
    # Skip header
    # ASLAN HUKUKTÜRK HUKUK SÖZLÜĞÜ
    # Nihai Site Sürümü — 901 Benzersiz Terim
    # Editoryal ve Kaynaklandırma Notu
    # Bu sözlükteki tanımlar...
    # We find where "A" starts
    start_index = 0
    for i, line in enumerate(lines[:10]):
        if line == "A":
            start_index = i
            break
            
    print(f"Starting parse from line index {start_index} ('{lines[start_index]}')")
    
    entries = []
    current_letter = "A"
    
    i = start_index
    while i < len(lines):
        line = lines[i]
        
        # Check if it's a letter divider
        if len(line) == 1 and line in turkish_alphabet:
            current_letter = line
            print(f"Found letter divider: {current_letter}")
            i += 1
            continue
            
        # Parse entry: Kavram, Tanım, Kaynak, Kaynak Türü
        if i + 3 < len(lines):
            kavram = lines[i]
            tanim = lines[i+1]
            kaynak_line = lines[i+2]
            kategori_line = lines[i+3]
            
            dayanak = kaynak_line.replace("Kaynak:", "").strip()
            kategori = kategori_line.replace("Kaynak Türü:", "").strip()
            
            slug = slugify(kavram)
            
            # Special check to make sure dayanak and kategori match prefix
            if not kaynak_line.startswith("Kaynak:"):
                print(f"Warning: Expected 'Kaynak:' at line {i+2}, got: '{kaynak_line}'")
            if not kategori_line.startswith("Kaynak Türü:"):
                print(f"Warning: Expected 'Kaynak Türü:' at line {i+3}, got: '{kategori_line}'")
                
            entries.append({
                "slug": slug,
                "kavram": kavram,
                "harf": current_letter,
                "tanim": tanim,
                "dayanak": dayanak,
                "kategori": kategori
            })
            i += 4
        else:
            print(f"Warning: Incomplete entry at the end of file: {lines[i:]}")
            break
            
    print(f"Parsed {len(entries)} entries successfully.")
    
    # Save as JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)
    print(f"Saved JSON database to {output_file}")

if __name__ == "__main__":
    parse_sozluk()
