import { necesidadRepository } from '@/src/repository/necesidad.repository'
import { EstadoNecesidad } from '@prisma/client'

export const necesidadService = {
  listarTodas() {
    return necesidadRepository.listarTodas()
  },

  crear(data: {
  categoria: string
  prioridad: string
  comunaId: number
  cantRequerida: number
  usuarioId: number  
}) {
  if (!data.categoria || !data.prioridad || !data.comunaId || !data.cantRequerida || !data.usuarioId) {
    throw new Error('Faltan campos obligatorios: categoria, prioridad, comunaId, cantRequerida, usuarioId')
  }
  return necesidadRepository.crear(data)
},

  async actualizarCobertura(id: number, cantCubierta: number) {
    const necesidad = await necesidadRepository.buscarPorId(id)
    if (!necesidad) throw new Error('NOT_FOUND')

    const nuevoEstado: EstadoNecesidad =
      cantCubierta >= necesidad.cantRequerida ? 'CUBIERTA' : necesidad.estado

    return necesidadRepository.actualizarCobertura(id, cantCubierta, nuevoEstado)
  },
}