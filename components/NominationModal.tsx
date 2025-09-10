'use client'

import { useState } from 'react'
import { X, Send } from 'lucide-react'
import { Person } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

interface NominationModalProps {
  person: Person
  onClose: () => void
  onSuccess: () => void
}

export default function NominationModal({ person, onClose, onSuccess }: NominationModalProps) {
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
      const { error } = await supabase
        .from('nominations')
        .insert({
          person_id: person.id,
          nominator_name: nominatorName.trim(),
          reason: reason.trim(),
          status: 'pending'
        })

      if (error) throw error

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
                    <Send size={16} />
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
