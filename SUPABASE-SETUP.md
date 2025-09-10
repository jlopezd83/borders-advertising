# 🚀 Configuración de Supabase - Paso a Paso

## ✅ **Limpieza Completada**

He eliminado todo lo relacionado con Vercel KV y ahora usaremos Supabase, que es mucho más fácil de configurar.

## 🔧 **Paso 1: Crear Proyecto en Supabase**

1. **Ve a [supabase.com](https://supabase.com)**
2. **Haz clic en "Start your project"**
3. **Conecta con GitHub** (opcional pero recomendado)
4. **Crea un nuevo proyecto:**
   - **Name:** `borders-advertising`
   - **Database Password:** (elige una contraseña segura)
   - **Region:** Elige la más cercana a ti
   - **Pricing Plan:** Free (para empezar)

## 🔧 **Paso 2: Obtener Credenciales**

Una vez creado el proyecto:

1. **Ve a Settings → API**
2. **Copia estas credenciales:**
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (una clave larga que empieza con `eyJ...`)

## 🔧 **Paso 3: Configurar Variables de Entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

**Reemplaza** `xxxxx` y `eyJ...` con tus credenciales reales.

## 🔧 **Paso 4: Ejecutar Script SQL**

1. **Ve a SQL Editor** en Supabase
2. **Crea una nueva query**
3. **Copia y pega** el contenido del archivo `supabase-schema.sql`
4. **Ejecuta el script** (botón "Run")

## 🔧 **Paso 5: Cambiar a Versión Supabase**

Una vez configurado Supabase:

```bash
# Hacer backup de la versión local
mv app/page.tsx app/page-local-backup.tsx

# Usar la versión de Supabase
mv app/page-supabase.tsx app/page.tsx

# Hacer commit y push
git add .
git commit -m "Switch to Supabase version"
git push
```

## 🎯 **Ventajas de Supabase**

### **✅ Fácil de Configurar:**
- **Interfaz web** intuitiva
- **Script SQL** ya preparado
- **Variables de entorno** simples

### **✅ Funcionalidades:**
- **Base de datos PostgreSQL** robusta
- **API automática** generada
- **Autenticación** incluida
- **Dashboard** para ver datos

### **✅ Datos Compartidos:**
- **Todos los usuarios** ven los mismos datos
- **Persistencia** garantizada
- **Escalable** para muchos usuarios

## 🔄 **Flujo de Trabajo**

1. **Nominación** → Usuario crea nominación → Estado: `Pendiente`
2. **Votación** → Otros usuarios votan por la nominación
3. **Admin ve votos** → Puede ver contadores y votantes
4. **Validación** → Admin aprueba/rechaza → Estado: `Aprobada`/`Rechazada`
5. **Puntos** → Si se aprueba, la persona recibe +1 punto automáticamente

## 🎉 **¡Listo para Configurar!**

Una vez que tengas las credenciales de Supabase, solo necesitas:
1. **Crear el archivo `.env.local`**
2. **Ejecutar el script SQL**
3. **Cambiar a la versión Supabase**

¡Es mucho más fácil que Vercel KV! 🚀
