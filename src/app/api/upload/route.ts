import { NextRequest, NextResponse } from 'next/server';
import { saveImage } from '@/lib/server/posts';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 이미지 타입 체크
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 },
      );
    }

    const imageUrl = await saveImage(file);

    if (imageUrl) {
      return NextResponse.json({ url: imageUrl });
    } else {
      return NextResponse.json(
        { error: 'Failed to save image' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error in image upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
