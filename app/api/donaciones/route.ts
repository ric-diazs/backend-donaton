import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

// GET /api/donaciones → listar todas las donaciones (lo usa el coordinador)
export async function GET() {
  try {
    const donaciones = await prisma.donacion.findMany({
      orderBy: { fecha: 'desc' },
    })
    return NextResponse.json(donaciones)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener las donaciones' },
      { status: 500 }
    )
  }
}

// POST /api/donaciones → crear una donación (lo usa el donante)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tipo, cantidad, unidad, origen, donanteNombre, donanteCorreo } = body

    // Validación básica
    if (!tipo || !cantidad || !unidad || !origen) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: tipo, cantidad, unidad, origen' },
        { status: 400 }
      )
    }

    // Creamos (o reutilizamos) el donante por su correo, y la donación
    const donacion = await prisma.donacion.create({
      data: {
        tipo,
        cantidad: Number(cantidad),
        unidad,
        origen,
        estado: 'PENDIENTE', // arranca en PENDIENTE (promesa de donación)
        donante: donanteCorreo
          ? {
              create: {
                nombre: donanteNombre ?? 'Anónimo',
                correo: donanteCorreo,
              },
            }
          : undefined,
      },
    })

    return NextResponse.json(donacion, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear la donación' },
      { status: 500 }
    )
  }
}