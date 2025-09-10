# 🎯 Sistema de Nominaciones - Instrucciones de Uso

## ✅ **Problema Resuelto: Sistema Local Sin Base de Datos Externa**

He solucionado el problema de las contraseñas creando una versión que funciona completamente en el navegador usando **localStorage**. No necesitas configurar Supabase ni ninguna base de datos externa.

## 🚀 **Cómo Usar la Aplicación**

### **1. Ejecutar la Aplicación**
```bash
npm run dev
```
Luego ve a: `http://localhost:3000`

### **2. Credenciales de Administrador**
- **Usuario:** `admin`
- **Contraseña:** `admin123`

## 📋 **Funcionalidades Disponibles**

### **Para Usuarios Regulares:**
1. **Ver lista de personas** - Personas disponibles para nominar
2. **Nominar personas** - Crear nominaciones con razones detalladas
3. **Votar por nominaciones** - Votar a favor, en contra o abstenerse
4. **Ver progreso** - Seguir el estado de las nominaciones

### **Para Administradores:**
1. **Gestionar personas** - Agregar, editar, eliminar personas
2. **Validar nominaciones** - Aprobar o rechazar nominaciones
3. **Otorgar puntos** - Dar puntos manualmente o automáticamente
4. **Ver estadísticas** - Revisar todas las nominaciones y votos

## 🔄 **Flujo de Trabajo**

1. **Nominación** → Usuario crea nominación → Estado: `Pendiente`
2. **Votación** → Otros usuarios votan por la nominación
3. **Validación** → Admin aprueba/rechaza → Estado: `Aprobada`/`Rechazada`
4. **Puntos** → Si se aprueba, la persona recibe +1 punto automáticamente

## 💾 **Almacenamiento de Datos**

- **Datos persistentes:** Se guardan en el navegador (localStorage)
- **Sin base de datos externa:** No necesitas configurar nada
- **Datos de ejemplo:** Incluye 5 personas y un administrador por defecto
- **Respaldo:** Los datos se mantienen entre sesiones del navegador

## 🎨 **Características del Diseño**

- ✅ **Completamente responsive** - Funciona en móviles y desktop
- ✅ **Interfaz moderna** - Diseño atractivo con gradientes y animaciones
- ✅ **Fácil de usar** - Navegación intuitiva
- ✅ **Feedback visual** - Estados de carga y confirmaciones

## 🔧 **Archivos Importantes**

- `app/page.tsx` - Página principal (versión local)
- `lib/localStorage.ts` - Sistema de almacenamiento local
- `components/` - Todos los componentes de la interfaz
- `app/page-local.tsx` - Versión alternativa completa

## 🚨 **Notas Importantes**

1. **Datos locales:** Los datos se guardan en tu navegador
2. **Sin servidor:** No necesitas configurar base de datos
3. **Funciona offline:** Una vez cargada, funciona sin internet
4. **Datos de prueba:** Incluye personas y administrador de ejemplo

## 🎯 **Prueba Rápida**

1. Abre `http://localhost:3000`
2. Haz clic en "Admin" (esquina superior derecha)
3. Usa: `admin` / `admin123`
4. Explora el panel de administración
5. Cierra sesión y prueba como usuario normal
6. ¡Nominar y votar!

## 🔄 **Versiones Disponibles**

- **Versión Local** (actual): Sin base de datos externa
- **Versión Supabase**: Con base de datos en la nube (archivo `supabase-schema.sql`)

La versión local es perfecta para demos, pruebas o uso personal. ¡Todo funciona sin configuración adicional!
