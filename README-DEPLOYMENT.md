# 🚀 Guía de Despliegue - Sistema de Nominaciones

## 📋 **Opciones de Despliegue**

### **Opción 1: Vercel + GitHub (Recomendado)**
- ✅ **Datos compartidos** entre todos los usuarios
- ✅ **Base de datos en la nube** (Vercel KV)
- ✅ **Despliegue automático** desde GitHub
- ✅ **Gratis** para proyectos pequeños

### **Opción 2: Solo Local (Actual)**
- ✅ **Sin configuración** de base de datos
- ✅ **Datos en el navegador** (localStorage)
- ✅ **Perfecto para demos** y pruebas

## 🚀 **Desplegar en Vercel + GitHub**

### **Paso 1: Subir a GitHub**

1. **Crear repositorio en GitHub:**
   ```bash
   # En tu terminal
   git init
   git add .
   git commit -m "Initial commit: Sistema de Nominaciones"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/borders-advertising.git
   git push -u origin main
   ```

2. **O usar GitHub Desktop** para subir el proyecto

### **Paso 2: Configurar Vercel**

1. **Ir a [vercel.com](https://vercel.com)**
2. **Conectar con GitHub** y seleccionar el repositorio
3. **Configurar variables de entorno:**
   - `KV_REST_API_URL` - URL de tu base de datos KV
   - `KV_REST_API_TOKEN` - Token de acceso

### **Paso 3: Configurar Vercel KV**

1. **En el dashboard de Vercel:**
   - Ve a "Storage" → "Create Database" → "KV"
   - Nombra tu base de datos (ej: "borders-kv")
   - Copia las credenciales

2. **Agregar variables de entorno:**
   - En tu proyecto de Vercel
   - Ve a "Settings" → "Environment Variables"
   - Agregar:
     - `KV_REST_API_URL` = tu URL
     - `KV_REST_API_TOKEN` = tu token

### **Paso 4: Cambiar a la versión Vercel**

1. **Renombrar archivos:**
   ```bash
   # Hacer backup de la versión local
   mv app/page.tsx app/page-local.tsx
   
   # Usar la versión de Vercel
   mv app/page-vercel.tsx app/page.tsx
   ```

2. **Instalar dependencias:**
   ```bash
   npm install @vercel/kv
   ```

3. **Hacer commit y push:**
   ```bash
   git add .
   git commit -m "Switch to Vercel KV version"
   git push
   ```

## 🔧 **Configuración Manual de Vercel KV**

Si prefieres configurar manualmente:

### **1. Instalar Vercel KV:**
```bash
npm install @vercel/kv
```

### **2. Crear archivo de configuración:**
```typescript
// lib/vercel-kv-config.ts
import { kv } from '@vercel/kv'

export { kv }
```

### **3. Variables de entorno (.env.local):**
```env
KV_REST_API_URL=tu_url_aqui
KV_REST_API_TOKEN=tu_token_aqui
```

## 📱 **Características de la Versión Vercel**

### **✅ Ventajas:**
- **Datos compartidos** - Todos los usuarios ven los mismos datos
- **Persistencia** - Los datos no se pierden al cerrar el navegador
- **Escalable** - Soporta muchos usuarios simultáneos
- **Real-time** - Los cambios se ven inmediatamente

### **🔧 Funcionalidades:**
- Sistema completo de nominaciones
- Votación en tiempo real
- Panel de administración
- Datos persistentes en la nube

## 🎯 **Instrucciones de Uso**

### **Para Usuarios:**
1. **Acceder a la URL** de Vercel
2. **Nominar personas** con razones detalladas
3. **Votar por nominaciones** pendientes
4. **Ver resultados** en tiempo real

### **Para Administradores:**
- **Credenciales:** `admin` / `admin123`
- **Gestionar personas** - Agregar, editar, eliminar
- **Validar nominaciones** - Aprobar o rechazar
- **Ver estadísticas** - Todas las nominaciones y votos

## 🔄 **Flujo de Trabajo**

1. **Nominación** → Usuario crea nominación → Estado: `Pendiente`
2. **Votación** → Otros usuarios votan por la nominación
3. **Validación** → Admin aprueba/rechaza → Estado: `Aprobada`/`Rechazada`
4. **Puntos** → Si se aprueba, la persona recibe +1 punto automáticamente

## 🛠️ **Solución de Problemas**

### **Error: "KV not configured"**
- Verificar que las variables de entorno estén configuradas
- Asegurarse de que Vercel KV esté habilitado

### **Error: "Cannot find module @vercel/kv"**
- Ejecutar `npm install @vercel/kv`
- Verificar que esté en package.json

### **Datos no se guardan**
- Verificar conexión a Vercel KV
- Revisar logs en Vercel dashboard

## 📊 **Monitoreo**

- **Vercel Dashboard** - Ver logs y métricas
- **Vercel KV Dashboard** - Ver datos almacenados
- **GitHub** - Ver historial de cambios

## 🎉 **¡Listo!**

Una vez configurado, tu aplicación estará disponible en:
- **URL de Vercel:** `https://tu-proyecto.vercel.app`
- **Datos compartidos** entre todos los usuarios
- **Actualizaciones automáticas** desde GitHub

¡Tu sistema de nominaciones estará funcionando en la nube! 🚀
