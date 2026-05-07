import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { checkPayment } from '@/lib/qpay';

// QPay-ээс төлбөр орох үед энэ URL-д GET хүсэлт ирнэ
export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get('order_id');
    if (!orderId) return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });

    const admin = createAdminClient();
    const { data: order } = await admin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!order || order.status === 'paid') return NextResponse.json({ ok: true });

    // QPay-ээс дахин баталгаажуулах (security)
    const { paid } = await checkPayment(order.qpay_invoice_id);
    if (!paid) return NextResponse.json({ ok: false });

    // Төлбөр амжилттай — library/enrollments шинэчлэх
    await admin
      .from('orders')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', orderId);

    const items = order.items as Array<{ product_id?: string; course_id?: string }>;

    const libraryInserts = items
      .filter((i) => i.product_id)
      .map((i) => ({ user_id: order.user_id, product_id: i.product_id, order_id: orderId }));
    if (libraryInserts.length > 0) {
      await admin.from('library').upsert(libraryInserts, { onConflict: 'user_id,product_id' });
    }

    const courseInserts = items
      .filter((i) => i.course_id)
      .map((i) => ({ user_id: order.user_id, course_id: i.course_id, order_id: orderId }));
    if (courseInserts.length > 0) {
      await admin.from('enrollments').upsert(courseInserts, { onConflict: 'user_id,course_id' });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
