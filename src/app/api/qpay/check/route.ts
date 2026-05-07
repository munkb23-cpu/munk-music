import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { checkPayment } from '@/lib/qpay';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { order_id } = await req.json();

    const admin = createAdminClient();
    const { data: order } = await admin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .eq('user_id', user.id)
      .single();

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.status === 'paid') return NextResponse.json({ paid: true });

    const { paid } = await checkPayment(order.qpay_invoice_id);

    if (paid) {
      // Status-г шинэчилж, худалдаж авсан бүтээлүүдийг library/enrollments-д нэмэх
      await admin
        .from('orders')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', order_id);

      const items = order.items as Array<{ product_id?: string; course_id?: string }>;

      // Products → library
      const libraryInserts = items
        .filter((i) => i.product_id)
        .map((i) => ({ user_id: user.id, product_id: i.product_id, order_id }));
      if (libraryInserts.length > 0) {
        await admin.from('library').upsert(libraryInserts, { onConflict: 'user_id,product_id' });
      }

      // Courses → enrollments
      const courseInserts = items
        .filter((i) => i.course_id)
        .map((i) => ({ user_id: user.id, course_id: i.course_id, order_id }));
      if (courseInserts.length > 0) {
        await admin.from('enrollments').upsert(courseInserts, { onConflict: 'user_id,course_id' });
      }
    }

    return NextResponse.json({ paid });
  } catch (error: any) {
    console.error('Check error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
