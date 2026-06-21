import { NextRequest, NextResponse } from "next/server";
import * as usuarioService from "../../../../src/service/usuario.service";

/**
* Archivo route handler que contiene los metodos HTTP GET y DELETE que dependen
* del 'id' del usuario a buscar o a eliminar.
*
*/
export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    /**
    * Se obtiene un usuario filtrado por su identificador o 'id'
    *
    * @param {NextRequest} req - Request (peticion). Si bien no es usado en el cuerpo de la funcion, es esperado por Next
    *                            para llamarla cuando se ejecuta el endpoint '/api/usuarios/:id'
    *
    * @param params - Segmento dinamico con 'id' almacenado como 'string'.
    *                 Aca 'id' se almacena como 'string' porque al ejecutar el endpoint '/api/usuarios/:id', el 'id' es
    *                 guardado por defecto en ese tipo de dato. Al definir ese parametro dinamico de esa manera, se evitan
    *                 problemas de tipado.
    *
    * @returns Regresa objeto JSON con usuario encontrado junto con status code 200 ("ok").
    *          Si surge algun mensaje de error (sea desde Next, Typescript o desde la capa service), se regresa un objeto
    *          JSON con dicho mensaje junto con el status code 400 ("bad request")
    */
    const id = (await params).id;

    try {
        // Aca se convierte la variable 'id' de 'string' a 'number' mediante constructor 'Number', puesto que
        // el parametro 'id' del metodo 'obtenerUsuarioPorId()' del service es de tipo 'number'.
        const usuario = await usuarioService.obtenerUsuarioPorId(Number(id));

        return NextResponse.json(usuario, { status: 200 });
    } catch(err: any) {
        const errorMsg = err?.message ?? "Error al buscar al usuario";

        return NextResponse.json({error: errorMsg}, {status: 400});
    }
};

export const DELETE =  async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    /**
    * Se elimina un usuario filtrado por su identificador o 'id'
    *
    * @param {NextRequest} req - Request (peticion). No es usado en el cuerpo de la funcion, pero es esperado por Next
    *                            para llamarla cuando se ejecuta '/api/usuarios/:id'
    *
    * @param params - Segmento dinamico con 'id' almacenado como 'string'.
    *                 Aca 'id' se almacena como 'string' porque al ejecutar el endpoint '/api/usuarios/:id', el 'id' es
    *                 guardado por defecto en ese tipo de dato. Al definir ese parametro dinamico de esa manera, se evitan
    *                 problemas de tipado.
    *
    * @returns Regresa regresa status code 204 ("no content") si el usuario es encontrado a traves de su 'id'.
    *          Si surge algun mensaje de error (sea desde Next, Typescript o desde la capa service), se regresa un objeto
    *          JSON con dicho mensaje junto con el status code 400 ("bad request")
    */
    const id = (await params).id;

    try {
        // Para ejecutar correctamente el metodo 'eliminarUsuario' que pertenece a 'usuarioService', se convierte el valor
        // de la variable 'id' de 'string' a 'number' mediante el constructor 'Number'.
        await usuarioService.eliminarUsuario(Number(id));

        return new NextResponse(null, { status: 204 });
    } catch(err: any) {
        const errorMsg = err?.message ?? "Error al buscar al usuario";

        return NextResponse.json({error: errorMsg}, {status: 400});
    }
};
