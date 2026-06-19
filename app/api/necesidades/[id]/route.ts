import { NextResponse } from 'next/server'
import { necesidadService } from '@/src/service/necesidad.service'

// PATCH /api/necesidades/:id → actualiza cobertura
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    const { cantCubierta } = await request.json()

    if (cantCubierta === undefined) {
      return NextResponse.json(
        { error: 'Se requiere cantCubierta' },
        { status: 400 }
      )
    }

    const necesidad = await necesidadService.actualizarCobertura(id, cantCubierta)
    return NextResponse.json(necesidad)
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar'
    const status  = mensaje === 'NOT_FOUND' ? 404 : 400
    return NextResponse.json({ error: mensaje }, { status })
  }
}