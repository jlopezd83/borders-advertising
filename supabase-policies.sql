-- Configurar políticas RLS (Row Level Security) para permitir operaciones
-- Ejecutar este script en el SQL Editor de Supabase

-- Habilitar RLS en todas las tablas
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE nominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_reasons ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla 'persons'
-- Permitir lectura a todos
CREATE POLICY "Allow read access to persons" ON persons
  FOR SELECT USING (true);

-- Permitir inserción a todos
CREATE POLICY "Allow insert access to persons" ON persons
  FOR INSERT WITH CHECK (true);

-- Permitir actualización a todos
CREATE POLICY "Allow update access to persons" ON persons
  FOR UPDATE USING (true);

-- Permitir eliminación a todos
CREATE POLICY "Allow delete access to persons" ON persons
  FOR DELETE USING (true);

-- Políticas para la tabla 'nominations'
-- Permitir lectura a todos
CREATE POLICY "Allow read access to nominations" ON nominations
  FOR SELECT USING (true);

-- Permitir inserción a todos
CREATE POLICY "Allow insert access to nominations" ON nominations
  FOR INSERT WITH CHECK (true);

-- Permitir actualización a todos
CREATE POLICY "Allow update access to nominations" ON nominations
  FOR UPDATE USING (true);

-- Permitir eliminación a todos
CREATE POLICY "Allow delete access to nominations" ON nominations
  FOR DELETE USING (true);

-- Políticas para la tabla 'votes'
-- Permitir lectura a todos
CREATE POLICY "Allow read access to votes" ON votes
  FOR SELECT USING (true);

-- Permitir inserción a todos
CREATE POLICY "Allow insert access to votes" ON votes
  FOR INSERT WITH CHECK (true);

-- Permitir actualización a todos
CREATE POLICY "Allow update access to votes" ON votes
  FOR UPDATE USING (true);

-- Permitir eliminación a todos
CREATE POLICY "Allow delete access to votes" ON votes
  FOR DELETE USING (true);

-- Políticas para la tabla 'point_reasons' (si existe)
-- Permitir lectura a todos
CREATE POLICY "Allow read access to point_reasons" ON point_reasons
  FOR SELECT USING (true);

-- Permitir inserción a todos
CREATE POLICY "Allow insert access to point_reasons" ON point_reasons
  FOR INSERT WITH CHECK (true);

-- Permitir actualización a todos
CREATE POLICY "Allow update access to point_reasons" ON point_reasons
  FOR UPDATE USING (true);

-- Permitir eliminación a todos
CREATE POLICY "Allow delete access to point_reasons" ON point_reasons
  FOR DELETE USING (true);
