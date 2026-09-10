import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // public/uploads klasörünün yolunu oluştur
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Klasör yoksa oluştur (recursive olarak)
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Klasör zaten varsa hata verme
    }

    // Dosya adını güvenli hale getir ve timestamp ekle (çakışmayı önlemek için)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${uniqueSuffix}-${sanitizedName}`;
    const filePath = join(uploadDir, filename);

    // Dosyayı diske yaz
    await writeFile(filePath, buffer);

    // Dosya URL'sini dön
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Dosya yüklenirken bir hata oluştu.' }, { status: 500 });
  }
}
