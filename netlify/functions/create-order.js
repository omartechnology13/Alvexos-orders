
export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { customer_name, phone, email, country, details } =
      await req.json();

    if (
      typeof customer_name !== "string" ||
      !customer_name.trim() ||
      typeof details !== "string" ||
      !details.trim()
    ) {
      return Response.json(
        { error: "Name and order details are required." },
        { status: 400 }
      );
    }

    const url = Netlify.env.get("SUPABASE_URL");
    const key = Netlify.env.get("SUPABASE_SECRET_KEY");

    if (!url || !key) {
      return Response.json(
        { error: "Server configuration is missing." },
        { status: 500 }
      );
    }

    const response = await fetch(`${url}/rest/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        customer_name: customer_name.trim(),
        phone: typeof phone === "string" ? phone.trim() : "",
        email: typeof email === "string" ? email.trim() : "",
        country: typeof country === "string" ? country.trim() : "",
        details: details.trim()
      })
    });

    if (!response.ok) {
      return Response.json(
        { error: "Could not save the order." },
        { status: 502 }
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
};
