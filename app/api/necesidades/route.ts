import { NextResponse } from 'next/server'
import { necesidadService } from '@/src/service/necesidad.service'

// GET /api/necesidades que lista todas (lo usa el coordinador)
export async function GET() {
  try {
    const necesidades = await necesidadService.listarTodas()
    return NextResponse.json(necesidades)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener las necesidades' },
      { status: 500 }
    )
  }
}

// POST /api/necesidades para crear una necesidad nueva
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const necesidad = await necesidadService.crear(body)
    return NextResponse.json(necesidad, { status: 201 })
  } catch (error) {
    console.error('Error POST /api/necesidades:', error)
    const mensaje = error instanceof Error ? error.message : 'Error al crear la necesidad'
    return NextResponse.json({ error: mensaje }, { status: 400 })
  }
}