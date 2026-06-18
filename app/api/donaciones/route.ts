import { NextResponse } from 'next/server'
import { donacionService } from '@/src/service/donacion.service'

// GET /api/donaciones → listar todas (lo usa el coordinador)
export async function GET() {
  try {
    const donaciones = await donacionService.listarTodas()
    return NextResponse.json(donaciones)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener las donaciones' },
      { status: 500 }
    )
  }
}

// POST /api/donaciones → crear (lo usa el donante)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const donacion = await donacionService.crear(body)
    return NextResponse.json(donacion, { status: 201 })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear la donación'
    return NextResponse.json({ error: mensaje }, { status: 400 })
  }
}