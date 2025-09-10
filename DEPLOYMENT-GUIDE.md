# 🚀 Guía de Despliegue - Sistema de Nominaciones

## ✅ **Votos Agregados al Panel de Admin**

He agregado la funcionalidad de ver votos en el panel de administración:
- **Contadores de votos** (a favor, en contra, abstención)
- **Lista de votos recientes** con nombres de votantes
- **Actualización automática** cuando hay nuevos votos

## 🚀 **Subir a GitHub y Vercel**

### **Paso 1: Subir a GitHub**

1. **Crear repositorio en GitHub:**
   - Ve a [github.com](https://github.com)
   - Haz clic en "New repository"
   - Nombre: `borders-advertising`
   - Marca "Public" o "Private" según prefieras
   - **NO** marques "Add README" (ya tenemos uno)

2. **Subir el código:**
   ```bash
   # En tu terminal, en la carpeta del proyecto
   git add .
   git commit -m "Sistema de Nominaciones completo con votos en admin"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/borders-advertising.git
   git push -u origin main
   ```

### **Paso 2: Desplegar en Vercel**

1. **Ir a [vercel.com](https://vercel.com)**
2. **Iniciar sesión** con GitHub
3. **Importar proyecto:**
   - Haz clic en "New Project"
   - Selecciona el repositorio `borders-advertising`
   - Haz clic en "Import"

4. **Configurar Vercel KV (Base de datos):**
   - En el dashboard de Vercel, ve a "Storage"
   - Haz clic en "Create Database" → "KV"
   - Nombre: `borders-kv`
   - Copia las credenciales que te da

5. **Agregar variables de entorno:**
   - En tu proyecto de Vercel, ve a "Settings" → "Environment Variables"
   - Agregar:
     - `KV_REST_API_URL` = tu URL de KV
     - `KV_REST_API_TOKEN` = tu token de KV

6. **Cambiar a versión Vercel:**
   ```bash
   # Hacer backup de la versión local
   mv app/page.tsx app/page-local-backup.tsx
   
   # Usar la versión de Vercel
   mv app/page-vercel.tsx app/page.tsx
   
   # Hacer commit y push
   git add .
   git commit -m "Switch to Vercel KV version for production"
   git push
   ```

### **Paso 3: Verificar Despliegue**

1. **Vercel desplegará automáticamente** tu aplicación
2. **URL de producción:** `https://tu-proyecto.vercel.app`
3. **Probar la aplicación:**
   - Crear nominaciones
   - Votar por nominaciones
   - Ver votos en el panel de admin
   - Los datos se comparten entre usuarios

## 🔧 **Configuración Manual (Alternativa)**

Si prefieres configurar manualmente:

### **1. Instalar Vercel CLI:**
```bash
npm i -g vercel
```

### **2. Desplegar:**
```bash
vercel
```

### **3. Configurar variables de entorno:**
```bash
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN
```

## 📊 **Características de la Versión Vercel**

### **✅ Ventajas:**
- **Datos compartidos** - Todos los usuarios ven los mismos datos
- **Persistencia** - Los datos no se pierden
- **Escalable** - Soporta muchos usuarios
- **Real-time** - Los cambios se ven inmediatamente
- **Votos visibles** - Los admins pueden ver todos los votos

### **🔧 Funcionalidades:**
- Sistema completo de nominaciones
- Votación en tiempo real
- Panel de administración con votos
- Datos persistentes en la nube
- Contadores de votos en tiempo real

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
- **Ver votos** - Contadores y lista de votantes
- **Ver estadísticas** - Todas las nominaciones y votos

## 🔄 **Flujo de Trabajo**

1. **Nominación** → Usuario crea nominación → Estado: `Pendiente`
2. **Votación** → Otros usuarios votan por la nominación
3. **Admin ve votos** → Puede ver contadores y votantes
4. **Validación** → Admin aprueba/rechaza → Estado: `Aprobada`/`Rechazada`
5. **Puntos** → Si se aprueba, la persona recibe +1 punto automáticamente

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
- **Votos visibles** en el panel de admin
- **Actualizaciones automáticas** desde GitHub

¡Tu sistema de nominaciones estará funcionando en la nube con votos visibles! 🚀
