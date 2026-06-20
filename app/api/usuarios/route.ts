import { NextRequest, NextResponse } from "next/server";
import * as usuarioService from "../../../src/service/usuario.service";

/**
* Este archivo contiene el codigo para la ejecucion de metodos HTTP de /api/usuarios
* En otras palabras, opera como la capa 'controller' bajo patron MVC (model-view-controller)
*
*/
export const GET = async () => {
    /**
    * Metodo GET: Lista todos los usuarios registrados en la base de datos
    *
    * @returns Regresa un status code 204 ("no content") si la lista de usuarios esta vacia.
    *          En caso contrario, regresa objeto JSON con la lista de usuarios registrados y el status code 200 ("ok").
    *
    */
    const usuarios = await usuarioService.obtenerUsuarios();

    if(!usuarios || usuarios.length === 0) {
        return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(usuarios, { status: 200 });
};

export const POST = async (req: NextRequest) => {
    /**
    * Metodo POST: Crea un usuario
    *
    * @param {NextRequest} req: Request (peticion) con body en formato JSON del usuario a registrar
    *
    * @returns Un objeto JSON con el usuario registrado junto con el status code 201 ("created").
    *          Si ocurre algun error, se envia mensaje generado en el codigo o la cadena "Datos inválidos"
    *          junto con el status code 400 ("bad request").
    */
    const body = await req.json();

    try {
        const usuario = await usuarioService.crearUsuario(body);

        return NextResponse.json(usuario, { status: 201 });
    } catch(err: any) {
        return NextResponse.json({ error: err.message ?? 'Datos inválidos'}, { status: 400  });
    }
};
