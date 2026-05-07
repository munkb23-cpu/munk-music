// QPay API client
// Документ: https://developer.qpay.mn

const QPAY_BASE = process.env.QPAY_BASE_URL || 'https://merchant.qpay.mn/v2';

interface QPayToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

// Token-ийг memory-д cache хийнэ (бодит орчинд Redis-д хадгалах нь зөв)
let cachedToken: { token: string; expires: number } | null = null;

async function getToken(): Promise<string> {
  // Хүчин төгөлдөр token байвал буцаа
  if (cachedToken && cachedToken.expires > Date.now()) {
    return cachedToken.token;
  }

  const username = process.env.QPAY_USERNAME!;
  const password = process.env.QPAY_PASSWORD!;
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');

  const res = await fetch(`${QPAY_BASE}/auth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`QPay auth failed: ${res.status}`);
  }

  const data: QPayToken = await res.json();
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000, // 60 сек өмнө refresh
  };
  return data.access_token;
}

export interface CreateInvoiceParams {
  orderId: string;
  amount: number;
  description: string;
  userId: string;
}

export interface QPayInvoiceResponse {
  invoice_id: string;
  qr_text: string;
  qr_image: string; // base64
  qPay_shortUrl: string;
  urls: Array<{ name: string; description: string; logo: string; link: string }>;
}

export async function createInvoice(params: CreateInvoiceParams): Promise<QPayInvoiceResponse> {
  const token = await getToken();

  const res = await fetch(`${QPAY_BASE}/invoice`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      invoice_code: process.env.QPAY_INVOICE_CODE!,
      sender_invoice_no: params.orderId,
      invoice_receiver_code: params.userId,
      invoice_description: params.description,
      amount: params.amount,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/qpay/webhook?order_id=${params.orderId}`,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`QPay invoice create failed: ${error}`);
  }

  return res.json();
}

export async function checkPayment(invoiceId: string): Promise<{ paid: boolean; data: any }> {
  const token = await getToken();

  const res = await fetch(`${QPAY_BASE}/payment/check`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      object_type: 'INVOICE',
      object_id: invoiceId,
    }),
  });

  if (!res.ok) {
    throw new Error(`QPay check failed: ${res.status}`);
  }

  const data = await res.json();
  const paid = data.count > 0 && data.rows?.[0]?.payment_status === 'PAID';
  return { paid, data };
}
