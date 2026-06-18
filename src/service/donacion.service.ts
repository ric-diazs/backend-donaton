import { donacionRepository } from '@/src/repository/donacion.repository'
import { necesidadRepository } from '@/src/repository/necesidad.repository'
import { EstadoDonacion } from '@prisma/client'

// Mapa de transiciones válidas: de qué estado a cuáles se puede avanzar
const transicionesValidas: Record<EstadoDonacion, EstadoDonacion[]> = {
  PENDIENTE: ['RECIBIDA'],
  RECIBIDA: ['DISPONIBLE'],
  DISPONIBLE: ['ASIGNADA'],
  ASIGNADA: ['EN_TRANSITO'],
  EN_TRANSITO: ['ENTREGADA'],
  ENTREGADA: [],
}

export const donacionService = {
  // Crear una donación nueva (la registra el donante)
  async crear(data: {
    tipo: string
    cantidad: number
    unidad: string
    origen: string
    donanteNombre?: string
    donanteCorreo?: string
  }) {
    if (!data.tipo || !data.cantidad || !data.unidad || !data.origen) {
      throw new Error('Faltan campos obligatorios: tipo, cantidad, unidad, origen')
    }
    return donacionRepository.crear(data)
  },

  // Listar todas las donaciones (lo usa el coordinador)
  listarTodas() {
    return donacionRepository.listarTodas()
  },

  // Cambiar el estado de una donación, validando la transición
  async cambiarEstado(
    id: number,
    nuevoEstado: EstadoDonacion,
    necesidadId?: number
  ) {
    const donacionActual = await donacionRepository.buscarPorId(id)

    if (!donacionActual) {
      throw new Error('NOT_FOUND')
    }

    const siguientesPermitidos = transicionesValidas[donacionActual.estado] ?? []
    if (!siguientesPermitidos.includes(nuevoEstado)) {
      throw new Error(
        `No se puede pasar de ${donacionActual.estado} a ${nuevoEstado}`
      )
    }

    const data: Record<string, unknown> = { estado: nuevoEstado }

    
    if (nuevoEstado === 'RECIBIDA') {
    const año = new Date().getFullYear()
    const numeroFormateado = String(donacionActual.id).padStart(4, '0')
    data.ot = `OT-${año}-${numeroFormateado}`
    }

    // Regla: al ASIGNAR, se requiere una necesidad y se actualiza su cobertura
    if (nuevoEstado === 'ASIGNADA') {
      if (!necesidadId) {
        throw new Error('Para asignar se requiere necesidadId')
      }
      data.necesidadId = necesidadId

      const necesidad = await necesidadRepository.buscarPorId(necesidadId)
      if (necesidad) {
        const nuevaCobertura = necesidad.cantCubierta + donacionActual.cantidad
        await necesidadRepository.actualizarCobertura(
          necesidad.id,
          nuevaCobertura,
          nuevaCobertura >= necesidad.cantRequerida ? 'CUBIERTA' : necesidad.estado
        )
      }
    }

    return donacionRepository.actualizar(id, data)
  },
}