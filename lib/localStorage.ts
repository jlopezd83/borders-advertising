// Sistema de almacenamiento local usando localStorage
// No requiere base de datos externa

export interface Person {
  id: string
  name: string
  description?: string
  points: number
  created_at: string
  updated_at: string
}

export interface Nomination {
  id: string
  person_id: string
  nominator_name: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  person?: Person
}

export interface Vote {
  id: string
  nomination_id: string
  voter_name: string
  vote_type: 'for' | 'against' | 'abstain'
  created_at: string
  nomination?: Nomination
}

export interface Admin {
  id: string
  username: string
  password: string
  created_at: string
}

// Claves para localStorage
const STORAGE_KEYS = {
  PERSONS: 'borders_persons',
  NOMINATIONS: 'borders_nominations',
  VOTES: 'borders_votes',
  ADMINS: 'borders_admins'
}

// Función para generar IDs únicos
const generateId = () => Math.random().toString(36).substr(2, 9)

// Función para obtener datos del localStorage
const getFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch {
    return defaultValue
  }
}

// Función para guardar datos en localStorage
const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Inicializar datos por defecto si no existen
const initializeDefaultData = () => {
  const persons = getFromStorage(STORAGE_KEYS.PERSONS, [])
  const admins = getFromStorage(STORAGE_KEYS.ADMINS, [])
  
  if (persons.length === 0) {
    const defaultPersons: Person[] = [
      {
        id: generateId(),
        name: 'Juan Pérez',
        description: 'Desarrollador senior con 5 años de experiencia',
        points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'María García',
        description: 'Diseñadora UX/UI especializada en mobile',
        points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Carlos López',
        description: 'Project Manager con certificación PMP',
        points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Ana Martínez',
        description: 'Especialista en marketing digital',
        points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Luis Rodríguez',
        description: 'Analista de datos y BI',
        points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    saveToStorage(STORAGE_KEYS.PERSONS, defaultPersons)
  }
  
  if (admins.length === 0) {
    const defaultAdmins: Admin[] = [
      {
        id: generateId(),
        username: 'admin',
        password: 'admin123',
        created_at: new Date().toISOString()
      }
    ]
    saveToStorage(STORAGE_KEYS.ADMINS, defaultAdmins)
  }
}

// API simulada para personas
export const personsApi = {
  getAll: (): Person[] => {
    initializeDefaultData()
    return getFromStorage(STORAGE_KEYS.PERSONS, [])
  },
  
  create: (person: Omit<Person, 'id' | 'created_at' | 'updated_at'>): Person => {
    const newPerson: Person = {
      ...person,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const persons = getFromStorage(STORAGE_KEYS.PERSONS, [])
    persons.push(newPerson)
    saveToStorage(STORAGE_KEYS.PERSONS, persons)
    return newPerson
  },
  
  update: (id: string, updates: Partial<Person>): Person | null => {
    const persons = getFromStorage(STORAGE_KEYS.PERSONS, [])
    const index = persons.findIndex(p => p.id === id)
    if (index === -1) return null
    
    persons[index] = {
      ...persons[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    saveToStorage(STORAGE_KEYS.PERSONS, persons)
    return persons[index]
  },
  
  delete: (id: string): boolean => {
    const persons = getFromStorage(STORAGE_KEYS.PERSONS, [])
    const filtered = persons.filter(p => p.id !== id)
    if (filtered.length === persons.length) return false
    
    saveToStorage(STORAGE_KEYS.PERSONS, filtered)
    return true
  }
}

// API simulada para nominaciones
export const nominationsApi = {
  getAll: (): Nomination[] => {
    initializeDefaultData()
    const nominations = getFromStorage(STORAGE_KEYS.NOMINATIONS, [])
    const persons = getFromStorage(STORAGE_KEYS.PERSONS, [])
    
    return nominations.map(nomination => ({
      ...nomination,
      person: persons.find(p => p.id === nomination.person_id)
    }))
  },
  
  create: (nomination: Omit<Nomination, 'id' | 'created_at' | 'updated_at'>): Nomination => {
    const newNomination: Nomination = {
      ...nomination,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const nominations = getFromStorage(STORAGE_KEYS.NOMINATIONS, [])
    nominations.push(newNomination)
    saveToStorage(STORAGE_KEYS.NOMINATIONS, nominations)
    return newNomination
  },
  
  update: (id: string, updates: Partial<Nomination>): Nomination | null => {
    const nominations = getFromStorage(STORAGE_KEYS.NOMINATIONS, [])
    const index = nominations.findIndex(n => n.id === id)
    if (index === -1) return null
    
    nominations[index] = {
      ...nominations[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    saveToStorage(STORAGE_KEYS.NOMINATIONS, nominations)
    return nominations[index]
  }
}

// API simulada para votos
export const votesApi = {
  getAll: (): Vote[] => {
    initializeDefaultData()
    return getFromStorage(STORAGE_KEYS.VOTES, [])
  },
  
  getByNomination: (nominationId: string): Vote[] => {
    const votes = getFromStorage(STORAGE_KEYS.VOTES, [])
    return votes.filter(v => v.nomination_id === nominationId)
  },
  
  create: (vote: Omit<Vote, 'id' | 'created_at'>): Vote => {
    const newVote: Vote = {
      ...vote,
      id: generateId(),
      created_at: new Date().toISOString()
    }
    const votes = getFromStorage(STORAGE_KEYS.VOTES, [])
    votes.push(newVote)
    saveToStorage(STORAGE_KEYS.VOTES, votes)
    return newVote
  }
}

// API simulada para administradores
export const adminsApi = {
  authenticate: (username: string, password: string): Admin | null => {
    initializeDefaultData()
    const admins = getFromStorage(STORAGE_KEYS.ADMINS, [])
    return admins.find(admin => admin.username === username && admin.password === password) || null
  }
}

// Inicializar datos por defecto al cargar el módulo
if (typeof window !== 'undefined') {
  initializeDefaultData()
}
