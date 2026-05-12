// Función para enviar SMS de confirmación con Twilio
export async function sendOrderConfirmationSMS(
  phone: string,
  orderId: string,
  customerName: string,
  total: number
) {
  try {
    const twilioApiKey = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    console.log(`Iniciando envío de SMS a: ${phone}`);
    console.log(`Credenciales Twilio presentes: ${twilioApiKey && twilioAccountSid ? 'Sí' : 'No'}`);

    if (!twilioApiKey || !twilioAccountSid || !twilioPhoneNumber) {
      console.log('Credenciales de Twilio no configuradas. SMS no enviado.');
      return { success: false, error: 'SMS service not configured' };
    }

    // Normalizar número: agregar código de país si no lo tiene
    let normalizedPhone = phone.trim();
    if (!normalizedPhone.startsWith('+')) {
      normalizedPhone = '+593' + (normalizedPhone.startsWith('0') ? normalizedPhone.substring(1) : normalizedPhone);
    }

    const message = `Hola ${customerName}! Tu pedido ${orderId} ha sido confirmado por $${total.toFixed(2)}. Recibirás pronto tu seguimiento en: https://crowstore.local/seguimiento?id=${orderId}. Gracias por tu compra!`;

    const encodedMessage = encodeURIComponent(message);
    const encodedPhone = encodeURIComponent(normalizedPhone);
    const encodedFromNumber = encodeURIComponent(twilioPhoneNumber);

    const credentials = btoa(`${twilioAccountSid}:${twilioApiKey}`);

    console.log(`Enviando SMS a: ${normalizedPhone}`);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `From=${encodedFromNumber}&To=${encodedPhone}&Body=${encodedMessage}`,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.log(`Error de Twilio: ${JSON.stringify(error)}`);
      return { success: false, error: error.message || 'Failed to send SMS' };
    }

    const result = await response.json();
    console.log(`SMS enviado exitosamente. SID: ${result.sid}`);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.log(`Error al enviar SMS: ${error}`);
    return { success: false, error: String(error) };
  }
}

// Función para enviar SMS de seguimiento
export async function sendOrderTrackingSMS(
  phone: string,
  orderId: string,
  status: string,
  trackingUrl: string
) {
  try {
    const twilioApiKey = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!twilioApiKey || !twilioAccountSid || !twilioPhoneNumber) {
      return { success: false, error: 'SMS service not configured' };
    }

    let normalizedPhone = phone.trim();
    if (!normalizedPhone.startsWith('+')) {
      normalizedPhone = '+593' + (normalizedPhone.startsWith('0') ? normalizedPhone.substring(1) : normalizedPhone);
    }

    const statusMessages: Record<string, string> = {
      'procesando': '⏳ Tu pedido está siendo procesado',
      'confirmado': '✓ Pago confirmado',
      'preparando': '📦 Preparando envío',
      'enviado': '🚚 ¡En camino a tu casa!',
      'entregado': '✅ Entregado con éxito',
    };

    const statusText = statusMessages[status] || `Estado: ${status}`;
    const message = `${statusText} - Pedido ${orderId}. Ver detalles: ${trackingUrl}`;

    const encodedMessage = encodeURIComponent(message);
    const encodedPhone = encodeURIComponent(normalizedPhone);
    const encodedFromNumber = encodeURIComponent(twilioPhoneNumber);

    const credentials = btoa(`${twilioAccountSid}:${twilioApiKey}`);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `From=${encodedFromNumber}&To=${encodedPhone}&Body=${encodedMessage}`,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const result = await response.json();
    console.log(`SMS de seguimiento enviado. SID: ${result.sid}`);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.log(`Error al enviar SMS de seguimiento: ${error}`);
    return { success: false, error: String(error) };
  }
}
