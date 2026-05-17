# 🔍 Auditoría de Validaciones Frontend - CrowStore

## Resumen Ejecutivo
Se encontraron **7 problemas principales** de validación en formularios del frontend. El más crítico es el **campo de teléfono** que no restringe a números ni máximo de dígitos.

---

## 🚨 PROBLEMAS CRÍTICOS

### 1. **CAMPO TELÉFONO - Validación Insuficiente**

**Ubicación**: 
- `src/app/pages/RegisterPage.tsx` - SIN VALIDACIÓN
- `src/app/pages/CheckoutPage.tsx` - VALIDACIÓN DÉBIL

**Problema Actual**:
```tsx
// CheckoutPage: Regex actual - MUY PERMISIVA
const phone = (formData.get("phone") as string)?.trim();
if (phone && !/^(\+593|0)[0-9\s\-()]{6,}$/.test(phone)) {
  newErrors.phone = "Teléfono inválido...";
}
```

**Defectos**:
- ❌ Permite espacios, guiones y paréntesis
- ❌ NO hay límite de dígitos (puede ser 20+ caracteres)
- ❌ NO restringe a solo números
- ❌ RegisterPage NO valida nada

**Entrada Problemática Aceptada**:
```
✗ "(0) 999-999-999-999" ← Acepta 12 dígitos + caracteres especiales
✗ "0 99 99 99 99 99 99"  ← Acepta 14 dígitos con espacios
✗ "0999-999-999" ← Acepta 10 dígitos pero con guiones
```

**Solución Requerida**:
```tsx
// Validar: solo números, máximo 10 dígitos después del prefijo
const phoneRegex = /^(\+593|0)\d{9}$/; // Exactamente 9 dígitos después del prefijo
// Alternativa flexible: /^(\+593|0)\d{6,10}$/ (6-10 dígitos)
```

---

### 2. **TARJETA DE CRÉDITO - Sin Validación Luhn**

**Ubicación**: `src/app/pages/CheckoutPage.tsx`

**Problema Actual**:
```tsx
const cardNumber = (formData.get("cardNumber") as string)?.replace(/\s/g, "");
if (!cardNumber || cardNumber.length < 13) {
  newErrors.cardNumber = "Número de tarjeta inválido";
}
```

**Defectos**:
- ❌ Solo verifica longitud mínima (13 caracteres)
- ❌ NO valida algoritmo Luhn (checksum)
- ❌ NO existe formateo automático (espacios cada 4 dígitos)
- ❌ Acepta caracteres no numéricos

**Entrada Problemática Aceptada**:
```
✗ "1234567890123" ← 13 dígitos inválidos (falla Luhn)
✗ "9999 9999 9999 9999" ← Falla Luhn pero se acepta
```

**Solución Requerida**:
```tsx
// 1. Validar algoritmo Luhn
function validateLuhn(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '');
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

// 2. Formateo automático al escribir
const handleCardChange = (value) => {
  const formatted = value
    .replace(/\s/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim();
  return formatted;
};
```

---

### 3. **CVV - Sin Restricción a Solo Números**

**Ubicación**: `src/app/pages/CheckoutPage.tsx`

**Problema Actual**:
```tsx
const cvv = formData.get("cvv") as string;
if (!cvv || cvv.length !== 3 || !/^\d+$/.test(cvv)) {
  newErrors.cvv = "CVV debe ser de 3 dígitos";
}
```

**Defectos**:
- ❌ Input `type="text"` permite cualquier carácter mientras se escribe
- ❌ Solo valida al enviar (debe ser en tiempo real)
- ✓ Regex está bien pero la entrada no se restringe

**Entrada Problemática Aceptada**:
```
✗ "ab3" ← Se acepta mientras escribes, luego error en submit
✗ "***" ← Se acepta mientras escribes
```

**Solución Requerida**:
```tsx
<Input
  id="cvv"
  name="cvv"
  type="text"
  placeholder="123"
  maxLength={3}
  inputMode="numeric"
  onKeyDown={(e) => {
    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }
  }}
  onChange={(e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
  }}
/>
```

---

## ⚠️ PROBLEMAS MEDIOS

### 4. **CÓDIGO POSTAL - Sin Validación**

**Ubicación**: `src/app/pages/CheckoutPage.tsx`

**Problema Actual**:
```tsx
if (!formData.get("postal")) {
  newErrors.postal = "El código postal es obligatorio";
}
// Solo valida que no sea vacío
```

**Defectos**:
- ❌ Sin validación de formato (para España debe ser 5 números)
- ❌ Sin límite de caracteres
- ❌ Acepta caracteres especiales

**Entrada Problemática Aceptada**:
```
✗ "ABCDE12345" ← Letras + números (muy largo)
✗ "123" ← Menos de 5 dígitos
✗ "28001@@@" ← Caracteres especiales
```

**Solución Requerida**:
```tsx
// Para España: 5 dígitos
const postalRegex = /^\d{5}$/;
if (!postalRegex.test(formData.get("postal"))) {
  newErrors.postal = "Código postal debe ser 5 dígitos (ej: 28001)";
}
```

