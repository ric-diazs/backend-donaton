import { NextResponse } from 'next/server'
import { donacionService } from '@/src/service/donacion.service'
import { EstadoDonacion } from '@prisma/client'

/**
* Archivo route handler que contiene el metodo HTTP PATCH el cual depende
* del 'id' de la donacion a modificar.
*
*/
export async function PATCH(
  /**
  * Metodo PATCH: Modifica el estado de una donacion filtrada por su id
  *
  * @param {Request} request - Request (peticion) con el body en formato JSON el cual contiene los valores
  *                            de los atributos a actualizar.
  * @param params - Parametro dinamico con identificador de la donacion 'id' tipada como 'string'
  *
  * @returns Regresa un objeto JSON con la donacion modificada con sus datos actualizados junto con el status code 200 ("ok").
  *          Si sucede algun error en el service o generado por el sistema, se envia mensaje atrapado o la cadena 'Error desconocido'
  *          junto con el status code 404 ("not found") si el mensaje de error fue 'NOT_FOUND' o 400 ("bad request") si fue por otro motivo.
  */
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nuevoEstado, necesidadId } = body

    const donacionActualizada = await donacionService.cambiarEstado(
    /**
    * Como el 'id' y la 'necesidadId' se reciben como 'string', estos deben ser casteados a 'number' para que funcione el metodo
    * 'cambiarEstado' de la clase 'donacionService'.
    */
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