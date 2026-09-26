with open("/Users/kadirozgun/.gemini/av-nedim-aslan/src/lib/translations.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Replace TR hero
content = content.replace(
    'titleFirst: "Güven, Deneyim ve",', 
    'titleFirst: "Hukuki Süreçlerinizde",'
).replace(
    'titleHighlight: "Adaletin",',
    'titleHighlight: "Güvenilir",'
).replace(
    'titleLast: "Temsili",',
    'titleLast: "ve Etkin Destek",'
).replace(
    'subtitle: "Hukukun üstünlüğü ilkesi doğrultusunda, hak kayıplarınızı önlemek ve en karmaşık hukuki sorunlarınızı profesyonel bir hassasiyet ve gizlilikle çözmek için yanınızdayız.",',
    'subtitle1: "Her hukuki uyuşmazlık kendi koşulları içinde değerlendirilmelidir. Haklarınızı korumak, karşılaşabileceğiniz hukuki riskleri doğru şekilde değerlendirmek ve süreci başından sonuna kadar özenle takip etmek için yanınızdayız.",\n      subtitle2: "Güncel mevzuat ve yargı kararlarını esas alarak, hukuki süreçlerinizi şeffaflık, özen ve mesleki gizlilik ilkeleri çerçevesinde yürütüyoruz.",'
)

# Replace TR bio
content = content.replace(
    'bio1: "İzmir Bakırçay Üniversitesi Hukuk Fakültesi\'nden mezun olan Av. Nedim Aslan, uyuşmazlıkların çözümünde teorik altyapı ve güncel içtihatları merkeze alan butik bir yaklaşımla bireysel ve kurumsal müvekkillerine hukuki danışmanlık hizmeti sunmaktadır.",\n      bio2: "Ceza hukuku ağırlıklı olmak üzere dava ve soruşturma takip süreçlerini aktif olarak yürütmektedir. Çalışmalarında; güncel mevzuata ve yargı kararlarına hakimiyet, şeffaflık ve profesyonel gizlilik ilkelerini esas almaktadır.",',
    'bio1: "Av. Nedim Aslan, hukuki uyuşmazlıkların yalnızca dosya üzerinden değil, kişinin içinde bulunduğu koşullar ve ihtiyaçları da dikkate alınarak değerlendirilmesi gerektiğine inanan bir çalışma anlayışıyla avukatlık hizmeti vermektedir.",\n      bio2: "Başta ceza hukuku ve özel hukuk olmak üzere; iş hukuku, ticaret hukuku, borçlar hukuku, aile ve miras hukuku, gayrimenkul hukuku, icra ve iflas hukuku, tazminat ve sigorta hukuku ile yabancılar hukuku alanlarında bireysel ve kurumsal müvekkillerine hukuki destek sunmaktadır.",\n      bio3: "Dava ve soruşturma süreçlerinin yanı sıra hukuki danışmanlık ve uyuşmazlıkların çözümünde de aktif olarak çalışmaktadır. Her dosyanın kendine özgü olduğunu gözeterek, süreci müvekkilleri açısından anlaşılır ve şeffaf şekilde yürütmeye; hukuki seçenekleri açık biçimde ortaya koymaya önem vermektedir.",\n      bio4: "Mesleki çalışmalarını güncel mevzuat ve yargı kararlarını yakından takip ederek; güven, özen ve mesleki gizlilik ilkeleri çerçevesinde sürdürmektedir.",'
)

# Replace EN hero
content = content.replace(
    'subtitle: "In accordance with the principle of the rule of law, we stand by your side to prevent loss of rights and solve your most complex legal problems with professional sensitivity and confidentiality.",',
    'subtitle1: "Every legal dispute must be evaluated within its own circumstances. We stand by your side to protect your rights, properly assess the legal risks you may face, and meticulously follow the process from beginning to end.",\n      subtitle2: "Based on current legislation and judicial decisions, we conduct your legal processes within the framework of transparency, diligence, and professional confidentiality principles.",'
)

# Replace EN bio
content = content.replace(
    'bio1: "Graduated from Izmir Bakırçay University Faculty of Law, Atty. Nedim Aslan provides legal consultancy services to individual and corporate clients with a boutique approach centered on theoretical background and current jurisprudence in dispute resolution.",\n      bio2: "He actively conducts litigation and investigation follow-up processes, predominantly in criminal law. In his work, he adopts the principles of mastery of current legislation and judicial decisions, transparency, and professional confidentiality.",',
    'bio1: "Atty. Nedim Aslan provides legal services with a working understanding that believes legal disputes should be evaluated not only over the file but also by taking into account the conditions and needs of the person.",\n      bio2: "He provides legal support to individual and corporate clients mainly in criminal law and private law, including labor law, commercial law, law of obligations, family and inheritance law, real estate law, enforcement and bankruptcy law, compensation and insurance law, and foreigners law.",\n      bio3: "In addition to litigation and investigation processes, he also works actively in legal consultancy and dispute resolution. Considering that each file is unique, he attaches importance to carrying out the process in an understandable and transparent manner for his clients and presenting legal options clearly.",\n      bio4: "He continues his professional work by closely following current legislation and judicial decisions within the framework of principles of trust, diligence, and professional confidentiality.",'
)

with open("/Users/kadirozgun/.gemini/av-nedim-aslan/src/lib/translations.ts", "w", encoding="utf-8") as f:
    f.write(content)
