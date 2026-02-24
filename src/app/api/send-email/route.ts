import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured (missing RESEND_API_KEY)" },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { name, email, message } = await request.json();
    const data = await resend.emails.send({
      from: "DDM Muebles WEB <noreply@mueblesddm.com>",
      to: ["ddmueblesventas@gmail.com"],
      subject: "🌟 Nueva consulta desde la web de DDM Muebles",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f5f2eb;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f2eb; padding: 20px;">
              <tr>
                  <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden;">
                          
                         
                          <tr>
                              <td style="background: linear-gradient(135deg, #8B5A2B 0%, #654321 100%); padding: 30px 30px 20px 30px; text-align: center;">
                                  <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">DDM MUEBLES</h1>
                                  
                              </td>
                          </tr>
                          
                          <!-- Contenido principal -->
                          <tr>
                              <td style="padding: 40px 30px;">
                                  <h2 style="color: #4A3729; margin-top: 0; margin-bottom: 20px; font-weight: 400; border-bottom: 2px solid #e6d5b8; padding-bottom: 10px;">✨ Nueva consulta recibida</h2>
                                  
                                  <p style="color: #5f4c3b; font-size: 16px; line-height: 1.6;">Hola equipo de DDM,</p>
                                  <p style="color: #5f4c3b; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Se ha recibido un nuevo mensaje a través del formulario de la web. Aquí están los detalles:</p>
                                  
                                 
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf8f4; border-radius: 12px; border-left: 4px solid #8B5A2B; margin-bottom: 30px;">
                                      <tr>
                                          <td style="padding: 20px;">
                                              <p style="margin: 8px 0; color: #4A3729;">
                                                  <strong style="color: #654321; min-width: 80px; display: inline-block;">👤 Nombre:</strong> ${name}
                                              </p>
                                              <p style="margin: 8px 0; color: #4A3729;">
                                                  <strong style="color: #654321; min-width: 80px; display: inline-block;">📧 Email:</strong> 
                                                  <a href="mailto:${email}" style="color: #8B5A2B; text-decoration: none;">${email}</a>
                                              </p>
                                              <p style="margin: 8px 0; color: #4A3729;">
                                                  <strong style="color: #654321; min-width: 80px; display: inline-block;">💬 Mensaje:</strong>
                                              </p>
                                              <p style="margin: 8px 0 0 25px; padding: 15px; background-color: #fff; border-radius: 8px; font-style: italic; color: #3e2e20; border: 1px solid #e6d5b8;">
                                                  "${message}"
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                                  
                                  <!-- Llamado a la acción -->
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                      <tr>
                                          <td align="center">
                                              <a href="mailto:${email}" style="background-color: #8B5A2B; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 50px; font-weight: 500; letter-spacing: 0.5px; display: inline-block; box-shadow: 0 2px 8px rgba(139, 90, 43, 0.2);">✉️ Responder a este cliente</a>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          
                          <!-- Footer -->
                          <tr>
                              <td style="background-color: #4A3729; padding: 25px 30px; text-align: center;">
                                  
                                  <p style="color: #b99e7c; margin: 0; font-size: 13px;">© ${new Date().getFullYear()} DDM Muebles - Creado por Javi Azua 🤓</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
