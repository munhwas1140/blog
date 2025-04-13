import { NextRequest, NextResponse } from 'next/server';
import { deletePost } from '@/lib/server/posts';

// DELETE 요청 처리
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    console.log('Deleting post with slug:', slug);
    const success = await deletePost(slug);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete post or post not found' },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// OPTIONS 메서드 추가
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