---

### 5. **NOMBRE COMPLETO - Sin Validación de Longitud**

**Ubicación**: `src/app/pages/RegisterPage.tsx`, `src/app/pages/CheckoutPage.tsx`

**Problema Actual**:
```tsx
if (!formData.get("name")) {
  newErrors.name = "El nombre completo es obligatorio";
}
// Solo valida que no sea vacío
```

**Defectos**:
- ❌ Acepta nombres muy cortos ("A")
- ❌ Sin validación de caracteres especiales
- ❌ Sin límite máximo de caracteres

**Entrada Problemática Aceptada**:
```
✗ "A" ← Nombre de 1 carácter
✗ "123456789" ← Solo números
✗ "!!!@@@###" ← Solo caracteres especiales
✗ "Juan" + 200 espacios ← Abuso de memoria
```

**Solución Requerida**:
```tsx
const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,100}$/;
if (!nameRegex.test(formData.get("name"))) {
  newErrors.name = "Nombre debe tener 2-100 caracteres (letras y espacios)";
}
```

---

### 6. **DIRECCIÓN - Sin Validación de Longitud**

**Ubicación**: `src/app/pages/CheckoutPage.tsx`

**Problema Actual**:
```tsx
if (!formData.get("address")) {
  newErrors.address = "La dirección es obligatoria";
}
// Solo valida que no sea vacío
```

**Defectos**:
- ❌ Acepta direcciones muy cortas
- ❌ Sin validación de formato
- ❌ Sin límite de caracteres

**Entrada Problemática Aceptada**:
```
✗ "X" ← Dirección de 1 carácter
✗ "     " ← Espacios en blanco
✗ "Calle" + 500 caracteres ← Abuso de memoria
```

**Solución Requerida**:
```tsx
const address = (formData.get("address") as string)?.trim();
if (address.length < 5 || address.length > 200) {
  newErrors.address = "La dirección debe tener entre 5 y 200 caracteres";
}
```

---

### 7. **CIUDAD - Sin Validación**

**Ubicación**: `src/app/pages/CheckoutPage.tsx`

**Problema Actual**:
```tsx
if (!formData.get("city")) {
  newErrors.city = "La ciudad es obligatoria";
}
// Solo valida que no sea vacío
```

**Defectos**:
- ❌ Sin validación de formato
- ❌ Sin límite de caracteres
- ❌ Acepta números, caracteres especiales

**Entrada Problemática Aceptada**:
```
✗ "M" ← Ciudad de 1 carácter
✗ "123456" ← Solo números
✗ "@@@###" ← Caracteres especiales
```

**Solución Requerida**:
```tsx
const cityRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,50}$/;
if (!cityRegex.test(formData.get("city"))) {
  newErrors.city = "Ciudad debe tener 2-50 caracteres (solo letras y espacios)";
}
```

---

## 📊 Tabla Resumen de Severidad

| Campo | Ubicación | Problema | Severidad | Línea |
|-------|-----------|----------|-----------|-------|
| Teléfono | RegisterPage, CheckoutPage | Sin validación/muy permisiva | 🔴 Crítica | ~90, 280 |
| Tarjeta Crédito | CheckoutPage | Sin Luhn, sin formateo | 🔴 Crítica | ~390 |
| CVV | CheckoutPage | Sin restricción numérica | 🟠 Media | ~410 |
| Código Postal | CheckoutPage | Sin formato | 🟠 Media | ~330 |
| Nombre | RegisterPage, CheckoutPage | Sin mínimo/máximo | 🟠 Media | ~63, 270 |
| Dirección | CheckoutPage | Sin mínimo/máximo | 🟠 Media | ~310 |
| Ciudad | CheckoutPage | Sin validación | 🟡 Baja | ~320 |

---

## ✅ Recomendaciones

1. **Inmediato** (Esta semana):
   - [ ] Fijar validación de teléfono a solo números, máximo 10 dígitos
   - [ ] Implementar validación Luhn para tarjetas
   - [ ] Restringir CVV a solo números en tiempo real

2. **Corto plazo** (Próximas 2 semanas):
   - [ ] Validar código postal (5 dígitos para España)
   - [ ] Validar nombre (2-100 caracteres, sin números)
   - [ ] Validar dirección (5-200 caracteres)
   - [ ] Validar ciudad (2-50 caracteres, sin números)

3. **Mejoras adicionales**:
   - [ ] Agregar mensajes de error más claros en tiempo real
   - [ ] Implementar validación server-side (actual solo cliente)
   - [ ] Usar librerías como `zod` o `valibot` para esquemas centralizados
   - [ ] Formateo automático de teléfono mientras se escribe

---

## 📝 Archivos a Modificar

1. `src/app/pages/RegisterPage.tsx`
2. `src/app/pages/CheckoutPage.tsx`
3. Crear: `src/app/utils/validators.ts` (funciones de validación reutilizables)

---

**Auditado**: 13 de mayo de 2026  
**Por**: Análisis Automático Frontend
