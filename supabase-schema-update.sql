-- Actualizar esquema para guardar razones de puntos
-- Crear tabla para almacenar el historial de puntos con razones
CREATE TABLE IF NOT EXISTS point_reasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES persons(id) ON DELETE CASCADE,
  points_added INTEGER NOT NULL,
  reason TEXT NOT NULL,
  added_by VARCHAR(100) NOT NULL, -- 'admin' o 'nomination'
  nomination_id UUID REFERENCES nominations(id) ON DELETE SET NULL, -- NULL si fue añadido por admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_point_reasons_person_id ON point_reasons(person_id);

-- Migrar datos existentes (asignar puntos existentes a nominaciones aprobadas)
INSERT INTO point_reasons (person_id, points_added, reason, added_by, nomination_id)
SELECT 
  n.person_id,
  1 as points_added,
  n.reason,
  'nomination' as added_by,
  n.id as nomination_id
FROM nominations n
WHERE n.status = 'approved';

-- Actualizar las personas para que tengan los puntos correctos
UPDATE persons 
SET points = (
  SELECT COALESCE(SUM(pr.points_added), 0)
  FROM point_reasons pr
  WHERE pr.person_id = persons.id
);
