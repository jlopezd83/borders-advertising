'use client'

import { useState, useEffect } from 'react'
import { Nomination, Vote } from '@/lib/localStorage'
import { votesApi } from '@/lib/localStorage'
import { ThumbsUp, ThumbsDown, Minus, User, MessageCircle } from 'lucide-react'

interface VotingSystemProps {
  nomination: Nomination
  onVoteSubmitted: () => void
}

export default function VotingSystem({ nomination, onVoteSubmitted }: VotingSystemProps) {
  const [voterName, setVoterName] = useState('')
  const [selectedVote, setSelectedVote] = useState<'for' | 'against' | 'abstain' | null>(null)
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    fetchVotes()
  }, [nomination.id])

  const fetchVotes = async () => {
    try {
      const data = votesApi.getByNomination(nomination.id)
      setVotes(data)
    } catch (err) {
      console.error('Error fetching votes:', err)
    }
  }

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
      fetchVotes()
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
          <ThumbsUp size={20} />
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
            <ThumbsUp size={16} />
            <span className="font-semibold">{forVotes}</span>
          </div>
          <p className="text-xs text-green-600">A favor</p>
        </div>
        
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 text-red-600 mb-1">
            <ThumbsDown size={16} />
            <span className="font-semibold">{againstVotes}</span>
          </div>
          <p className="text-xs text-red-600">En contra</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
            <Minus size={16} />
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
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              className="input-field pl-10"
              placeholder="Ingresa tu nombre"
              required
            />
          </div>
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
              <ThumbsUp className="mx-auto mb-1" size={20} />
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
              <ThumbsDown className="mx-auto mb-1" size={20} />
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
              <Minus className="mx-auto mb-1" size={20} />
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
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <MessageCircle className="mr-2" size={16} />
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
