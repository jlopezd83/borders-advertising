'use client'

import { Person } from '@/lib/supabase'
import { Award, Star, Clock } from 'lucide-react'

interface PersonCardProps {
  person: Person
  onNominate: () => void
  onPointsClick: () => void
  canNominate: boolean
  pendingNomination: boolean
}

export default function PersonCard({ 
  person, 
  onNominate, 
  onPointsClick,
  canNominate, 
  pendingNomination 
}: PersonCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Award className="text-primary-600" size={20} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{person.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Star className="text-yellow-500" size={14} />
              <button
                onClick={onPointsClick}
                className="text-primary-600 hover:text-primary-700 font-semibold underline cursor-pointer transition-colors"
              >
                {person.points} pts
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-3">
          {pendingNomination ? (
            <div className="flex items-center space-x-1 text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs">
              <Clock size={12} />
              <span className="font-medium">Pendiente</span>
            </div>
          ) : (
            <button
              onClick={onNominate}
              disabled={!canNominate}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors duration-200 ${
                canNominate
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canNominate ? 'Nominar' : 'No disp.'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
