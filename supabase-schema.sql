-- Crear tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de personas
CREATE TABLE IF NOT EXISTS persons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de nominaciones
CREATE TABLE IF NOT EXISTS nominations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES persons(id) ON DELETE CASCADE,
  nominator_name VARCHAR(100) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de votos
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nomination_id UUID REFERENCES nominations(id) ON DELETE CASCADE,
  voter_name VARCHAR(100) NOT NULL,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('for', 'against', 'abstain')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_nominations_person_id ON nominations(person_id);
CREATE INDEX IF NOT EXISTS idx_nominations_status ON nominations(status);
CREATE INDEX IF NOT EXISTS idx_votes_nomination_id ON votes(nomination_id);

-- Insertar un administrador por defecto (usuario: admin, contraseña: admin123)
INSERT INTO admins (username, password) 
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Insertar algunas personas de ejemplo
INSERT INTO persons (name, description, points) VALUES
('Juan Pérez', 'Desarrollador senior con 5 años de experiencia', 0),
('María García', 'Diseñadora UX/UI especializada en mobile', 0),
('Carlos López', 'Project Manager con certificación PMP', 0),
('Ana Martínez', 'Especialista en marketing digital', 0),
('Luis Rodríguez', 'Analista de datos y BI', 0)
ON CONFLICT DO NOTHING;
