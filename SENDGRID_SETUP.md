# Configuración de Brevo para Envío de Emails

Brevo (antes Sendinblue) permite enviar correos de confirmación a cualquier cliente sin la limitación que te estaba afectando.

## Plan gratuito

- 300 correos por día
- Registro rápido
- API simple para integrar con Supabase Functions

## Paso 1: Crear cuenta

1. Ve a https://www.brevo.com
2. Crea tu cuenta con Sign up
3. Verifica tu correo

## Paso 2: Crear API Key

1. Entra a tu cuenta Brevo
2. Perfil > SMTP & API
3. Crea una API Key nueva
4. Copia la clave (formato parecido a xkeysib-...)

## Paso 3: Configurar secreto en Supabase

En Supabase Dashboard:
1. Project Settings > Secrets
2. Agrega:

Name: BREVO_API_KEY
Value: xkeysib-...tu-clave...

Para local (`supabase/functions/.env.local`):

BREVO_API_KEY=xkeysib-...tu-clave...

## Paso 4: Verificar remitente

Debes verificar el email remitente en Brevo:
1. Brevo > Senders, Domains & Dedicated IP
2. Agrega el remitente
3. Confirma el correo de verificación

## Configuración actual en backend

El archivo `supabase/functions/server/email.tsx` ya quedó migrado a Brevo.

- Usa `BREVO_API_KEY`
- Endpoint: `https://api.brevo.com/v3/smtp/email`
- Remitente actual: `michael2230@gmail.com` (cámbialo por uno verificado cuando quieras)

## Prueba rápida

1. Configura `BREVO_API_KEY`
2. Crea un pedido desde checkout
3. Revisa bandeja del cliente
4. Si no llega, revisa logs de Brevo (Transactional > Logs)

## Troubleshooting

- Error "unauthorized": API key incorrecta o no cargada
- Error de sender: remitente no verificado
- Llega a spam: configura dominio y SPF/DKIM

## Variables de entorno finales

- BREVO_API_KEY (email)
- TWILIO_ACCOUNT_SID (sms)
- TWILIO_AUTH_TOKEN (sms)
- TWILIO_PHONE_NUMBER (sms)
