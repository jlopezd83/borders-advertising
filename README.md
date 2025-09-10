# Sistema de Nominaciones y Votaciones

Una aplicación web moderna y responsive para gestionar nominaciones y votaciones de personas, desarrollada con Next.js y Supabase.

## Características

- 🎯 **Sistema de Nominaciones**: Los usuarios pueden nominar personas con razones detalladas
- 🗳️ **Sistema de Votación**: Votación a favor, en contra o abstención
- 👨‍💼 **Panel de Administración**: Gestión completa de personas y validación de nominaciones
- 📱 **Diseño Responsive**: Optimizado para dispositivos móviles y desktop
- 🔐 **Autenticación de Administradores**: Sistema seguro de login para administradores
- ⚡ **Tiempo Real**: Actualizaciones instantáneas con Supabase

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: Supabase (PostgreSQL)
- **Iconos**: Lucide React
- **Autenticación**: Sistema personalizado de administradores

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd borders-advertising
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://esnxdnecppajfydwznmt.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbnhkbmVjcHBhamZ5ZHd6bm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODA0MjUsImV4cCI6MjA2NzQ1NjQyNX0.8-Z9brVNnDJV1rk94YSin82oSmU0P1CIH1x2UfdurrI
   ```

4. **Configurar la base de datos**
   - Ejecutar el script SQL en Supabase (archivo `supabase-schema.sql`)
   - Esto creará las tablas necesarias y datos de ejemplo

5. **Ejecutar la aplicación**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   Visitar `http://localhost:3000`

## Uso

### Para Usuarios Regulares

1. **Ver la lista de personas** disponibles para nominar
2. **Nominar a una persona** haciendo clic en "Nominar" y completando el formulario
3. **Votar por nominaciones pendientes** en la sección de "Nominaciones Pendientes"
4. **Ver el progreso** de las nominaciones y votos

### Para Administradores

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

**Funciones del administrador:**
- Gestionar la lista de personas (agregar, editar, eliminar)
- Validar o rechazar nominaciones pendientes
- Ver estadísticas de votos
- Otorgar puntos manualmente

## Estructura de la Base de Datos

### Tablas Principales

- **`persons`**: Información de las personas nominables
- **`nominations`**: Nominaciones con estado (pending/approved/rejected)
- **`votes`**: Votos de los usuarios (for/against/abstain)
- **`admins`**: Administradores del sistema

### Flujo de Trabajo

1. **Nominación**: Usuario crea una nominación → Estado: `pending`
2. **Votación**: Otros usuarios votan por la nominación
3. **Validación**: Administrador aprueba o rechaza la nominación
4. **Puntos**: Si se aprueba, la persona recibe +1 punto

## Características Técnicas

### Seguridad
- Validación de datos en frontend y backend
- Autenticación segura de administradores
- Prevención de nominaciones duplicadas

### UX/UI
- Diseño moderno y atractivo
- Interfaz intuitiva y fácil de usar
- Feedback visual inmediato
- Responsive design para todos los dispositivos

### Rendimiento
- Carga rápida con Next.js
- Optimización de consultas a la base de datos
- Estados de carga y error manejados

## Personalización

### Cambiar Colores
Editar `tailwind.config.js` para personalizar la paleta de colores.

### Agregar Campos
Modificar las interfaces en `lib/supabase.ts` y actualizar la base de datos.

### Estilos
Los estilos están en `app/globals.css` usando clases de Tailwind CSS.

## Despliegue

### Vercel (Recomendado)
1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno
3. Desplegar automáticamente

### Otras Plataformas
La aplicación es compatible con cualquier plataforma que soporte Next.js.

## Contribución

1. Fork del proyecto
2. Crear una rama para la nueva característica
3. Commit de los cambios
4. Push a la rama
5. Crear un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Soporte

Para soporte técnico o preguntas, contactar al desarrollador.

---

**Desarrollado con ❤️ usando Next.js y Supabase**
