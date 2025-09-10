'use client'

import { useState, useEffect } from 'react'
import { X, Star, Calendar, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PointReason {
  id: string
  points_added: number
  reason: string
  added_by: string
  created_at: string
  nomination?: {
    nominator_name: string
  }
}

interface PointsReasonsModalProps {
  person: {
    id: string
    name: string
    points: number
  }
  onClose: () => void
}

export default function PointsReasonsModal({ person, onClose }: PointsReasonsModalProps) {
  const [reasons, setReasons] = useState<PointReason[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReasons()
  }, [person.id])

  const fetchReasons = async () => {
    try {
      const { data, error } = await supabase
        .from('point_reasons')
        .select(`
          *,
          nomination:nominations(nominator_name)
        `)
        .eq('person_id', person.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReasons(data || [])
    } catch (err) {
      setError('Error al cargar las razones de los puntos')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAddedByText = (reason: PointReason) => {
    if (reason.added_by === 'admin') {
      return 'Administrador'
    } else if (reason.nomination) {
      return `Nominación por: ${reason.nomination.nominator_name}`
    }
    return 'Sistema'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Star className="text-primary-600" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Razones de los Puntos
              </h2>
              <p className="text-gray-600">{person.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : reasons.length === 0 ? (
            <div className="text-center py-8">
              <Star className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No hay puntos registrados para esta persona</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-primary-900">Total de Puntos</h3>
                  <span className="text-2xl font-bold text-primary-600">{person.points}</span>
                </div>
              </div>

              <div className="space-y-3">
                {reasons.map((reason, index) => (
                  <div key={reason.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-sm font-medium">
                          +{reason.points_added} punto{reason.points_added > 1 ? 's' : ''}
                        </span>
                        <span className="text-sm text-gray-500">#{reasons.length - index}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{formatDate(reason.created_at)}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{reason.reason}</p>
                    
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <User size={14} />
                      <span>{getAddedByText(reason)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
