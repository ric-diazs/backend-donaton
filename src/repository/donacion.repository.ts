import { prisma } from '@/src/lib/prisma'

export const donacionRepository = {
  // Crear una donación nueva (con su donante si viene)
  crear(data: {
    tipo: string
    cantidad: number
    unidad: string
    origen: string
    donanteNombre?: string
    donanteCorreo?: string
  }) {
    return prisma.donacion.create({
      data: {
        tipo: data.tipo,
        cantidad: data.cantidad,
        unidad: data.unidad,
        origen: data.origen,
        estado: 'PENDIENTE',
        donante: data.donanteCorreo
          ? {
              create: {
                nombre: data.donanteNombre ?? 'Anónimo',
                correo: data.donanteCorreo,
              },
            }
          : undefined,
      },
    })
  },

  // Listar todas las donaciones
  listarTodas() {
    return prisma.donacion.findMany({
      orderBy: { fecha: 'desc' },
    })
  },

  // Buscar una donación por su id
  buscarPorId(id: number) {
    return prisma.donacion.findUnique({
      where: { id },
    })
  },

  // Actualizar una donación (estado, ot, necesidadId, etc.)
  actualizar(id: number, data: Record<string, unknown>) {
    return prisma.donacion.update({
      where: { id },
      data,
    })
  },
}