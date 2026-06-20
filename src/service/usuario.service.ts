import { Prisma } from '@prisma/client'
import * as usuarioRepository from '../repository/usuario.repository'

export const obtenerUsuarios = async () => {
  return await usuarioRepository.getUsuarios()
}

export const obtenerUsuarioPorId = async (id: number) => {
  const usuario = await usuarioRepository.getUsuarioById(id)
  if (!usuario) {
    throw new Error(`Usuario con id "${id}" no existe`)
  }
  return usuario
}

export const crearUsuario = async (payload: Prisma.UsuarioCreateInput) => {
  return usuarioRepository.createUsuario(payload)
}

export const eliminarUsuario = async (id: number) => {
  const usuario = await usuarioRepository.getUsuarioById(id)
  if (!usuario) {
    throw new Error(`Usuario con id "${id}" no existe`)
  }
  await usuarioRepository.deleteUsuario(id)
}