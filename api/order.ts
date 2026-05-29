export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: "Webhook not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: {
    productName: string;
    price: number;
    email: string;
    paymentMethod: string;
    discordUsername?: string;
  };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { productName, price, email, paymentMethod, discordUsername } = body;

  const paymentColors: Record<string, number> = {
    BTC: 0xf7931a,
    LTC: 0x345d9d,
    ETH: 0x627eea,
    Robux: 0x00b06f,
  };

  const embed = {
    title: "New Order — ivera.priv",
    color: paymentColors[paymentMethod] ?? 0xffffff,
    fields: [
      { name: "Product", value: productName, inline: true },
      { name: "Price", value: `$${price}`, inline: true },
      { name: "Payment Method", value: paymentMethod, inline: true },
      { name: "Email", value: email, inline: false },
      {
        name: "Discord",
        value: discordUsername || "_not provided_",
        inline: false,
      },
    ],
    footer: { text: "ivera.priv order system" },
    timestamp: new Date().toISOString(),
  };

  const discordRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });

  if (!discordRes.ok) {
    return new Response(JSON.stringify({ error: "Failed to notify Discord" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
