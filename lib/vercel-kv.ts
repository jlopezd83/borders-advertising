// Sistema de almacenamiento usando Vercel KV (Redis)
// Los datos se comparten entre todos los usuarios

import { kv } from '@vercel/kv'

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

// Claves para Vercel KV
const KV_KEYS = {
  PERSONS: 'borders_persons',
  NOMINATIONS: 'borders_nominations',
  VOTES: 'borders_votes',
  ADMINS: 'borders_admins'
}

// Función para generar IDs únicos
const generateId = () => Math.random().toString(36).substr(2, 9)

// Función para obtener datos del KV
const getFromKV = async <T>(key: string, defaultValue: T[]): Promise<T[]> => {
  try {
    const data = await kv.get<T[]>(key)
    return data || defaultValue
  } catch (error) {
    console.error('Error getting from KV:', error)
    return defaultValue
  }
}

// Función para guardar datos en KV
const saveToKV = async <T>(key: string, data: T[]): Promise<void> => {
  try {
    await kv.set(key, data)
  } catch (error) {
    console.error('Error saving to KV:', error)
  }
}

// Inicializar datos por defecto si no existen
const initializeDefaultData = async () => {
  const persons = await getFromKV(KV_KEYS.PERSONS, [])
  const admins = await getFromKV(KV_KEYS.ADMINS, [])
  
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
    await saveToKV(KV_KEYS.PERSONS, defaultPersons)
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
    await saveToKV(KV_KEYS.ADMINS, defaultAdmins)
  }
}

// API para personas
export const personsApi = {
  getAll: async (): Promise<Person[]> => {
    await initializeDefaultData()
    return await getFromKV(KV_KEYS.PERSONS, [])
  },
  
  create: async (person: Omit<Person, 'id' | 'created_at' | 'updated_at'>): Promise<Person> => {
    const newPerson: Person = {
      ...person,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const persons = await getFromKV(KV_KEYS.PERSONS, [])
    persons.push(newPerson)
    await saveToKV(KV_KEYS.PERSONS, persons)
    return newPerson
  },
  
  update: async (id: string, updates: Partial<Person>): Promise<Person | null> => {
    const persons = await getFromKV(KV_KEYS.PERSONS, [])
    const index = persons.findIndex(p => p.id === id)
    if (index === -1) return null
    
    persons[index] = {
      ...persons[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    await saveToKV(KV_KEYS.PERSONS, persons)
    return persons[index]
  },
  
  delete: async (id: string): Promise<boolean> => {
    const persons = await getFromKV(KV_KEYS.PERSONS, [])
    const filtered = persons.filter(p => p.id !== id)
    if (filtered.length === persons.length) return false
    
    await saveToKV(KV_KEYS.PERSONS, filtered)
    return true
  }
}

// API para nominaciones
export const nominationsApi = {
  getAll: async (): Promise<Nomination[]> => {
    await initializeDefaultData()
    const nominations = await getFromKV(KV_KEYS.NOMINATIONS, [])
    const persons = await getFromKV(KV_KEYS.PERSONS, [])
    
    return nominations.map(nomination => ({
      ...nomination,
      person: persons.find(p => p.id === nomination.person_id)
    }))
  },
  
  create: async (nomination: Omit<Nomination, 'id' | 'created_at' | 'updated_at'>): Promise<Nomination> => {
    const newNomination: Nomination = {
      ...nomination,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const nominations = await getFromKV(KV_KEYS.NOMINATIONS, [])
    nominations.push(newNomination)
    await saveToKV(KV_KEYS.NOMINATIONS, nominations)
    return newNomination
  },
  
  update: async (id: string, updates: Partial<Nomination>): Promise<Nomination | null> => {
    const nominations = await getFromKV(KV_KEYS.NOMINATIONS, [])
    const index = nominations.findIndex(n => n.id === id)
    if (index === -1) return null
    
    nominations[index] = {
      ...nominations[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    await saveToKV(KV_KEYS.NOMINATIONS, nominations)
    return nominations[index]
  }
}

// API para votos
export const votesApi = {
  getAll: async (): Promise<Vote[]> => {
    await initializeDefaultData()
    return await getFromKV(KV_KEYS.VOTES, [])
  },
  
  getByNomination: async (nominationId: string): Promise<Vote[]> => {
    const votes = await getFromKV(KV_KEYS.VOTES, [])
    return votes.filter(v => v.nomination_id === nominationId)
  },
  
  create: async (vote: Omit<Vote, 'id' | 'created_at'>): Promise<Vote> => {
    const newVote: Vote = {
      ...vote,
      id: generateId(),
      created_at: new Date().toISOString()
    }
    const votes = await getFromKV(KV_KEYS.VOTES, [])
    votes.push(newVote)
    await saveToKV(KV_KEYS.VOTES, votes)
    return newVote
  }
}

// API para administradores
export const adminsApi = {
  authenticate: async (username: string, password: string): Promise<Admin | null> => {
    await initializeDefaultData()
    const admins = await getFromKV(KV_KEYS.ADMINS, [])
    return admins.find(admin => admin.username === username && admin.password === password) || null
  }
}
