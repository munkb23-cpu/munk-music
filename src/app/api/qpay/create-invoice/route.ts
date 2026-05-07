import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { createInvoice } from '@/lib/qpay';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Нэвтрэх шаардлагатай' }, { status: 401 });
    }

    const { items } = await req.json(); // [{ product_id, course_id, price }]
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Сагс хоосон байна' }, { status: 400 });
    }

    const total = items.reduce((s: number, i: any) => s + i.price, 0);

    // Order үүсгэх
    const admin = createAdminClient();
    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: total,
        items,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // QPay invoice үүсгэх
    const invoice = await createInvoice({
      orderId: order.id,
      amount: total,
      description: `Munk Music — ${items.length} бүтээл`,
      userId: user.id,
    });

    // Order-д QPay мэдээлэл хадгалах
    await admin
      .from('orders')
      .update({
        qpay_invoice_id: invoice.invoice_id,
        qpay_qr_text: invoice.qr_text,
      })
      .eq('id', order.id);

    return NextResponse.json({
      order_id: order.id,
      invoice_id: invoice.invoice_id,
      qr_text: invoice.qr_text,
      qr_image: invoice.qr_image,
      urls: invoice.urls, // банкны аппын deep link-үүд
    });
  } catch (error: any) {
    console.error('Invoice error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
