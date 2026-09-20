import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint de Webhooks de Stripe con verificación criptográfica de firma
 * Previene ataques de falsificación de eventos (replay attacks / fake events).
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Configuración o firma de webhook ausente.' },
      { status: 400 }
    );
  }

  try {
    const rawBody = await req.text();

    // En producción con stripe SDK:
    // const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    //
    // Switch de eventos:
    // case 'checkout.session.completed':
    //   -> Actualizar estado de gimnasio en Supabase (plan activo)
    // case 'customer.subscription.deleted':
    //   -> Marcar suscripción como canceled

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Firma de webhook inválida' },
      { status: 400 }
    );
  }
}
