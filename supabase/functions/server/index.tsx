import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import { sendOrderConfirmationEmail } from "./email.tsx";
import { sendOrderConfirmationSMS } from "./sms.tsx";

const app = new Hono();

// Crear cliente de Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-69259dc0/health", (c) => {
  return c.json({ status: "ok" });
});

// Obtener todos los productos
app.get("/make-server-69259dc0/products", async (c) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return c.json(data);
  } catch (error) {
    console.log(`Error al obtener productos: ${error}`);
    return c.json({ error: `Error al obtener productos: ${error}` }, 500);
  }
});

// Obtener un producto por ID
app.get("/make-server-69259dc0/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return c.json(data);
  } catch (error) {
    console.log(`Error al obtener producto: ${error}`);
    return c.json({ error: `Error al obtener producto: ${error}` }, 500);
  }
});

// Registro de usuario
app.post("/make-server-69259dc0/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, fullName, phone } = body;

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
    });

    if (authError) throw authError;

    // Crear perfil de cliente
    const { error: customerError } = await supabase
      .from('customers')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        phone: phone || null,
      });

    if (customerError) throw customerError;

    return c.json({ success: true, user: authData.user });
  } catch (error) {
    console.log(`Error en registro: ${error}`);
    return c.json({ error: `Error en registro: ${error}` }, 500);
  }
});

// Crear un pedido
app.post("/make-server-69259dc0/orders", async (c) => {
  try {
    const body = await c.req.json();
    const { items, total, customerInfo, userId } = body;

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Insertar pedido
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_id: userId || null,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_address: customerInfo.address,
        customer_phone: customerInfo.phone || null,
        total: total,
        status: 'procesando',
      });

    if (orderError) throw orderError;

    // Insertar items del pedido
    const orderItems = items.map((item: any) => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
      selected_size: item.selectedSize,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Enviar email de confirmación
    const orderData = {
      id: orderId,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_address: customerInfo.address,
      total: total,
      created_at: new Date().toISOString(),
    };

    console.log(`Enviando email a: ${customerInfo.email}`);
    const emailResult = await sendOrderConfirmationEmail(
      customerInfo.email,
      orderData,
      orderItems
    );

    if (!emailResult.success) {
      console.log(`Advertencia: No se pudo enviar el email: ${JSON.stringify(emailResult.error)}`);
    }

    // Enviar SMS de confirmación si hay teléfono
    if (customerInfo.phone) {
      console.log(`Enviando SMS a: ${customerInfo.phone}`);
      const smsResult = await sendOrderConfirmationSMS(
        customerInfo.phone,
        orderId,
        customerInfo.name,
        total
      );

      if (!smsResult.success) {
        console.log(`Advertencia: No se pudo enviar el SMS: ${JSON.stringify(smsResult.error)}`);
      } else {
        console.log(`SMS enviado exitosamente con SID: ${smsResult.messageSid}`);
      }
    } else {
      console.log(`No hay número de teléfono. SMS no enviado.`);
    }

    return c.json({ success: true, orderId });
  } catch (error) {
    console.log(`Error al crear pedido: ${error}`);
    return c.json({ error: `Error al crear pedido: ${error}` }, 500);
  }
});

// Obtener un pedido por ID
app.get("/make-server-69259dc0/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) throw orderError;

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id);

    if (itemsError) throw itemsError;

    return c.json({ ...order, items });
  } catch (error) {
    console.log(`Error al obtener pedido: ${error}`);
    return c.json({ error: `Error al obtener pedido: ${error}` }, 500);
  }
});

// Obtener pedidos de un usuario
app.get("/make-server-69259dc0/users/:userId/orders", async (c) => {
  try {
    const userId = c.req.param("userId");

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return c.json(data);
  } catch (error) {
    console.log(`Error al obtener pedidos del usuario: ${error}`);
    return c.json({ error: `Error al obtener pedidos: ${error}` }, 500);
  }
});

// Actualizar perfil de usuario
app.put("/make-server-69259dc0/users/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();
    const { fullName, phone, defaultAddress } = body;

    const { error } = await supabase
      .from('customers')
      .update({
        full_name: fullName,
        phone: phone,
        default_address: defaultAddress,
      })
      .eq('id', userId);

    if (error) throw error;

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error al actualizar perfil: ${error}`);
    return c.json({ error: `Error al actualizar perfil: ${error}` }, 500);
  }
});

// Obtener perfil de usuario
app.get("/make-server-69259dc0/users/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return c.json(data);
  } catch (error) {
    console.log(`Error al obtener perfil: ${error}`);
    return c.json({ error: `Error al obtener perfil: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);