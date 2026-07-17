import { NextRequest, NextResponse } from "next/server";

type OrderItemInput = {
  name: string;
  quantity: number;
  price_cents: number;
};

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function buildEmailHtml({
  customerName,
  orderId,
  items,
  totalCents,
}: {
  customerName: string;
  orderId: string;
  items: OrderItemInput[];
  totalCents: number;
}) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #2A2A2A22;">${item.quantity}× ${item.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #2A2A2A22;text-align:right;">${formatCents(
            item.price_cents * item.quantity
          )}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#141414;">
      <h2 style="font-size:20px;margin-bottom:4px;">Obrigado pelo seu pedido, ${customerName}!</h2>
      <p style="color:#555;font-size:14px;">Pedido #${orderId}</p>
      <p style="font-size:14px;line-height:1.5;">
        Recebemos seu pedido e ele já está sendo preparado. O pagamento é feito
        pessoalmente, na entrega ou retirada. Vamos entrar em contato pelo
        telefone informado caso tenhamos algum problema com o seu pedido.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px;">
        ${rows}
        <tr>
          <td style="padding-top:12px;font-weight:bold;">Total</td>
          <td style="padding-top:12px;font-weight:bold;text-align:right;">${formatCents(
            totalCents
          )}</td>
        </tr>
      </table>
      <p style="margin-top:24px;font-size:12px;color:#8C8A85;">— Núcleo</p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      orderId,
      items,
      totalCents,
    }: {
      customerName: string;
      customerEmail: string;
      orderId: string;
      items: OrderItemInput[];
      totalCents: number;
    } = body;

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      // Não trava o checkout: só avisa que o email não foi configurado ainda.
      return NextResponse.json(
        { sent: false, reason: "RESEND_API_KEY ou RESEND_FROM_EMAIL não configurados" },
        { status: 200 }
      );
    }

    const html = buildEmailHtml({ customerName, orderId, items, totalCents });

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: customerEmail,
        subject: "Recebemos seu pedido — Núcleo",
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Erro ao enviar email via Resend:", errorText);
      return NextResponse.json(
        { sent: false, reason: errorText },
        { status: 200 }
      );
    }

    return NextResponse.json({ sent: true });
  } catch (err: any) {
    console.error("Erro na rota de confirmação por email:", err);
    return NextResponse.json(
      { sent: false, reason: err.message || "Erro desconhecido" },
      { status: 200 }
    );
  }
}
