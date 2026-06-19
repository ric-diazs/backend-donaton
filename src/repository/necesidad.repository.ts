import { prisma } from '@/src/lib/prisma'
import { EstadoNecesidad } from '@prisma/client'

export const necesidadRepository = {
  buscarPorId(id: number) {
    return prisma.necesidad.findUnique({
      where: { id },
    })
  },

  actualizarCobertura(id: number, cantCubierta: number, estado: EstadoNecesidad) {
    return prisma.necesidad.update({
      where: { id },
      data: { cantCubierta, estado },
    })
  },
}