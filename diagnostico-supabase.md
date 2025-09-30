# 🔍 Diagnóstico de Problemas con Supabase

## Pasos para Diagnosticar el Problema

### 1. Verificar Políticas RLS (Row Level Security)

**Problema más probable**: Las políticas RLS están bloqueando las operaciones.

**Solución**:
1. Ve al **SQL Editor** de tu proyecto Supabase
2. Ejecuta el contenido del archivo `supabase-policies.sql`
3. Esto habilitará todas las operaciones para todas las tablas

### 2. Verificar Conexión y Credenciales

**Verificar variables de entorno**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**En Vercel**:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Verifica que estén configuradas correctamente

### 3. Verificar Logs de Consola

**En el navegador**:
1. Abre F12 → Console
2. Intenta aprobar una nominación o eliminar una persona
3. Busca mensajes de error específicos

### 4. Verificar Estructura de Base de Datos

**En Supabase Dashboard**:
1. Table Editor
2. Verifica que existan las tablas:
   - `persons`
   - `nominations` 
   - `votes`
   - `point_reasons`
3. Verifica que tengan datos

### 5. Probar Conexión Directa

**En SQL Editor de Supabase**:
```sql
-- Probar inserción directa
INSERT INTO persons (name, points) VALUES ('Test Person', 0);

-- Probar actualización directa
UPDATE persons SET points = 1 WHERE name = 'Test Person';

-- Probar eliminación directa
DELETE FROM persons WHERE name = 'Test Person';
```

## Errores Comunes y Soluciones

### Error: "new row violates row-level security policy"
**Solución**: Ejecutar `supabase-policies.sql`

### Error: "JWT expired" o "Invalid JWT"
**Solución**: Verificar las credenciales de Supabase

### Error: "relation does not exist"
**Solución**: Verificar que las tablas existan en la base de datos

### Error: "permission denied for table"
**Solución**: Ejecutar las políticas RLS

## Comandos de Verificación

```bash
# Verificar variables de entorno localmente
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verificar conexión
npm run dev
# Abrir http://localhost:3000 y revisar consola
```
