import { NextRequest, NextResponse } from "next/server";
import * as usuarioService from "../../../src/service/usuario.service";

export const GET = async () => {
    const usuarios = await usuarioService.obtenerUsuarios();

    if(!usuarios || usuarios.length === 0) {
        return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(usuarios, { status: 200 });
};

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    try {
        const usuario = await usuarioService.crearUsuario(body);

        return NextResponse.json(usuario, { status: 201 });
    } catch(err: any) {
        return NextResponse.json({ error: err.message ?? 'Datos inválidos'}, { status: 400  });
    }
};
