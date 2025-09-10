'use client'

import { useState, useEffect } from 'react'
import { Person, Nomination, Vote, personsApi, nominationsApi, votesApi, adminsApi } from '@/lib/localStorage'
import { X } from 'lucide-react'
import PersonCard from '@/components/PersonCard'
import NominationModal from '@/components/NominationModal'
import AdminLogin from '@/components/AdminLogin'
import AdminPanel from '@/components/AdminPanel'
import VotingSystem from '@/components/VotingSystem'

export default function Home() {
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
              Sistema de Nominaciones
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
          <AdminPanel
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
        <AdminLogin
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {showNominationModal && selectedPerson && (
        <NominationModal
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

              <VotingSystem
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
