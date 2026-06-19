import { NextRequest, NextResponse } from "next/server";
import * as usuarioService from "../../../../src/service/usuario.service";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const id = (await params).id;

    try {
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
    const id = (await params).id;

    try {
        await usuarioService.eliminarUsuario(Number(id));

        return new NextResponse(null, { status: 204 });
    } catch(err: any) {
        const errorMsg = err?.message ?? "Error al buscar al usuario";

        return NextResponse.json({error: errorMsg}, {status: 400});
    }
};
