
export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405
    });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return Response.json(
      { error: "Konfigurasi Telegram belum diatur." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    if (body?.event !== "page_open") {
      return Response.json(
        { error: "Event tidak valid." },
        { status: 400 }
      );
    }

    const time = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      dateStyle: "full",
      timeStyle: "long"
    });

    const message =
      "💗 WEBSITE GRADUATION DIBUKA!\n\n" +
      "Website: Happy Graduation from Vergio 🎓\n" +
      "Waktu: " + time + "\n\n" +
      "Seseorang membuka halaman ucapan wisuda kamu.";

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Notifikasi Telegram gagal dikirim." },
        { status: 502 }
      );
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error("Kesalahan memproses kunjungan.");

    return Response.json(
      { error: "Permintaan tidak dapat diproses." },
      { status: 400 }
    );
  }
};
