'use client'

import { useState, useEffect } from 'react'
import { supabase, Person } from '@/lib/supabase'
import { X, Trash2 } from 'lucide-react'

interface PointReason {
  id: string
  person_id: string
  points_added: number
  reason: string
  added_by: string
  nomination_id: string | null
  created_at: string
}

interface AdminPointsModalProps {
  person: Person
  onClose: () => void
  onRefresh: () => void
}

export default function AdminPointsModal({ person, onClose, onRefresh }: AdminPointsModalProps) {
  const [pointReasons, setPointReasons] = useState<PointReason[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPointReasons()
  }, [person.id])

  const fetchPointReasons = async () => {
    try {
      const { data, error } = await supabase
        .from('point_reasons')
        .select('*')
        .eq('person_id', person.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPointReasons(data || [])
    } catch (error) {
      console.error('Error fetching point reasons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePoint = async (pointId: string, pointsToRemove: number) => {
    const reason = prompt('¿Por qué razón se elimina este punto? (Obligatorio)')
    if (!reason || !reason.trim()) {
      alert('Debes proporcionar una razón para eliminar el punto')
      return
    }

    try {
      // Eliminar el registro de point_reasons
      const { error: deleteError } = await supabase
        .from('point_reasons')
        .delete()
        .eq('id', pointId)

      if (deleteError) throw deleteError

      // Actualizar los puntos de la persona
      const { error: updateError } = await supabase
        .from('persons')
        .update({ points: person.points - pointsToRemove })
        .eq('id', person.id)

      if (updateError) throw updateError

      // Registrar la eliminación
      const { error: reasonError } = await supabase
        .from('point_reasons')
        .insert({
          person_id: person.id,
          points_added: -pointsToRemove,
          reason: reason.trim(),
          added_by: 'admin'
        })

      if (reasonError) throw reasonError

      // Actualizar la lista
      await fetchPointReasons()
      onRefresh()
      alert('Punto eliminado correctamente.')
    } catch (error) {
      console.error('Error deleting point:', error)
      alert('Error al eliminar el punto.')
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando puntos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Puntos de {person.name} ({person.points} total)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {pointReasons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay puntos registrados para esta persona.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pointReasons.map((point) => (
              <div
                key={point.id}
                className={`p-4 rounded-lg border ${
                  point.points_added > 0 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          point.points_added > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {point.points_added > 0 ? `+${point.points_added}` : point.points_added}
                      </span>
                      <span className="text-sm text-gray-500">
                        por {point.added_by}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(point.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700">{point.reason}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePoint(point.id, Math.abs(point.points_added))}
                    className="ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Eliminar este punto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
