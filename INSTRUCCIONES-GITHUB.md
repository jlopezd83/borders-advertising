# 📚 **Instrucciones Paso a Paso - GitHub y Vercel**

## ✅ **Votos Agregados al Panel de Admin**

He agregado la funcionalidad que pediste:
- **Contadores de votos** (a favor, en contra, abstención)
- **Lista de votos recientes** con nombres de votantes
- **Actualización automática** cuando hay nuevos votos

## 🚀 **Paso 1: Crear Repositorio en GitHub**

### **Opción A: Desde GitHub.com**
1. **Ir a [github.com](https://github.com)**
2. **Hacer clic en "New repository"** (botón verde)
3. **Llenar el formulario:**
   - Repository name: `borders-advertising`
   - Description: `Sistema de Nominaciones y Votaciones`
   - Marcar "Public" o "Private" (tu elección)
   - **NO marcar** "Add a README file" (ya tenemos uno)
   - **NO marcar** "Add .gitignore" (ya tenemos uno)
   - **NO marcar** "Choose a license"
4. **Hacer clic en "Create repository"**

### **Opción B: Desde GitHub Desktop**
1. **Abrir GitHub Desktop**
2. **File → New Repository**
3. **Llenar los campos** igual que arriba
4. **Crear repositorio**

## 🚀 **Paso 2: Subir Código a GitHub**

### **Desde Terminal (Recomendado):**
```bash
# En tu terminal, en la carpeta del proyecto
git remote add origin https://github.com/TU_USUARIO/borders-advertising.git
git push -u origin main
```

**Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub**

### **Desde GitHub Desktop:**
1. **Abrir GitHub Desktop**
2. **File → Add Local Repository**
3. **Seleccionar la carpeta** `borders-advertising`
4. **Hacer clic en "Publish repository"**
5. **Llenar el formulario** y hacer clic en "Publish"

## 🚀 **Paso 3: Desplegar en Vercel**

### **Opción A: Desde Vercel.com (Recomendado)**
1. **Ir a [vercel.com](https://vercel.com)**
2. **Hacer clic en "Sign up"** o "Log in"
3. **Conectar con GitHub:**
   - Hacer clic en "Continue with GitHub"
   - Autorizar Vercel
4. **Importar proyecto:**
   - Hacer clic en "New Project"
   - Seleccionar `borders-advertising`
   - Hacer clic en "Import"

### **Opción B: Desde Vercel CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# En la carpeta del proyecto
vercel

# Seguir las instrucciones en pantalla
```

## 🔧 **Paso 4: Configurar Base de Datos (Vercel KV)**

### **Crear Base de Datos:**
1. **En el dashboard de Vercel:**
   - Ir a "Storage" en el menú lateral
   - Hacer clic en "Create Database"
   - Seleccionar "KV"
   - Nombre: `borders-kv`
   - Hacer clic en "Create"

### **Obtener Credenciales:**
1. **Hacer clic en la base de datos** `borders-kv`
2. **Ir a "Settings"**
3. **Copiar las credenciales:**
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### **Agregar Variables de Entorno:**
1. **En tu proyecto de Vercel:**
   - Ir a "Settings" → "Environment Variables"
   - Hacer clic en "Add New"
   - Nombre: `KV_REST_API_URL`
   - Valor: tu URL de KV
   - Hacer clic en "Save"
2. **Repetir para:**
   - Nombre: `KV_REST_API_TOKEN`
   - Valor: tu token de KV

## 🔄 **Paso 5: Cambiar a Versión Vercel**

### **Hacer Backup de Versión Local:**
```bash
# En la carpeta del proyecto
mv app/page.tsx app/page-local-backup.tsx
```

### **Usar Versión Vercel:**
```bash
# Cambiar a versión de Vercel
mv app/page-vercel.tsx app/page.tsx
```

### **Hacer Commit y Push:**
```bash
git add .
git commit -m "Switch to Vercel KV version for production"
git push
```

## ✅ **Paso 6: Verificar Despliegue**

### **Vercel desplegará automáticamente:**
1. **Esperar 2-3 minutos** para que se complete el despliegue
2. **Ir a la URL** que te da Vercel (ej: `https://borders-advertising.vercel.app`)
3. **Probar la aplicación:**
   - Crear nominaciones
   - Votar por nominaciones
   - Ver votos en el panel de admin
   - Los datos se comparten entre usuarios

## 🎯 **Funcionalidades Agregadas**

### **✅ Panel de Admin Mejorado:**
- **Contadores de votos** en tiempo real
- **Lista de votantes** con sus votos
- **Actualización automática** cuando hay nuevos votos
- **Vista detallada** de cada nominación

### **✅ Sistema Completo:**
- **Nominaciones** con razones detalladas
- **Votación** (a favor, en contra, abstención)
- **Validación** por administradores
- **Puntos automáticos** cuando se aprueba
- **Datos compartidos** entre usuarios

## 🚨 **Solución de Problemas**

### **Error: "Repository not found"**
- Verificar que el repositorio existe en GitHub
- Verificar que tienes permisos de escritura

### **Error: "KV not configured"**
- Verificar que las variables de entorno estén configuradas
- Esperar unos minutos para que se propaguen

### **Error: "Cannot find module @vercel/kv"**
- Ejecutar `npm install @vercel/kv`
- Hacer commit y push de los cambios

## 🎉 **¡Listo!**

Una vez completado, tendrás:
- **Repositorio en GitHub** con todo el código
- **Aplicación en Vercel** funcionando en la nube
- **Base de datos** compartida entre usuarios
- **Votos visibles** en el panel de admin
- **Despliegue automático** desde GitHub

¡Tu sistema de nominaciones estará funcionando perfectamente en la nube! 🚀
