import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    const data = await resend.emails.send({
      from: "DDM Muebles WEB <noreply@mueblesddm.com>",
      to: ["ddmueblesventas@gmail.com"],
      subject: "Nueva consulta hecha mediante la web",
      html: `
        <h1>Nueva consulta hecha desde la web</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
