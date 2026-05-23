/**
 * Utilidades de validación reutilizables
 * No contienen lógica de base de datos, solo validaciones de formato
 */

// ============= TELÉFONO =============
/**
 * Valida número de teléfono ecuatoriano
 * Acepta: 0999999999 o +593999999999
 * Solo números, exactamente 10 dígitos después del prefijo
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Campo opcional
  
  const cleanPhone = phone.replace(/\s/g, '').trim();
  
  // Debe empezar con +593 o 0
  if (cleanPhone.startsWith('+593')) {
    // +593 + 9 dígitos = 13 caracteres totales
    return /^\+593\d{9}$/.test(cleanPhone);
  }
  
  if (cleanPhone.startsWith('0')) {
    // 0 + 9 dígitos = 10 caracteres totales
    return /^0\d{9}$/.test(cleanPhone);
  }
  
  return false;
}

// ============= EMAIL =============
export function validateEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============= NOMBRE =============
/**
 * Valida nombre completo
 * 2-50 caracteres, solo letras y espacios (incluyendo acentos)
 */
export function validateFullName(name: string): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  return /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,50}$/.test(trimmed);
}

// ============= DIRECCIÓN =============
/**
 * Valida dirección
 * 5-100 caracteres
 */
export function validateAddress(address: string): boolean {
  if (!address) return false;
  const trimmed = address.trim();
  return trimmed.length >= 5 && trimmed.length <= 100;
}

// ============= CIUDAD =============
/**
 * Valida ciudad
 * 2-20 caracteres, solo letras y espacios
 */
export function validateCity(city: string): boolean {
  if (!city) return false;
  return /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,20}$/.test(city);
}

// ============= CÓDIGO POSTAL =============
/**
 * Valida código postal (ahora 6 dígitos)
 */
export function validatePostalCode(postal: string): boolean {
  if (!postal) return false;
  return /^\d{6}$/.test(postal);
}

// ============= TARJETA DE CRÉDITO =============
/**
 * Valida número de tarjeta usando algoritmo Luhn
 */
export function validateLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  
  // Longitud válida: 13-19 dígitos
  if (digits.length < 13 || digits.length > 19) return false;
  
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = parseInt(digits[digits.length - 1 - i], 10);
    
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
  }
  
  return sum % 10 === 0;
}

/**
 * Formatea número de tarjeta: "1234567890123456" -> "1234 5678 9012 3456"
 */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})/g, '$1 ').trim();
}

// ============= CVV =============
/**
 * Valida CVV (solo 3 dígitos)
 */
export function validateCVV(cvv: string): boolean {
  return /^\d{3}$/.test(cvv);
}

/**
 * Formatea entrada de CVV: solo permite números, máximo 3
 */
export function formatCVV(value: string): string {
  return value.replace(/\D/g, '').slice(0, 3);
}

// ============= FECHA EXPIRACIÓN =============
/**
 * Valida fecha de expiración (MM/AA)
 * Debe ser válida, no estar vencida y no superar 5 años desde hoy
 */
export function validateExpiryDate(expiry: string): boolean {
  if (!expiry || expiry.length !== 5) return false;
  
  const [month, year] = expiry.split('/');
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  // Validar mes 1-12
  if (monthNum < 1 || monthNum > 12) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const maxYear = currentYear + 5;
  const expiryYear = 2000 + yearNum;

  // Validar año no está vencido ni excede 5 años hacia adelante
  if (expiryYear < currentYear) return false;
  if (expiryYear > maxYear) return false;

  if (expiryYear === currentYear && monthNum < currentMonth) return false;
  if (expiryYear === maxYear && monthNum > currentMonth) return false;
  
  return true;
}

/**
 * Formatea entrada de fecha de expiración: "1224" -> "12/24"
 */
export function formatExpiryDate(value: string): string {
  let digits = value.replace(/\D/g, '').slice(0, 4);
  
  if (digits.length >= 2) {
    digits = digits.slice(0, 2) + '/' + digits.slice(2, 4);
  }
  
  return digits;
}

// ============= CONTRASEÑA =============
/**
 * Valida contraseña
 * Mínimo 6 caracteres
 */
export function validatePassword(password: string): boolean {
  if (!password) return false;
  return password.length >= 6;
}

/**
 * Valida que dos contraseñas coincidan
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

// ============= UTILIDAD: Formatear teléfono para visualización =============
/**
 * Convierte teléfono al formato visual
 * "0999999999" -> "0 999 999 999"
 * "+593999999999" -> "+593 999 999 999"
 */
export function formatPhoneForDisplay(phone: string): string {
  const cleanPhone = phone.replace(/\s/g, '').trim();
  
  if (cleanPhone.startsWith('+593')) {
    const digits = cleanPhone.slice(4); // quita +593
    return `+593 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  
  if (cleanPhone.startsWith('0')) {
    const digits = cleanPhone.slice(1); // quita 0
    return `0 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  
  return cleanPhone;
}
