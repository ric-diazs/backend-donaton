import { prisma } from '@/src/lib/prisma'
import { EstadoNecesidad } from '@prisma/client'

/**
 * Repositorio para operaciones CRUD sobre la entidad 'Necesidad'.
 *
 * Encapsula el acceso a la base de datos mediante el ORM Prisma.
 */
export const necesidadRepository = {
  buscarPorId(id: number) {
    /**
    * Busca una necesidad filtrando por su identificador o 'id'.
    *
    * @param {number} id - Identificador numerico de la necesidad.
    *
    * @returns Regresa una la entidad 'Necesidad' encontrada para el 'id' ingresado.
    *          Si esta entidad no existe, se retorna el valor 'null'.
    */

    return prisma.necesidad.findUnique({
      where: { id },
    })
  },

  actualizarCobertura(id: number, cantCubierta: number, estado: EstadoNecesidad) {
  /**
   * Actualiza la cobertura (`cantCubierta`) y el estado de una necesidad.
   *
   * @param {number} id - Identificador numérico de la necesidad a actualizar.
   * @param {number} cantCubierta - Cantidad cubierta para la necesidad.
   * @param {EstadoNecesidad} estado - Nuevo estado de la necesidad (`EstadoNecesidad`).
   *
   * @returns Regresa la entidad 'Necesidad' actualizada
   */
    return prisma.necesidad.update({
      where: { id },
      data: { cantCubierta, estado },
    })
  },

  listarTodas() {
    /**
    * Lista todas las necesidades ordenadas de forma ascendente por su `id`.
    * Incluye información de comuna (campo `nombre`).
    *
    * @returns Regresa una lista con todas las necesidades registradas en la base de datos.
    *          Si no hay registros aun, regresa una lista vacia ([]).
    */
    return prisma.necesidad.findMany({
      orderBy: { id: 'asc' },
      include:{ comuna: {select: { nombre: true }} }

    })
  },
  crear(data: {
    categoria: string
    prioridad: string
    comunaId: number
    cantRequerida: number
    usuarioId?: number
  }) {
    /**
    * Crea una nueva necesidad.
    *
    * @param {object} data - Contiene los datos de los atributos requeridos para crear una necesidad.
    *
    * @returns Regresa una entidad 'Necesidad' con los datos ingresados para crearla.
    */
    return prisma.necesidad.create({
      data: {
        categoria:    data.categoria,
        prioridad:    data.prioridad as any,
        comunaId:     data.comunaId,
        cantRequerida: data.cantRequerida,
        usuarioId:   data.usuarioId as number,
        cantCubierta:  0,
        estado:        'ACTIVA',
      },
    })
  },
}