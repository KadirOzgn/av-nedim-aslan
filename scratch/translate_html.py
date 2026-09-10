from bs4 import BeautifulSoup

def translate_html():
    print("Reading HTML file...")
    with open("public/araclar/infaz-hesaplama-en.html", "r", encoding="utf-8") as f:
        html_content = f.read()

    translations = {
        "Süreli hapis": "Fixed-Term Prison",
        "Akıllı rehber": "Smart Guide",
        "Müebbet": "Life Sentence",
        "Kontrol": "Check",
        "Bu hesap neyi gösterir?": "What does this calculator show?",
        "Kesinleşmiş hapis cezasına göre koşullu salıverme, denetimli serbestlik ve bihakkın tahliye tarihlerini gösterir. HAGB, ertelenmiş ceza, seçenek yaptırım, tazyik ve disiplin hapsi bu hesabın dışındadır.": "Shows conditional release, supervised release, and final discharge dates based on finalized prison sentences. Excludes HAGB, suspended sentences, alternative sanctions, and disciplinary confinement.",
        "Nasıl kullanılır?": "How to use?",
        "Karardaki tarih ve ceza bilgilerini sırayla girin. Bilgi dosyada yoksa “Kontrol edilmedi” seçeneğini kullanın.": "Enter the date and sentence information from the judgment sequentially. If the information is not in the file, use the 'Not checked' option.",
        "Suç tarihi": "Offense Date",
        "İnfaza başlangıç": "Execution Start Date",
        "Doğum tarihi": "Date of Birth",
        "Cinsiyet": "Gender",
        "Seçilmedi": "Not Selected",
        "Erkek": "Male",
        "Kadın": "Female",
        "Koşullu salıverme oranını değiştirmez. Kadın hükümlülere ilişkin özel alanları açar.": "Does not change the conditional release rate. Opens special fields for female convicts.",
        "Arama yapın...": "Search...",
        "Offense": "Offense",
        "Karar bilgileri": "Judgment Information",
        "Hüküm ve infaz bilgileri": "Judgment and Execution Info",
        "Hükmün durumu": "Finality of Judgment",
        "Kontrol edilmedi": "Not Checked",
        "Kesinleşti": "Finalized",
        "Kesinleşmedi": "Not Finalized",
        "Yaptırım": "Sanction Type",
        "Adlî para cezasından çevrilen hapis": "Prison sentence converted from judicial fine",
        "Ertelenmiş hapis, TCK m.51": "Suspended prison sentence (TCK Art. 51)",
        "Seçenek yaptırım, TCK m.50": "Alternative sanction (TCK Art. 50)",
        "Hükmün açıklanmasının geri bırakılması": "Deferment of the announcement of the verdict (HAGB)",
        "Tazyik veya zorlama hapsi": "Coercive imprisonment",
        "Disiplin hapsi": "Disciplinary confinement",
        "Örgüt veya terör bağlantısı": "Organized Crime or Terror Connection",
        "Yok": "None",
        "Örgüt faaliyeti kapsamında": "Within the scope of organized crime",
        "Terör suçu": "Terror offense",
        "Yaralama suçunda mağdur niteliği": "Victim status in injury offense",
        "Uygulanmaz": "Not Applicable",
        "Özel mağdur niteliği yok": "No special victim status",
        "Üstsoy, altsoy, eş, kardeş veya kendini savunamayacak kişi": "Ascendant, descendant, spouse, sibling, or person unable to defend themselves",
        "Conditional Release yasağı": "Conditional Release Ban",
        "Yasak yok": "No ban",
        "5275 m.107/16": "Law No. 5275 Art. 107/16",
        "TMK m.17 firar, ayaklanma veya üç hücre cezası": "TMK Art. 17: escape, riot, or three cellular confinement penalties",
        "Kesinleşmeden sonra yeniden TMK suçu": "New TMK offense after finalization",
        "5275 Geçici m.2": "Law No. 5275 Provisional Art. 2",
        "Geri alma sonrası aynı ilam aynen infaz ediliyor": "Same judgment executed exactly after revocation",
        "Başka kanuni yasak": "Other statutory ban",
        "Kararda farklı bir infaz oranı veya istisna bulunmuyor": "No different execution rate or exception in the judgment",
        "Önce temel suçu, sonra varsa örgüt veya terör bağlantısını seçin. Örneğin TCK 188 hükmünde her iki bilgi ayrı ayrı girilmelidir.": "First select the base offense, then organized crime/terror connection if any. For example, both must be entered separately for TCK 188.",
        "Dikkat:": "Attention:",
        "Bu suç müebbet veya ağırlaştırılmış müebbet gerektirebilir. Year, ay ve gün alanlarını yalnız hükümde süreli hapis cezası yazıyorsa doldurun.": "This offense may require a life or aggravated life sentence. Fill in the Year, Month, and Day fields only if a fixed-term prison sentence is specified in the judgment.",
        "Hükümde süreli hapis cezası var.": "There is a fixed-term prison sentence in the judgment.",
        "Year": "Year",
        "Month": "Month",
        "Day": "Day",
        "Süre hesabı": "Duration Calculation",
        "Kesinleşmiş ilamdaki sonuç cezayı aynen girin. Birden fazla ilamı tek satırda toplamayın. Monthlar 30 gün üzerinden hesaplanır; 12 ay, 360 gün olarak kalır. Tam günler infaza giriş günü ilk gün kabul edilerek takvim üzerinde sayılır; gün kesri infaz edilmez.": "Enter the final sentence exactly as in the finalized judgment. Do not sum multiple judgments in a single row. Months are calculated as 30 days; 12 months remain 360 days. Full days are counted on the calendar with the execution entry day as the first day; fractions of a day are not executed.",
        "Tekerrür": "Recidivism",
        "Birinci defa": "First time",
        "İkinci defa": "Second time",
        "İyi hâl": "Good Conduct",
        "Olumlu": "Positive",
        "Olumsuz veya henüz değerlendirilmedi": "Negative or not yet evaluated",
        "Salıverilme bilgileri": "Release Information",
        "Koşullu salıverme engeli": "Conditional Release Obstacle",
        "Engel yok": "No obstacle",
        "Disiplin engeli var": "Disciplinary obstacle exists",
        "Kanuni yasak var": "Statutory ban exists",
        "Supervised Release": "Supervised Release (Probation)",
        "Talep var; açık kurumda veya çocuk eğitimevinde": "Request made; in open institution or juvenile reformatory",
        "Talep var; açığa ayrılma hakkı doğdu ancak ayrılamadı": "Request made; right to open institution arose but could not be transferred",
        "Talep var; kapalı kurumda ve açığa ayrılma hakkı yok": "Request made; in closed institution and no right to open institution",
        "Talep yok": "No request",
        "Gösterilen tarih, infaz hâkiminin kararı değildir.": "The date shown is not an execution judge's decision.",
        "5275 m.105/A denetimli serbestlik koşulları": "Conditions for Supervised Release under Law No. 5275 Art. 105/A",
        "Hükümlünün talebi": "Convict's Request",
        "Talep var": "Request exists",
        "Kurum durumu": "Institution Status",
        "Açık kurumda veya çocuk eğitimevinde": "In open institution or juvenile reformatory",
        "Açığa ayrılma şartı oluştu; iradesi dışında ayrılamadı veya kapalıya döndü": "Conditions for open institution met; unable to transfer against will or returned to closed",
        "Kapalı kurumda; açığa ayrılma hakkı yok": "In closed institution; no right to open institution",
        "İnfaz hâkimi kararı": "Execution Judge Decision",
        "Karar bekleniyor": "Decision pending",
        "Uygulanmasına karar verildi": "Decided to be applied",
        "Talep reddedildi": "Request denied",
        "Disiplin cezası durumu": "Disciplinary Penalty Status",
        "Conditional Releaseye engel disiplin cezası yok": "No disciplinary penalty preventing conditional release",
        "Engel disiplin cezası var": "Disciplinary penalty preventing release exists",
        "m.105/A için açık kurum, çocuk eğitimevi veya hükümlünün iradesi dışında açığa ayrılamaması şartlarından biri aranır. Geçici m.6 kapsamındaki istisna ayrıca incelenir.": "For Art. 105/A, being in an open institution, juvenile reformatory, or inability to transfer to open institution against will is required. Exceptions under Provisional Art. 6 are examined separately.",
        "Yaş veya sağlık nedeniyle özel denetimli serbestlik": "Special supervised release due to age or health",
        "m.105/A/3-b ve Geçici m.6 kapsamını kontrol et": "Check scope of Art. 105/A/3-b and Provisional Art. 6",
        "Ağır hastalık, engellilik veya kocama nedeniyle hayatını yalnız sürdüremiyor": "Unable to live alone due to severe illness, disability, or old age",
        "Usulüne uygun sağlık kurulu veya Adlî Tıp raporu var": "Proper medical board or Forensic Medicine report exists",
        "Şartların ve geçerli raporun birlikte oluştuğu tarih": "Date when conditions and valid report coincided",
        "Özel uygulama, şartların ve geçerli raporun birlikte oluştuğu tarihten önce başlayamaz. Tarih bilinmiyorsa ana sonuca eklenmez.": "Special application cannot start before conditions and valid report coincided. If date is unknown, not added to main result.",
        "30.03.2020 ve öncesi istisna dışı suçlarda 70 yaşını bitirenler için dört yıllık süre; 65 yaşını bitirmiş ve hayatını yalnız idame ettiremeyenler için azami süre sınırı aranmayan yol ayrıca kontrol edilir.": "For non-excepted offenses on or before 30.03.2020, 4-year period for those over 70; path without max duration for those over 65 unable to live alone is checked separately.",
        "Birinci tekerrür — 108. maddenin ikinci fıkrası üst sınırı": "First Recidivism - Upper limit under Article 108, Paragraph 2",
        "Tekerrür nedeniyle eklenecek süre, tekerrüre esas en ağır önceki cezayı geçemez.": "Time added due to recidivism cannot exceed the heaviest previous sentence based on recidivism.",
        "Önceki ceza yıl": "Previous sentence year",
        "Varsa mahsup süresini ekle": "Add deduction period if any (Time served)",
        "Basit mahsup yıl": "Simple deduction year",
        "Tarihli mahsup": "Deduction by Date",
        "Tutukluluk ve gözaltı dönemlerini ayrı girin. Tarihlerden gün sayısı hesaplanır; tarih yoksa gün sayısını elle yazabilirsiniz. Dönem eklendiğinde yukarıdaki basit mahsup yerine dönem toplamı kullanılır.": "Enter detention and custody periods separately. Days calculated from dates; if no date, enter days manually. Period total replaces simple deduction above when added.",
        "+ Mahsup dönemi ekle": "+ Add deduction period",
        "Dönem mahsup toplamı:": "Period deduction total:",
        "Hesapla": "Calculate",
        "Temizle": "Clear",
        "Yazdır veya PDF": "Print or PDF"
    }

    soup = BeautifulSoup(html_content, "html.parser")
    
    tags_to_translate = ['h1', 'h2', 'h3', 'h4', 'label', 'button', 'span', 'b', 'small', 'p', 'option', 'summary', 'th', 'td', 'div']
    
    def replace_text(node):
        if node.name in tags_to_translate:
            if node.string and node.string.strip():
                orig = node.string.strip()
                for tr_key, tr_val in translations.items():
                    if tr_key in orig:
                        orig = orig.replace(tr_key, tr_val)
                node.string.replace_with(orig)
            else:
                for child in node.children:
                    if child.name is None: 
                        orig = child.string.strip()
                        if orig:
                            for tr_key, tr_val in translations.items():
                                if tr_key in orig:
                                    orig = orig.replace(tr_key, tr_val)
                            child.string.replace_with(orig)
                    else:
                        replace_text(child)

    replace_text(soup)
    
    with open("public/araclar/infaz-hesaplama-en.html", "w", encoding="utf-8") as f:
        f.write(str(soup))
        
    print("Direct translation complete.")

if __name__ == "__main__":
    translate_html()
