import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-69259dc0`;

// Tipos para order
interface OrderItem {
  id: number;
  name: string;
  price: number;
  category: string;
  size: string;
  color: string;
  gender: "hombre" | "mujer" | "unisex";
  stock: number;
  image: string;
  quantity: number;
  selectedSize: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  phone?: string;
}

interface OrderData {
  items: OrderItem[];
  total: number;
  customerInfo: CustomerInfo;
  userId?: string;
}

// Cliente de Supabase para autenticación
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Obtener todos los productos
export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }

  return response.json();
}

// Obtener un producto por ID
export async function getProductById(id: number) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener producto');
  }

  return response.json();
}

// Registro de usuario
export async function signUp(data: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.error || 'Error al registrar usuario';
      console.log('[SIGNUP] Error response:', errorMessage);
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error: any) {
    console.error('[SIGNUP] Error in signUp:', error);
    // Si ya es un Error con mensaje, lanzarlo tal cual
    if (error instanceof Error) {
      throw error;
    }
    // Si es otro tipo de error, convertirlo a string
    throw new Error(String(error) || 'Error al registrar usuario');
  }
}

export async function debugSignUp(data: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}) {
  try {
    console.log('[DEBUG] Iniciando registro con:', { email: data.email, phone: data.phone, name: data.fullName });
    const result = await signUp(data);
    console.log('[DEBUG] Registro exitoso:', result);
    return result;
  } catch (error: any) {
    console.error('[DEBUG] Error capturado:', error);
    console.error('[DEBUG] Error message:', error.message);
    console.error('[DEBUG] Error toString:', String(error));
    throw error;
  }
}
// Login de usuario (usa Supabase Auth directamente)
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg = String(error.message || error).toLowerCase();
      if (msg.includes('invalid') || msg.includes('password') || msg.includes('credentials')) {
        throw new Error('Credenciales inválidas. Verifica email y contraseña');
      }
      throw new Error('Error al iniciar sesión');
    }

    return data;
  } catch (err: any) {
    if (err.message) throw err;
    throw new Error('Error al iniciar sesión');
  }
}

// Cerrar sesión
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Obtener sesión actual
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// Crear un pedido
export async function createOrder(orderData: OrderData) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error('Error al crear pedido');
  }

  return response.json();
}

// Obtener un pedido por ID
export async function getOrderById(id: string) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener pedido');
  }

  return response.json();
}

// Actualizar estado de un pedido (PUT /orders/:id)
export async function updateOrderStatus(id: string, status: string) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar estado del pedido');
  }

  return response.json();
}

// Obtener pedidos de un usuario
export async function getUserOrders(userId: string) {
  const response = await fetch(`${API_URL}/users/${userId}/orders`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener pedidos');
  }

  return response.json();
}

// Obtener perfil de usuario
export async function getUserProfile(userId: string) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener perfil');
  }

  return response.json();
}

// Actualizar perfil de usuario
export async function updateUserProfile(userId: string, data: {
  fullName: string;
  phone?: string;
  defaultAddress?: string;
}) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar perfil');
  }

  return response.json();
}

// Cambiar contraseña del usuario autenticado
export async function changePassword(newPassword: string) {
  // updateUser requiere sesión activa; intentamos recuperarla antes de llamar.
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error('No se pudo validar tu sesión. Intenta iniciar sesión nuevamente.');
  }

  if (!session) {
    throw new Error('Tu sesión expiró. Inicia sesión nuevamente para cambiar la contraseña.');
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    const rawMessage = String(error.message || '').toLowerCase();
    if (rawMessage.includes('auth session missing') || rawMessage.includes('jwt')) {
      throw new Error('Tu sesión expiró. Inicia sesión nuevamente para cambiar la contraseña.');
    }
    throw new Error(error.message || 'Error al cambiar contraseña');
  }

  return data;
}
