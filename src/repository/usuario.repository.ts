import { prisma } from "../lib/prisma";
import { UsuarioCreateInput, UsuarioUpdateInput } from "../../prisma/src/generated/prisma/models";

export const createUsuario = async (data: UsuarioCreateInput) => {
   return await prisma.usuario.create( { data } ); 
};

export const getUsuarios = async () => {
    return await prisma.usuario.findMany();
};

export const getUsuarioById = async ( id: number ) => {
    return await prisma.usuario.findUnique( { where: { id } });
};

export const updateUsuarioById = async (id: number, data: UsuarioUpdateInput) => {
    return await prisma.usuario.update({ where: { id }, data } );
};

export const deleteUsuario = async ( id: number ) => {
    return await prisma.usuario.delete( { where: { id } });
};
