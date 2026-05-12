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
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al registrar usuario');
  }

  return response.json();
}

// Login de usuario (usa Supabase Auth directamente)
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
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
