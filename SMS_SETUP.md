# 📱 Configuración de SMS con Twilio

## Cómo Activar Notificaciones por SMS

El sistema está listo para enviar SMS de confirmación al cliente. Solo necesitas configurar **Twilio** (servicio profesional de SMS).

---

## 🚀 Pasos para Configurar

### 1️⃣ Crear Cuenta en Twilio

1. Ir a [https://www.twilio.com/](https://www.twilio.com/)
2. Crear cuenta gratuita (incluye crédito de $15 para pruebas)
3. Verificar email y teléfono

### 2️⃣ Obtener Credenciales

En el dashboard de Twilio:
- **Account SID**: En "Settings" → "General" (ej: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
- **Auth Token**: En "Settings" → "General" (ej: `your_auth_token_here`)
- **Phone Number**: En "Messaging" → "Services" → obtén o crea un número de Twilio (ej: `+1234567890`)

### 3️⃣ Configurar Variables de Entorno

Agregar a tu `supabase/functions/.env.local` (desarrollo) o `.env` (producción):

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

O configurar directamente en **Supabase Dashboard**:
1. Ir a "Project Settings" → "Secrets"
2. Agregar las 3 variables anteriores

### 4️⃣ Probar en Desarrollo

```bash
# Ejecutar funciones localmente
supabase start
supabase functions serve
```

---

## 📧 + 📱 Flujo Completo

Cuando un cliente completa la compra:

1. ✅ Se **crea la orden** en la BD
2. ✅ Se envía **email de confirmación** con:
   - Número de pedido
   - Productos comprados
   - Total pagado
   - Dirección de envío
   - Link de seguimiento
3. ✅ Se envía **SMS de confirmación** si hay teléfono:
   - Resumen de pedido
   - Número de orden
   - Link de seguimiento

### Ejemplo SMS que recibe:
```
Hola Juan! Tu pedido ORD-1234567890-ABCDE ha sido confirmado por $150.50. 
Recibirás pronto tu seguimiento en: https://crowstore.local/seguimiento?id=ORD-1234567890-ABCDE. 
Gracias por tu compra!
```

---

## 🔄 SMS de Seguimiento (Futuro)

También está implementada la función `sendOrderTrackingSMS()` para notificaciones automáticas:

- ⏳ "Tu pedido está siendo procesado"
- ✓ "Pago confirmado"
- 📦 "Preparando envío"
- 🚚 "¡En camino a tu casa!"
- ✅ "Entregado con éxito"

Se puede activar en el backend cuando cambies el estado de la orden.

---

## 🌍 Formato de Teléfono

El sistema acepta números en varios formatos:
- `+593 999 999 999` ✅
- `0999999999` (Ecuador) ✅ → Convierte a `+593999999999`
- `0999-999-999` ✅

**Importante**: El sistema automáticamente:
1. Limpia espacios y caracteres especiales
2. Agrega código de país `+593` si falta (Ecuador)
3. Normaliza al formato internacional `+XXX`

---

## 🛡️ Consideraciones de Seguridad

- Las credenciales NO se guardan en el código (variables de entorno)
- Se usa **Basic Auth** con Twilio API
- El SMS solo se envía si el teléfono está presente
- El servicio falla silenciosamente (no rompe la orden)

---

## 💳 Costos

**Twilio (desde la cuenta gratuita)**:
- $15 crédito inicial gratuito
- SMS: ~$0.0075 por SMS enviado (varía por país)
- En Ecuador: ~$0.01 por SMS
- Plan: 1 SMS por orden = muy económico

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si no configuro Twilio?**
R: El SMS no se envía (log de advertencia), pero el pedido se crea normalmente. El email sigue funcionando.

**P: ¿Puedo usar otro servicio de SMS?**
R: Sí, reemplaza `sms.tsx` con la API del servicio que prefieras (AWS SNS, SendGrid, Vonage, etc.)

**P: ¿El número de teléfono es obligatorio?**
R: No, es opcional en el checkout. Si el usuario no lo proporciona, solo se envía email.

---

## 📊 Archivos Modificados

- ✅ Creado: `supabase/functions/server/sms.tsx` (funciones de SMS)
- ✅ Actualizado: `supabase/functions/server/index.tsx` (integración en crear orden)
- ✅ Ya existía: `supabase/functions/server/email.tsx` (email de confirmación)

---

## 🎯 Próximos Pasos

1. Configura Twilio con las credenciales
2. Agrega las variables de entorno en Supabase
3. Prueba creando una orden con teléfono
4. Verifica logs en Supabase Functions

¡Listo! Las notificaciones por SMS funcionarán automáticamente.
