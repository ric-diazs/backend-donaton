import { Prisma } from '@prisma/client'
import * as usuarioRepository from '../repository/usuario.repository'

/**
 * Capa de service para operaciones relacionadas con `Usuario`.
 *
 * Encapsula reglas de negocio como "si no existe, lanzar error".
 */
export const obtenerUsuarios = async () => {
  /**
  * Lista todos los usuarios registrados
  *
  * @returns Lista de usuarios registrados 
  *
  */
  return await usuarioRepository.getUsuarios()
}

export const obtenerUsuarioPorId = async (id: number) => {
  /**
  * Se obtiene un usuario filtrado por su identificador o 'id'
  *
  * @param {number} id - Identificador numerico del usuario
  *
  * @returns Regresa la entidad 'Usuario' si es encontrado por su 'id'
  *
  * @throws Envia un mensaje de error si el usuario no es encontrado por su id
  */
  const usuario = await usuarioRepository.getUsuarioById(id)

  // Si el usuario no existe, por el metodo 'getUsuarioById' del repository la variable 'usuario' almacenara el valor 'null'.
  // En Typescript / Javascript, 'null === false', por lo que '!null === true'.
  if (!usuario) {
    throw new Error(`Usuario con id "${id}" no existe`)
  }

  return usuario
}

export const crearUsuario = async (payload: Prisma.UsuarioCreateInput) => {
  /**
  * Crea un usuario a partir de los datos ingresados para su registro
  *
  * @param {Prisma.UsuarioCreateInput} payload - El cuerpo de datos del usuario a registrar.
  *
  * @returns Regresa la entidad 'Usuario' creada.
  *
  */
  return usuarioRepository.createUsuario(payload)
}

export const eliminarUsuario = async (id: number) => {
  /**
  * Elimina un usuario el cual es filtrado por su identificador o 'id'
  *
  * @param {number} id - Identificador numerico del usuario a eliminar
  *
  * @throws Envia un mensaje de error si el usuario no es encontrado por su 'id'
  *
  */
  const usuario = await usuarioRepository.getUsuarioById(id)

  // Si el usuario no existe, por el metodo 'getUsuarioById' del repository la variable 'usuario' almacenara el valor 'null'.
  // En Typescript / Javascript, 'null === false', por lo que '!null === true'.
  if (!usuario) {
    throw new Error(`Usuario con id "${id}" no existe`)
  }

  await usuarioRepository.deleteUsuario(id)
}