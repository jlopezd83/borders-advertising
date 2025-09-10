'use client'

import { useState, useEffect } from 'react'
import { Person, Nomination, Vote } from '@/lib/localStorage'
import { personsApi, nominationsApi, votesApi } from '@/lib/localStorage'
import { Plus, Users, Award, CheckCircle, XCircle, Clock, X, ThumbsUp, ThumbsDown, Minus } from 'lucide-react'

interface AdminPanelProps {
  persons: Person[]
  nominations: Nomination[]
  onRefresh: () => void
}

export default function AdminPanel({ persons, nominations, onRefresh }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'persons' | 'nominations'>('persons')
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [newPerson, setNewPerson] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [votes, setVotes] = useState<Vote[]>([])

  useEffect(() => {
    fetchVotes()
  }, [nominations])

  const fetchVotes = async () => {
    try {
      const allVotes = votesApi.getAll()
      setVotes(allVotes)
    } catch (error) {
      console.error('Error fetching votes:', error)
    }
  }

  const getVotesForNomination = (nominationId: string) => {
    return votes.filter(vote => vote.nomination_id === nominationId)
  }

  const getVoteCounts = (nominationId: string) => {
    const nominationVotes = getVotesForNomination(nominationId)
    const forVotes = nominationVotes.filter(v => v.vote_type === 'for').length
    const againstVotes = nominationVotes.filter(v => v.vote_type === 'against').length
    const abstainVotes = nominationVotes.filter(v => v.vote_type === 'abstain').length
    const totalVotes = nominationVotes.length

    return { forVotes, againstVotes, abstainVotes, totalVotes }
  }

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
        <h2 className="text-3xl font-bold text-gray-900">Panel de Administración</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('persons')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'persons'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Users className="inline mr-2" size={20} />
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
            <Award className="inline mr-2" size={20} />
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
              <Plus size={20} />
              <span>Agregar Persona</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {persons.map((person) => (
              <div key={person.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{person.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Award className="text-yellow-500" size={16} />
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
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="text-amber-500 mr-2" size={20} />
              Pendientes ({pendingNominations.length})
            </h4>
            <div className="space-y-4">
              {pendingNominations.map((nomination) => {
                const { forVotes, againstVotes, abstainVotes, totalVotes } = getVoteCounts(nomination.id)
                const nominationVotes = getVotesForNomination(nomination.id)
                
                return (
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
                    
                    {/* Vote Counts */}
                    <div className="mb-4 p-3 bg-white rounded-lg border">
                      <h6 className="text-sm font-medium text-gray-700 mb-2">Resultados de Votación ({totalVotes} votos)</h6>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                            <ThumbsUp size={14} />
                            <span className="font-semibold text-sm">{forVotes}</span>
                          </div>
                          <p className="text-xs text-green-600">A favor</p>
                        </div>
                        
                        <div className="text-center p-2 bg-red-50 rounded">
                          <div className="flex items-center justify-center space-x-1 text-red-600 mb-1">
                            <ThumbsDown size={14} />
                            <span className="font-semibold text-sm">{againstVotes}</span>
                          </div>
                          <p className="text-xs text-red-600">En contra</p>
                        </div>
                        
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                            <Minus size={14} />
                            <span className="font-semibold text-sm">{abstainVotes}</span>
                          </div>
                          <p className="text-xs text-gray-600">Abstención</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Votes */}
                    {nominationVotes.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Votos Recientes</h6>
                        <div className="space-y-1 max-h-20 overflow-y-auto">
                          {nominationVotes.slice(0, 3).map((vote) => (
                            <div key={vote.id} className="flex items-center justify-between text-xs bg-white px-2 py-1 rounded">
                              <span className="text-gray-600">{vote.voter_name}</span>
                              <span className={`px-2 py-1 rounded font-medium ${
                                vote.vote_type === 'for' ? 'bg-green-100 text-green-700' :
                                vote.vote_type === 'against' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {vote.vote_type === 'for' ? 'A favor' :
                                 vote.vote_type === 'against' ? 'En contra' : 'Abstención'}
                              </span>
                            </div>
                          ))}
                          {nominationVotes.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{nominationVotes.length - 3} votos más
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleNominationStatus(nomination.id, 'approved')}
                        className="btn-success flex items-center space-x-1"
                      >
                        <CheckCircle size={16} />
                        <span>Aprobar</span>
                      </button>
                      <button
                        onClick={() => handleNominationStatus(nomination.id, 'rejected')}
                        className="btn-danger flex items-center space-x-1"
                      >
                        <XCircle size={16} />
                        <span>Rechazar</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Approved Nominations */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="text-green-500 mr-2" size={20} />
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
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <XCircle className="text-red-500 mr-2" size={20} />
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
