import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

// PATCH /api/donaciones/:id → marcar como recibida y generar el OT
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const donacionId = Number(id)

    // Buscamos la donación para validar su estado actual
    const donacionActual = await prisma.donacion.findUnique({
      where: { id: donacionId },
    })

    if (!donacionActual) {
      return NextResponse.json(
        { error: 'Donación no encontrada' },
        { status: 404 }
      )
    }

    if (donacionActual.estado !== 'PENDIENTE') {
      return NextResponse.json(
        { error: 'Solo se pueden confirmar donaciones en estado PENDIENTE' },
        { status: 400 }
      )
    }

    // Generamos el código OT (Orden de Trabajo)
    const año = new Date().getFullYear()
    const numero = Math.floor(1000 + Math.random() * 9000)
    const ot = `OT-${año}-${numero}`

    const donacionActualizada = await prisma.donacion.update({
      where: { id: donacionId },
      data: {
        estado: 'RECIBIDA',
        ot,
      },
    })

    return NextResponse.json(donacionActualizada)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar la donación' },
      { status: 500 }
    )
  }
}