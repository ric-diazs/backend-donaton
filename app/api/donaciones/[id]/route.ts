import { NextResponse } from 'next/server'
import { donacionService } from '@/src/service/donacion.service'
import { EstadoDonacion } from '@prisma/client'

// PATCH /api/donaciones/:id → cambiar estado
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nuevoEstado, necesidadId } = body

    const donacionActualizada = await donacionService.cambiarEstado(
      Number(id),
      nuevoEstado as EstadoDonacion,
      necesidadId ? Number(necesidadId) : undefined
    )

    return NextResponse.json(donacionActualizada)
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    const status = mensaje === 'NOT_FOUND' ? 404 : 400
    return NextResponse.json({ error: mensaje }, { status })
  }
}