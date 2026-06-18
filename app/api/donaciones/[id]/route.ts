import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

// Transiciones válidas: de qué estado a qué estado se puede pasar
const transicionesValidas: Record<string, string[]> = {
  PENDIENTE: ['RECIBIDA'],
  RECIBIDA: ['DISPONIBLE'],
  DISPONIBLE: ['ASIGNADA'],
  ASIGNADA: ['EN_TRANSITO'],
  EN_TRANSITO: ['ENTREGADA'],
  ENTREGADA: [], // estado final, no avanza más
}

// PATCH /api/donaciones/:id → cambiar el estado de una donación
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const donacionId = Number(id)
    const body = await request.json()
    const { nuevoEstado, necesidadId } = body

    const donacionActual = await prisma.donacion.findUnique({
      where: { id: donacionId },
    })

    if (!donacionActual) {
      return NextResponse.json(
        { error: 'Donación no encontrada' },
        { status: 404 }
      )
    }

    // Validamos que la transición sea válida (no saltarse pasos)
    const siguientesPermitidos = transicionesValidas[donacionActual.estado] ?? []
    if (!siguientesPermitidos.includes(nuevoEstado)) {
      return NextResponse.json(
        {
          error: `No se puede pasar de ${donacionActual.estado} a ${nuevoEstado}`,
        },
        { status: 400 }
      )
    }

    // Datos a actualizar según el caso especial de cada transición
    const data: any = { estado: nuevoEstado }

    // Caso especial: al pasar a RECIBIDA, generamos el OT
    if (nuevoEstado === 'RECIBIDA') {
      const año = new Date().getFullYear()
      const numero = Math.floor(1000 + Math.random() * 9000)
      data.ot = `OT-${año}-${numero}`
    }

    // Caso especial: al ASIGNAR, vinculamos con la necesidad
    if (nuevoEstado === 'ASIGNADA') {
      if (!necesidadId) {
        return NextResponse.json(
          { error: 'Para asignar se requiere necesidadId' },
          { status: 400 }
        )
      }
      data.necesidadId = Number(necesidadId)
    }

    const donacionActualizada = await prisma.donacion.update({
      where: { id: donacionId },
      data,
    })

    // Si se asignó, además suma la cobertura de la necesidad
    if (nuevoEstado === 'ASIGNADA') {
      const necesidad = await prisma.necesidad.findUnique({
        where: { id: Number(necesidadId) },
      })
      if (necesidad) {
        const nuevaCobertura = necesidad.cantCubierta + donacionActualizada.cantidad
        await prisma.necesidad.update({
          where: { id: necesidad.id },
          data: {
            cantCubierta: nuevaCobertura,
            estado: nuevaCobertura >= necesidad.cantRequerida ? 'CUBIERTA' : necesidad.estado,
          },
        })
      }
    }

    return NextResponse.json(donacionActualizada)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar la donación' },
      { status: 500 }
    )
  }
}