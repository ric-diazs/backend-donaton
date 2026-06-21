import { NextResponse } from 'next/server'
import { necesidadService } from '@/src/service/necesidad.service'

/**
* Codigo que maneja la ejecucion de metodos HTTP de /api/necesidades
*
*/
export async function GET() {
 /**
 * Metodo HTTP GET /api/necesidades: Lista todas las necesidades (usado por el coordinador).
 *
 * @returns Regresa objeto JSON con con una lista con todas las necesidades registradas o
 *          un objeto JSON con un mensaje de error junto con el status code 500 ("server error")
 */
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

export async function POST(request: Request) {
 /**
 * Metodo HTTP POST: Crea una nueva necesidad.
 *
 * @param {Request} request - Request (peticion) con el body en formato JSON que contiene los datos de la necesidad a registrar.
 * @returns Regresa un objeto JSON con la necesidad creada junto con el status code 201 ("created") o un mensaje de error
            con el status code 400 ("bad request").
 */
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