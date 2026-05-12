// Función para generar el HTML del email de confirmación
export function generateOrderConfirmationEmail(order: any, items: any[]) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.product_name}</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">Talla: ${item.selected_size} • Cantidad: ${item.quantity}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        $${(Number(item.product_price) * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pedido - CrowStore</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 2px solid #e5e7eb; max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; background-color: #000000; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">CrowStore</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Confirmación de Pedido</p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f0fdf4; border-bottom: 2px solid #e5e7eb;">
              <div style="font-size: 48px; color: #22c55e; margin-bottom: 10px;">✓</div>
              <h2 style="margin: 0 0 10px 0; color: #166534;">¡Pedido Confirmado!</h2>
              <p style="margin: 0; color: #166534;">Gracias por tu compra, ${order.customer_name}</p>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding: 30px;">
              <h3 style="margin: 0 0 15px 0; font-size: 18px;">Detalles del Pedido</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Número de Pedido:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${order.id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Fecha:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${new Date(order.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${order.customer_email}</td>
                </tr>
              </table>

              <h3 style="margin: 20px 0 15px 0; font-size: 18px;">Dirección de Envío</h3>
              <p style="margin: 0; padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
                ${order.customer_address}
              </p>

              <h3 style="margin: 20px 0 15px 0; font-size: 18px;">Productos</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid #e5e7eb;">
                ${itemsHtml}
                <tr>
                  <td colspan="2" style="padding: 20px; background-color: #f9fafb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 5px 0; font-size: 18px;"><strong>Total:</strong></td>
                        <td style="padding: 5px 0; text-align: right; font-size: 24px; font-weight: bold;">
                          $${Number(order.total).toFixed(2)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Tracking Link -->
              <div style="margin: 30px 0; padding: 20px; background-color: #eff6ff; border: 2px solid #3b82f6; text-align: center;">
                <p style="margin: 0 0 15px 0; font-weight: bold; color: #1e40af;">Rastrea tu pedido en cualquier momento</p>
                <p style="margin: 0; font-size: 14px; color: #1e40af;">
                  Usa el número de pedido <strong>${order.id}</strong> en nuestra página de seguimiento
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-top: 2px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                ¿Necesitas ayuda? Contacta con nosotros
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Email: michael2230@gmail.com | Tel: +593 0979246567
              </p>
              <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                © 2026 CrowStore. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Función para enviar email usando SendGrid
export async function sendOrderConfirmationEmail(
  to: string,
  order: any,
  items: any[]
) {
  try {
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');

    console.log(`Iniciando envío de email a: ${to}`);
    console.log(`SendGrid API Key presente: ${sendgridApiKey ? 'Sí' : 'No'}`);

    if (!sendgridApiKey) {
      console.log('SENDGRID_API_KEY no está configurada. Email no enviado.');
      return { success: false, error: 'Email service not configured' };
    }

    const emailHtml = generateOrderConfirmationEmail(order, items);

    console.log(`HTML del email generado, longitud: ${emailHtml.length} caracteres`);

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: `Confirmación de Pedido ${order.id} - CrowStore`,
          },
        ],
        from: {
          email: 'cuervojr.22.30@hotmail.com',
          name: 'CrowStore',
        },
        content: [
          {
            type: 'text/html',
            value: emailHtml,
          },
        ],
        reply_to: {
          email: 'michael2230@gmail.com',
          name: 'CrowStore Support',
        },
      }),
    });

    const responseData = await response.json();

    if (response.ok || response.status === 202) {
      console.log(`Email enviado exitosamente a ${to}`);
      return { success: true, data: { messageId: 'sent-via-sendgrid' } };
    } else {
      console.log(`Error al enviar email:`, JSON.stringify(responseData));
      return { success: false, error: responseData.errors?.[0]?.message || 'SendGrid API error' };
    }
  } catch (error) {
    console.log(`Error crítico al enviar email:`, error);
    console.log(`Tipo de error: ${error.constructor.name}`);
    console.log(`Mensaje de error: ${error.message || String(error)}`);
    return { success: false, error: error.message || String(error) };
  }
}

