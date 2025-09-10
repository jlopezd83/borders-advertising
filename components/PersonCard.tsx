'use client'

import { Person } from '@/lib/localStorage'
import { Award, Star, Clock } from 'lucide-react'

interface PersonCardProps {
  person: Person
  onNominate: () => void
  canNominate: boolean
  pendingNomination: boolean
}

export default function PersonCard({ 
  person, 
  onNominate, 
  canNominate, 
  pendingNomination 
}: PersonCardProps) {
  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Award className="text-primary-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{person.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Star className="text-yellow-500" size={16} />
              <span>{person.points} puntos</span>
            </div>
          </div>
        </div>
      </div>

      {person.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">{person.description}</p>
      )}

      <div className="flex items-center justify-between">
        {pendingNomination ? (
          <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            <Clock size={16} />
            <span className="text-sm font-medium">Nominación pendiente</span>
          </div>
        ) : (
          <button
            onClick={onNominate}
            disabled={!canNominate}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
              canNominate
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canNominate ? 'Nominar' : 'No disponible'}
          </button>
        )}
      </div>
    </div>
  )
}
