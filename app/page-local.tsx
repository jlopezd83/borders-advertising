'use client'

import { useState, useEffect } from 'react'
import { Person, Nomination, Vote, personsApi, nominationsApi, votesApi, adminsApi } from '@/lib/localStorage'
import { X } from 'lucide-react'
import PersonCard from '@/components/PersonCard'
import NominationModal from '@/components/NominationModal'
import AdminLogin from '@/components/AdminLogin'
import AdminPanel from '@/components/AdminPanel'
import VotingSystem from '@/components/VotingSystem'

export default function HomeLocal() {
  const [persons, setPersons] = useState<Person[]>([])
  const [nominations, setNominations] = useState<Nomination[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showNominationModal, setShowNominationModal] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [showVotingModal, setShowVotingModal] = useState(false)
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminStatus()
    fetchPersons()
    fetchNominations()
  }, [])

  const checkAdminStatus = () => {
    const adminStatus = localStorage.getItem('isAdmin')
    setIsAdmin(adminStatus === 'true')
  }

  const fetchPersons = async () => {
    try {
      const data = personsApi.getAll()
      setPersons(data.sort((a, b) => b.points - a.points))
    } catch (error) {
      console.error('Error fetching persons:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNominations = async () => {
    try {
      const data = nominationsApi.getAll()
      setNominations(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
    } catch (error) {
      console.error('Error fetching nominations:', error)
    }
  }

  const handleNominate = (person: Person) => {
    setSelectedPerson(person)
    setShowNominationModal(true)
  }

  const handleVote = (nomination: Nomination) => {
    setSelectedNomination(nomination)
    setShowVotingModal(true)
  }

  const handleLoginSuccess = () => {
    setIsAdmin(true)
    setShowLogin(false)
    localStorage.setItem('isAdmin', 'true')
  }

  const handleLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('isAdmin')
  }

  const refreshData = () => {
    fetchPersons()
    fetchNominations()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Sistema de Nominaciones (Local)
            </h1>
            <div className="flex space-x-4">
              {!isAdmin ? (
                <button
                  onClick={() => setShowLogin(true)}
                  className="btn-primary"
                >
                  Admin
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="btn-secondary"
                  >
                    Panel Admin
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn-danger"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin ? (
          <AdminPanelLocal
            persons={persons}
            nominations={nominations}
            onRefresh={refreshData}
          />
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Lista de Personas
              </h2>
              <p className="text-gray-600">
                Selecciona una persona para nominarla y explicar por qué merece el reconocimiento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {persons.map((person) => {
                const hasPendingNomination = nominations.some(
                  n => n.person_id === person.id && n.status === 'pending'
                )
                
                return (
                  <PersonCard
                    key={person.id}
                    person={person}
                    onNominate={() => handleNominate(person)}
                    canNominate={!hasPendingNomination}
                    pendingNomination={hasPendingNomination}
                  />
                )
              })}
            </div>

            {/* Nominaciones Pendientes para Votar */}
            {nominations.filter(n => n.status === 'pending').length > 0 && (
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Nominaciones Pendientes
                </h2>
                <p className="text-gray-600 mb-6">
                  Vota por las nominaciones pendientes. Tu opinión es importante.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nominations
                    .filter(n => n.status === 'pending')
                    .map((nomination) => (
                      <div key={nomination.id} className="card border-amber-200 bg-amber-50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Nominación para: {nomination.person?.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Por: {nomination.nominator_name}
                            </p>
                          </div>
                          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                            {new Date(nomination.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{nomination.reason}</p>
                        
                        <button
                          onClick={() => handleVote(nomination)}
                          className="btn-primary w-full"
                        >
                          Votar por esta nominación
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showLogin && (
        <AdminLoginLocal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {showNominationModal && selectedPerson && (
        <NominationModalLocal
          person={selectedPerson}
          onClose={() => {
            setShowNominationModal(false)
            setSelectedPerson(null)
          }}
          onSuccess={() => {
            setShowNominationModal(false)
            setSelectedPerson(null)
            refreshData()
          }}
        />
      )}

      {showVotingModal && selectedNomination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Votar por Nominación
              </h2>
              <button
                onClick={() => {
                  setShowVotingModal(false)
                  setSelectedNomination(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-primary-900 mb-2">
                  Nominación para: {selectedNomination.person?.name}
                </h3>
                <p className="text-primary-700 mb-2">
                  <strong>Por:</strong> {selectedNomination.nominator_name}
                </p>
                <p className="text-primary-700">
                  <strong>Razón:</strong> {selectedNomination.reason}
                </p>
              </div>

              <VotingSystemLocal
                nomination={selectedNomination}
                onVoteSubmitted={() => {
                  setShowVotingModal(false)
                  setSelectedNomination(null)
                  refreshData()
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente de login local
function AdminLoginLocal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const admin = adminsApi.authenticate(username, password)
      if (admin) {
        onSuccess()
      } else {
        setError('Credenciales incorrectas')
      }
    } catch (err) {
      setError('Error al verificar credenciales')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión Admin</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </div>
        </form>

        <div className="px-6 pb-6">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
            <strong>Credenciales de prueba:</strong><br />
            Usuario: admin<br />
            Contraseña: admin123
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de nominación local
function NominationModalLocal({ person, onClose, onSuccess }: { person: Person, onClose: () => void, onSuccess: () => void }) {
  const [nominatorName, setNominatorName] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nominatorName.trim() || !reason.trim()) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      nominationsApi.create({
        person_id: person.id,
        nominator_name: nominatorName.trim(),
        reason: reason.trim(),
        status: 'pending'
      })

      onSuccess()
    } catch (err) {
      setError('Error al crear la nominación. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Nominar a {person.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900 mb-2">Información de la persona</h3>
              <p className="text-primary-700">
                <strong>Nombre:</strong> {person.name}
              </p>
              {person.description && (
                <p className="text-primary-700 mt-1">
                  <strong>Descripción:</strong> {person.description}
                </p>
              )}
              <p className="text-primary-700 mt-1">
                <strong>Puntos actuales:</strong> {person.points}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu nombre *
              </label>
              <input
                type="text"
                value={nominatorName}
                onChange={(e) => setNominatorName(e.target.value)}
                className="input-field"
                placeholder="Ingresa tu nombre completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón de la nominación *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-field min-h-[120px] resize-none"
                placeholder="Explica detalladamente por qué merece ser nominado/a. Sé específico y menciona logros, cualidades o contribuciones destacadas."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Mínimo 20 caracteres. Máximo 500 caracteres.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
              <p className="text-sm">
                <strong>Importante:</strong> Una vez enviada la nominación, otros usuarios podrán votar a favor, en contra o abstenerse. 
                El administrador revisará y validará la nominación antes de que se otorguen los puntos.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || nominatorName.trim().length < 2 || reason.trim().length < 20}
                className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Nominación</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Componente de votación local
function VotingSystemLocal({ nomination, onVoteSubmitted }: { nomination: Nomination, onVoteSubmitted: () => void }) {
  const [voterName, setVoterName] = useState('')
  const [selectedVote, setSelectedVote] = useState<'for' | 'against' | 'abstain' | null>(null)
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    const nominationVotes = votesApi.getByNomination(nomination.id)
    setVotes(nominationVotes)
  }, [nomination.id])

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!voterName.trim() || !selectedVote) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      votesApi.create({
        nomination_id: nomination.id,
        voter_name: voterName.trim(),
        vote_type: selectedVote
      })

      setHasVoted(true)
      const nominationVotes = votesApi.getByNomination(nomination.id)
      setVotes(nominationVotes)
      onVoteSubmitted()
    } catch (err) {
      setError('Error al registrar el voto. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const getVoteCounts = () => {
    const forVotes = votes.filter(v => v.vote_type === 'for').length
    const againstVotes = votes.filter(v => v.vote_type === 'against').length
    const abstainVotes = votes.filter(v => v.vote_type === 'abstain').length
    const totalVotes = votes.length

    return { forVotes, againstVotes, abstainVotes, totalVotes }
  }

  const { forVotes, againstVotes, abstainVotes, totalVotes } = getVoteCounts()

  if (hasVoted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-green-700">
          <span className="font-medium">¡Voto registrado exitosamente!</span>
        </div>
        <p className="text-green-600 text-sm mt-1">
          Gracias por participar en la votación.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Vote Counts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
            <span className="font-semibold">{forVotes}</span>
          </div>
          <p className="text-xs text-green-600">A favor</p>
        </div>
        
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 text-red-600 mb-1">
            <span className="font-semibold">{againstVotes}</span>
          </div>
          <p className="text-xs text-red-600">En contra</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
            <span className="font-semibold">{abstainVotes}</span>
          </div>
          <p className="text-xs text-gray-600">Abstención</p>
        </div>
      </div>

      {/* Voting Form */}
      <form onSubmit={handleVote} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu nombre *
          </label>
          <input
            type="text"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            className="input-field"
            placeholder="Ingresa tu nombre"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tu voto *
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedVote('for')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedVote === 'for'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-green-300 text-gray-700'
              }`}
            >
              <span className="text-sm font-medium">A favor</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedVote('against')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedVote === 'against'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-red-300 text-gray-700'
              }`}
            >
              <span className="text-sm font-medium">En contra</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedVote('abstain')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedVote === 'abstain'
                  ? 'border-gray-500 bg-gray-50 text-gray-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span className="text-sm font-medium">Abstención</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !voterName.trim() || !selectedVote}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Registrando voto...' : 'Registrar Voto'}
        </button>
      </form>

      {/* Recent Votes */}
      {votes.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Votos recientes ({totalVotes})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {votes.slice(0, 5).map((vote) => (
              <div key={vote.id} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded">
                <span className="text-gray-700">{vote.voter_name}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  vote.vote_type === 'for' ? 'bg-green-100 text-green-700' :
                  vote.vote_type === 'against' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {vote.vote_type === 'for' ? 'A favor' :
                   vote.vote_type === 'against' ? 'En contra' : 'Abstención'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Componente de panel de administración local
function AdminPanelLocal({ persons, nominations, onRefresh }: { persons: Person[], nominations: Nomination[], onRefresh: () => void }) {
  const [activeTab, setActiveTab] = useState<'persons' | 'nominations'>('persons')
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [newPerson, setNewPerson] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPerson.name.trim()) {
      setError('El nombre es requerido')
      return
    }

    setLoading(true)
    setError('')

    try {
      personsApi.create({
        name: newPerson.name.trim(),
        description: newPerson.description.trim() || undefined,
        points: 0
      })

      setNewPerson({ name: '', description: '' })
      setShowAddPerson(false)
      onRefresh()
    } catch (err) {
      setError('Error al agregar la persona')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePerson = async (id: string, updates: Partial<Person>) => {
    try {
      personsApi.update(id, updates)
      onRefresh()
    } catch (err) {
      setError('Error al actualizar la persona')
    }
  }

  const handleDeletePerson = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta persona?')) return

    try {
      personsApi.delete(id)
      onRefresh()
    } catch (err) {
      setError('Error al eliminar la persona')
    }
  }

  const handleNominationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      nominationsApi.update(id, { status })
      
      // Si se aprueba, incrementar puntos de la persona
      if (status === 'approved') {
        const nomination = nominations.find(n => n.id === id)
        if (nomination) {
          const person = persons.find(p => p.id === nomination.person_id)
          if (person) {
            personsApi.update(nomination.person_id, { points: person.points + 1 })
          }
        }
      }

      onRefresh()
    } catch (err) {
      setError('Error al actualizar la nominación')
    }
  }

  const pendingNominations = nominations.filter(n => n.status === 'pending')
  const approvedNominations = nominations.filter(n => n.status === 'approved')
  const rejectedNominations = nominations.filter(n => n.status === 'rejected')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Panel de Administración (Local)</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('persons')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'persons'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Personas ({persons.length})
          </button>
          <button
            onClick={() => setActiveTab('nominations')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'nominations'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Nominaciones ({nominations.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'persons' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Gestión de Personas</h3>
            <button
              onClick={() => setShowAddPerson(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Agregar Persona</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {persons.map((person) => (
              <div key={person.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{person.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{person.points} pts</span>
                  </div>
                </div>
                
                {person.description && (
                  <p className="text-gray-600 mb-4">{person.description}</p>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdatePerson(person.id, { points: person.points + 1 })}
                    className="flex-1 btn-success text-sm"
                  >
                    +1 Punto
                  </button>
                  <button
                    onClick={() => handleDeletePerson(person.id)}
                    className="btn-danger text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Nominaciones</h3>

          {/* Pending Nominations */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Pendientes ({pendingNominations.length})
            </h4>
            <div className="space-y-4">
              {pendingNominations.map((nomination) => (
                <div key={nomination.id} className="card border-amber-200 bg-amber-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Nominación para: {nomination.person?.name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        Por: {nomination.nominator_name}
                      </p>
                    </div>
                    <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                      {new Date(nomination.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{nomination.reason}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleNominationStatus(nomination.id, 'approved')}
                      className="btn-success"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleNominationStatus(nomination.id, 'rejected')}
                      className="btn-danger"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approved Nominations */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Aprobadas ({approvedNominations.length})
            </h4>
            <div className="space-y-4">
              {approvedNominations.map((nomination) => (
                <div key={nomination.id} className="card border-green-200 bg-green-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        {nomination.person?.name} (+1 punto)
                      </h5>
                      <p className="text-sm text-gray-600">
                        Por: {nomination.nominator_name}
                      </p>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      {new Date(nomination.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{nomination.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rejected Nominations */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Rechazadas ({rejectedNominations.length})
            </h4>
            <div className="space-y-4">
              {rejectedNominations.map((nomination) => (
                <div key={nomination.id} className="card border-red-200 bg-red-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        {nomination.person?.name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        Por: {nomination.nominator_name}
                      </p>
                    </div>
                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                      {new Date(nomination.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{nomination.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Person Modal */}
      {showAddPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Agregar Persona</h3>
              <button
                onClick={() => setShowAddPerson(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddPerson} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={newPerson.name}
                    onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                    className="input-field"
                    placeholder="Nombre completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newPerson.description}
                    onChange={(e) => setNewPerson({ ...newPerson, description: e.target.value })}
                    className="input-field min-h-[100px] resize-none"
                    placeholder="Descripción opcional"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPerson(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Agregando...' : 'Agregar'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
