# 🚀 Sistema de Nominaciones - Vercel Deployment

## ✅ **Configuración Completada**

Este proyecto está listo para desplegar en Vercel con Supabase como base de datos.

## 🔧 **Variables de Entorno Requeridas en Vercel**

Configura estas variables en el dashboard de Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://sfiorriazredeajsiczn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaW9ycmlhenJlZGVhanNpY3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MTQ2OTcsImV4cCI6MjA3MzA5MDY5N30.LgeIvmOHTWH9n2DDS0OMG15na8fN_ciT6T5gj25byaY
```

## 🎯 **Funcionalidades Implementadas**

- ✅ **Gestión de Personas** - Solo nombre y puntos (sin descripciones)
- ✅ **Puntos Clickeables** - Modal con historial de razones
- ✅ **Sistema de Nominaciones** - Nominar, votar, aprobar/rechazar
- ✅ **Panel de Administración** - Gestión completa con advertencias
- ✅ **Razones Obligatorias** - Admin debe dar razón al añadir puntos
- ✅ **Base de Datos Supabase** - Persistencia y escalabilidad

## 🚀 **Deployment**

1. **Conectar con GitHub** en Vercel
2. **Importar este repositorio**
3. **Configurar variables de entorno**
4. **Deploy automático**

## 🔐 **Credenciales de Admin**

- **Usuario:** admin
- **Contraseña:** admin123

## 📊 **Base de Datos**

El proyecto usa Supabase con las siguientes tablas:
- `persons` - Lista de personas
- `nominations` - Nominaciones pendientes/aprobadas
- `votes` - Votos de usuarios
- `point_reasons` - Historial de puntos con razones
- `admins` - Administradores del sistema
