import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// Зөвхөн худалдаж авсан хэрэглэгчид signed URL өгнө
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const productId = req.nextUrl.searchParams.get('product_id');
    const lessonId = req.nextUrl.searchParams.get('lesson_id');

    const admin = createAdminClient();

    // Product файл
    if (productId) {
      // Library-д байгаа эсэхийг шалгах
      const { data: access } = await admin
        .from('library')
        .select('product_id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (!access) return NextResponse.json({ error: 'Худалдаж аваагүй' }, { status: 403 });

      const { data: product } = await admin
        .from('products')
        .select('file_path')
        .eq('id', productId)
        .single();

      if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      // Signed URL 10 минут хүчинтэй
      const { data: signed } = await admin.storage
        .from('sheets')
        .createSignedUrl(product.file_path, 600);

      return NextResponse.json({ url: signed?.signedUrl });
    }

    // Lesson видео
    if (lessonId) {
      const { data: lesson } = await admin
        .from('lessons')
        .select('*, courses!inner(id)')
        .eq('id', lessonId)
        .single();

      if (!lesson) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      // Үнэгүй хичээл бол хүн бүрт харуулна
      if (!lesson.is_free) {
        const { data: access } = await admin
          .from('enrollments')
          .select('course_id')
          .eq('user_id', user.id)
          .eq('course_id', (lesson.courses as any).id)
          .single();

        if (!access) return NextResponse.json({ error: 'Бүртгэгдээгүй' }, { status: 403 });
      }

      const { data: signed } = await admin.storage
        .from('videos')
        .createSignedUrl(lesson.video_path, 3600); // 1 цаг

      return NextResponse.json({ url: signed?.signedUrl });
    }

    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
