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

  listarTodas() {
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