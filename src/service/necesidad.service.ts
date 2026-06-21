import { necesidadRepository } from '@/src/repository/necesidad.repository'
import { EstadoNecesidad } from '@prisma/client'

/**
 * Capa service que maneja las reglas de negocio para operaciones relacionadas con `necesidad`
 * validando inputs y orquestando la capa repository.
 */

export const necesidadService = {
  listarTodas() {
   /**
   * Lista todas las necesidades.
   *
   * @returns Regresa una lista con todas las necesidades registradas o una lista vacia ([]) si no hay registros.
   */
    return necesidadRepository.listarTodas()
  },

  crear(data: {
  categoria: string
  prioridad: string
  comunaId: number
  cantRequerida: number
  usuarioId: number  
}) {
  /**
  * Crea una necesidad nueva luego de validar que existan todos los campos requeridos.
  *
  * Regla de negocio:
  * - Los campos de datos obligatorios no deben estar vacios.
  *
  * @param {object} data - Datos necesarios para crear la necesidad.
  *
  * @returns Regresa la entidad 'Necesidad' creada.
  *
  * @throws {Error} Envia un mensaje de error si uno o mas campos obligatorios estan vacios.
   */
  if (!data.categoria || !data.prioridad || !data.comunaId || !data.cantRequerida || !data.usuarioId) {
    throw new Error('Faltan campos obligatorios: categoria, prioridad, comunaId, cantRequerida, usuarioId')
  }
  return necesidadRepository.crear(data)
},

  async actualizarCobertura(id: number, cantCubierta: number) {
  /** Actualiza la cobertura (`cantCubierta`) de una necesidad y define su estado.
   *
   * Regla de negocio aplicada:
   * - Si 'cantCubierta' es mayor o igual a 'cantRequerida', entonces estado se pasa a `CUBIERTA`
   * - En caso contrario => se mantiene el estado actual (el del registro)
   *
   * @param {number} id - Identificador numerico de la necesidad a actualizar.
   * @param {number} cantCubierta - Cantidad cubierta a registrar.
   *
   * @returns Regresa la entidad 'Necesidad' actualizada.
   *
   * @throws {Error} Se envia un mensaje de error si la necesidad buscada no existe (mensaje: `NOT_FOUND`).
   */
    const necesidad = await necesidadRepository.buscarPorId(id)
    if (!necesidad) throw new Error('NOT_FOUND')

    const nuevoEstado: EstadoNecesidad =
      cantCubierta >= necesidad.cantRequerida ? 'CUBIERTA' : necesidad.estado

    return necesidadRepository.actualizarCobertura(id, cantCubierta, nuevoEstado)
  },
}