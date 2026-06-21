import { NextResponse } from 'next/server'
import { necesidadService } from '@/src/service/necesidad.service'

/**
* Archivo route handler que contiene el metodo HTTP PATCH que depende
* del 'id' de la necesidad a modificar.
*
*/

// PATCH /api/necesidades/:id → actualiza cobertura
export async function PATCH(
 /**
 * Metodo HTTP PATCH /api/necesidades/:id: Actualiza la cobertura (`cantCubierta`) de la necesidad indicada por `id`.
 *
 * @param request - Request (peticion) con el body junto con los atributos a modificar de la necesidad.
 * @param params - Parámetro dinamico con el `id` como string.
 *
 * @returns Regresa un objeto JSON con la entidad actualizada y el status code 200 ("ok"). Si la necesidad si no existe,
            regresa objeto con status code 404 ("not found") o 400 ("bad request") ante errores de validación/otro.
 */
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