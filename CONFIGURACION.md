# Configuración de la Base de Datos

## Pasos para configurar Supabase

### 1. Acceder a Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Crea un nuevo proyecto o usa el existente

### 2. Ejecutar el Script SQL
1. Ve a la sección "SQL Editor" en tu dashboard de Supabase
2. Copia y pega el contenido del archivo `supabase-schema.sql`
3. Ejecuta el script

### 3. Verificar las Tablas Creadas
Después de ejecutar el script, deberías tener estas tablas:
- `admins` - Administradores del sistema
- `persons` - Personas que pueden ser nominadas
- `nominations` - Nominaciones con estado
- `votes` - Votos de los usuarios

### 4. Datos de Prueba
El script incluye:
- Un administrador por defecto (usuario: `admin`, contraseña: `admin123`)
- 5 personas de ejemplo para nominar

### 5. Configurar Variables de Entorno
Asegúrate de que el archivo `.env.local` contenga:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 6. Probar la Aplicación
1. Ejecuta `npm run dev`
2. Ve a `http://localhost:3000`
3. Prueba el login de administrador con las credenciales por defecto

## Estructura de la Base de Datos

### Tabla `admins`
```sql
- id (UUID, Primary Key)
- username (VARCHAR, Unique)
- password (VARCHAR)
- created_at (TIMESTAMP)
```

### Tabla `persons`
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- description (TEXT, Optional)
- points (INTEGER, Default: 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabla `nominations`
```sql
- id (UUID, Primary Key)
- person_id (UUID, Foreign Key)
- nominator_name (VARCHAR)
- reason (TEXT)
- status (VARCHAR, Default: 'pending')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabla `votes`
```sql
- id (UUID, Primary Key)
- nomination_id (UUID, Foreign Key)
- voter_name (VARCHAR)
- vote_type (VARCHAR, 'for'|'against'|'abstain')
- created_at (TIMESTAMP)
```

## Flujo de Trabajo

1. **Nominación**: Usuario crea nominación → Estado: `pending`
2. **Votación**: Otros usuarios votan por la nominación
3. **Validación**: Admin aprueba/rechaza → Estado: `approved`/`rejected`
4. **Puntos**: Si se aprueba, la persona recibe +1 punto

## Seguridad

- Las contraseñas de administradores están hasheadas (en producción usar bcrypt)
- Validación de datos en frontend y backend
- Prevención de nominaciones duplicadas por persona
