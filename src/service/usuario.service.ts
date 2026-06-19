import { UsuarioCreateInput } from "../../prisma/src/generated/prisma/models";
import * as usuarioRepository from "../repository/usuario.repository";

export const obtenerUsuarios = async () => {
    return await usuarioRepository.getUsuarios();
};

export const obtenerUsuarioPorId = async (id: number) => {
    const usuario = await usuarioRepository.getUsuarioById(id);

    if(!usuario) {
        const errorMsg = new Error(`Usuario con id "${id}" no existe`);

        throw errorMsg;
    }

    return usuario;
};

export const crearUsuario = async (payload: UsuarioCreateInput) => {
    return usuarioRepository.createUsuario(payload);
};

export const eliminarUsuario = async (id: number) => {
    const usuario = await usuarioRepository.getUsuarioById(id);

    if(!usuario) {
        const errorMsg = new Error(`Usuario con id "${id}" no existe`);

        throw errorMsg;
    }

    await usuarioRepository.deleteUsuario(id);
};
